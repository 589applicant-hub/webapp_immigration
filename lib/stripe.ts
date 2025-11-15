import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
})

export async function createPaymentIntent(
  amount: number,
  currency: string = 'usd',
  metadata?: Record<string, string>
) {
  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency,
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  })
}

export async function createCustomer(
  email: string,
  name?: string,
  metadata?: Record<string, string>
) {
  return await stripe.customers.create({
    email,
    name,
    metadata,
  })
}

export async function createInvoice(
  customerId: string,
  description: string,
  amount: number,
  currency: string = 'usd'
) {
  // Create invoice item
  await stripe.invoiceItems.create({
    customer: customerId,
    amount: Math.round(amount * 100),
    currency,
    description,
  })

  // Create and finalize invoice
  const invoice = await stripe.invoices.create({
    customer: customerId,
    auto_advance: true,
  })

  return await stripe.invoices.finalizeInvoice(invoice.id)
}

export async function refundPayment(
  paymentIntentId: string,
  amount?: number,
  reason?: string
) {
  return await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount: amount ? Math.round(amount * 100) : undefined,
    reason: reason as Stripe.RefundCreateParams.Reason,
  })
}
