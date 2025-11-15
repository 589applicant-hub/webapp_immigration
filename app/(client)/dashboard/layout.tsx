import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  // Redirect based on role
  if (session.user.role === 'ADMIN' || session.user.role === 'SUPERADMIN') {
    redirect('/admin/dashboard')
  }

  return children
}
