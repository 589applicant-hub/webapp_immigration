import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import Stripe from 'stripe'
import { db } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

export async function POST(req: Request) {
  try {
    const sig = req.headers.get('stripe-signature')
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!sig || !webhookSecret) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    const body = await req.text()
    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret)

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        // Update payment record
        await db.payment.updateMany({
          where: { stripePaymentId: paymentIntent.id },
          data: {
            status: 'COMPLETED',
            paymentMethod: paymentIntent.payment_method_types[0],
          },
        })
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        await db.payment.updateMany({
          where: { stripePaymentId: paymentIntent.id },
          data: { status: 'FAILED' },
        })
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        
        await db.payment.updateMany({
          where: { stripeInvoiceId: invoice.id },
          data: {
            status: 'COMPLETED',
            receiptUrl: invoice.hosted_invoice_url,
          },
        })
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        
        if (charge.payment_intent) {
          await db.payment.updateMany({
            where: { stripePaymentId: charge.payment_intent as string },
            data: {
              status: 'REFUNDED',
              refundAmount: charge.amount_refunded / 100,
            },
          })
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
