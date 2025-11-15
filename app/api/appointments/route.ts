import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, description, startTime, endTime, duration = 60 } = body

    if (!title || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const appointment = await db.appointment.create({
      data: {
        clientId: session.user.id,
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        duration,
        status: 'SCHEDULED',
      },
    })

    return NextResponse.json({
      message: 'Appointment created successfully',
      appointment,
    })
  } catch (error) {
    console.error('Appointment error:', error)
    return NextResponse.json(
      { error: 'Appointment creation failed' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const appointments = await db.appointment.findMany({
      where: { clientId: session.user.id },
      orderBy: { startTime: 'desc' },
    })

    return NextResponse.json({ appointments })
  } catch (error) {
    console.error('Fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
}
