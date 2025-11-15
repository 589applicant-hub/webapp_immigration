import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Calendar, MessageSquare, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function ClientDashboard() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) return null

  // Fetch user data
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      cases: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
      appointments: {
        where: {
          startTime: { gte: new Date() },
        },
        orderBy: { startTime: 'asc' },
        take: 3,
      },
      documents: {
        orderBy: { uploadedAt: 'desc' },
        take: 5,
      },
      messages: {
        where: { isRead: false },
        orderBy: { createdAt: 'desc' },
      },
      payments: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  })

  const activeCases = user?.cases.filter(c => c.status !== 'CLOSED').length || 0
  const upcomingAppointments = user?.appointments.length || 0
  const unreadMessages = user?.messages.length || 0
  const pendingPayments = user?.payments.filter(p => p.status === 'PENDING').length || 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            I-589 Applicant
          </Link>
          <nav className="flex gap-4 items-center">
            <Link href="/dashboard" className="hover:text-primary">Dashboard</Link>
            <Link href="/dashboard/cases" className="hover:text-primary">My Cases</Link>
            <Link href="/dashboard/appointments" className="hover:text-primary">Appointments</Link>
            <Link href="/dashboard/documents" className="hover:text-primary">Documents</Link>
            <Link href="/dashboard/messages" className="hover:text-primary">Messages</Link>
            <Link href="/dashboard/payments" className="hover:text-primary">Payments</Link>
            <Button variant="outline" asChild>
              <Link href="/api/auth/signout">Sign Out</Link>
            </Button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}</h1>
        <p className="text-muted-foreground mb-8">Here's an overview of your immigration case</p>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCases}</div>
              <p className="text-xs text-muted-foreground">
                <Link href="/dashboard/cases" className="text-primary hover:underline">
                  View all cases
                </Link>
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingAppointments}</div>
              <p className="text-xs text-muted-foreground">
                <Link href="/dashboard/appointments" className="text-primary hover:underline">
                  Schedule new
                </Link>
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unreadMessages}</div>
              <p className="text-xs text-muted-foreground">
                <Link href="/dashboard/messages" className="text-primary hover:underline">
                  Read messages
                </Link>
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingPayments}</div>
              <p className="text-xs text-muted-foreground">
                <Link href="/dashboard/payments" className="text-primary hover:underline">
                  View payments
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Cases */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Cases</CardTitle>
              <CardDescription>Your immigration case status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user?.cases.slice(0, 3).map((case_) => (
                  <div key={case_.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{case_.title}</p>
                      <p className="text-sm text-muted-foreground">{case_.caseNumber}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      case_.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      case_.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      case_.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {case_.status}
                    </span>
                  </div>
                ))}
                {user?.cases.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No cases yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your scheduled consultations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user?.appointments.slice(0, 3).map((appointment) => (
                  <div key={appointment.id} className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{appointment.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(appointment.startTime).toLocaleDateString()} at{' '}
                        {new Date(appointment.startTime).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {appointment.status}
                    </span>
                  </div>
                ))}
                {user?.appointments.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No upcoming appointments
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
