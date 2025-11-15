import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { generateCaseNumber } from '@/lib/utils'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, name, phone, role = 'CLIENT' } = body

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role,
      },
    })

    // Create client profile if role is CLIENT
    if (role === 'CLIENT') {
      await db.clientProfile.create({
        data: {
          userId: user.id,
        },
      })

      // Create initial case
      await db.case.create({
        data: {
          clientId: user.id,
          caseNumber: generateCaseNumber(),
          caseType: 'I-589',
          title: 'Initial Application',
          description: 'Asylum application case',
          status: 'PENDING',
        },
      })
    }

    // Create admin profile if role is ADMIN or SUPERADMIN
    if (role === 'ADMIN' || role === 'SUPERADMIN') {
      await db.adminProfile.create({
        data: {
          userId: user.id,
        },
      })
    }

    return NextResponse.json(
      { message: 'User created successfully', userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
