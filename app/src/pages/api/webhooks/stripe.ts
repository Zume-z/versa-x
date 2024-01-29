import { buffer } from 'micro'
import type Stripe from 'stripe'
import { env } from '@/env/env.mjs'
import { prisma } from '@/server/db'
import { stripe } from '@/server/stripe/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { handleInvoiceCreated, handleInvoicePaid, handleInvoicePaymentFailed, handleSubscriptionCanceled, handleSubscriptionCreated, handleSubscriptionUpdated } from '@/server/stripe/stripe-webhook-handlers'

export const config = {
  api: {
    bodyParser: false,
  },
}

const webhookSecret = env.STRIPE_WEBHOOK_SECRET

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const buf = await buffer(req)
    const sig = req.headers['stripe-signature']

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(buf, sig as string, webhookSecret)

      switch (event.type) {
        case 'invoice.paid':
          await handleInvoicePaid({
            event,
            stripe,
            prisma,
          })
          break
        case 'invoice.created':
          await handleInvoiceCreated({
            event,
            stripe,
            prisma,
          })
          break

        case 'customer.subscription.created':
          await handleSubscriptionCreated({
            event,
            prisma,
          })
          break
        case 'customer.subscription.updated':
          await handleSubscriptionUpdated({
            event,
            prisma,
          })
          break
        case 'invoice.payment_failed':
          await handleInvoicePaymentFailed({
            event,
            stripe,
            prisma,
          })
          break
        case 'customer.subscription.deleted':
          await handleSubscriptionCanceled({
            event,
            prisma,
          })
          break
        default:
        // Unexpected event type
      }

      // record the event in the database
      await prisma.stripeEvent.create({
        data: {
          id: event.id,
          type: event.type,
          object: event.object,
          api_version: event.api_version,
          account: event.account,
          created: new Date(event.created * 1000), // convert to milliseconds
          data: {
            object: event.data.object,
            previous_attributes: event.data.previous_attributes,
          },
          livemode: event.livemode,
          pending_webhooks: event.pending_webhooks,
          request: {
            id: event.request?.id,
            idempotency_key: event.request?.idempotency_key,
          },
        },
      })

      res.json({ received: true })
    } catch (err) {
      res.status(400).send(err)
      return
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}
