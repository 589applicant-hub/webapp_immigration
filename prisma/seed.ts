import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@589applicant.com' },
    update: {},
    create: {
      email: 'admin@589applicant.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'SUPERADMIN',
    },
  })

  await prisma.adminProfile.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      position: 'Immigration Specialist',
      department: 'Legal Services',
    },
  })

  // Create sample blog posts
  await prisma.blogPost.upsert({
    where: { slug: 'understanding-i-589-application' },
    update: {},
    create: {
      title: 'Understanding the I-589 Application Process',
      slug: 'understanding-i-589-application',
      excerpt: 'A comprehensive guide to navigating the I-589 asylum application process.',
      content: '<h2>Introduction</h2><p>The I-589 application is crucial for individuals seeking asylum in the United States...</p>',
      author: 'Immigration Team',
      published: true,
      featured: true,
      tags: ['asylum', 'i-589', 'immigration'],
      category: 'Guides',
      readTime: 10,
      publishedAt: new Date(),
    },
  })

  await prisma.blogPost.upsert({
    where: { slug: 'required-documents-asylum' },
    update: {},
    create: {
      title: 'Required Documents for Your Asylum Application',
      slug: 'required-documents-asylum',
      excerpt: 'Essential documents you need to prepare for a successful asylum application.',
      content: '<h2>Document Checklist</h2><p>Here are the key documents you will need...</p>',
      author: 'Legal Team',
      published: true,
      featured: true,
      tags: ['documents', 'asylum', 'checklist'],
      category: 'Resources',
      readTime: 8,
      publishedAt: new Date(),
    },
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
