import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { createPaymentIntent } from '@/lib/stripe'
import { generateInvoiceNumber } from '@/lib/utils'

export async function POST(req: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { amount, description } = body

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    // Create Stripe payment intent
    const paymentIntent = await createPaymentIntent(
      amount,
      'usd',
      {
        userId: session.user.id,
        description: description || 'Immigration service payment',
      }
    )

    // Create payment record
    const payment = await db.payment.create({
      data: {
        userId: session.user.id,
        amount,
        currency: 'USD',
        status: 'PENDING',
        stripePaymentId: paymentIntent.id,
        description: description || 'Immigration service payment',
        invoiceNumber: generateInvoiceNumber(),
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment.id,
    })
  } catch (error) {
    console.error('Payment error:', error)
    return NextResponse.json(
      { error: 'Payment creation failed' },
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

    const payments = await db.payment.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ payments })
  } catch (error) {
    console.error('Fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}
