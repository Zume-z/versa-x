import { z } from 'zod'
import { env } from '@/env/env.mjs'
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { getOrCreateStripeCustomerIdForUser } from '@/server/stripe/stripe-webhook-handlers'

export const SubType = z.enum(['TRIAL', 'BASIC', 'PREMIUM', 'PREMIER'])
export const SubscriptionSchema = z.object({
  subType: SubType,
})

export const stripeRouter = createTRPCRouter({
  createCheckoutSession: protectedProcedure.input(SubscriptionSchema).mutation(async ({ ctx, input }) => {
    if (input.subType == 'TRIAL') throw new Error('Cannot create checkout for free trial')

    const { stripe, session, prisma, req } = ctx
    const customerId = await getOrCreateStripeCustomerIdForUser({
      prisma,
      stripe,
      userId: session.user?.id,
    })

    if (!customerId) {
      throw new Error('Could not create customer')
    }

    const baseUrl = env.NODE_ENV === 'development' ? `http://${req.headers.host ?? 'localhost:3000'}` : `https://${req.headers.host ?? env.NEXTAUTH_URL}`

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      client_reference_id: session.user?.id,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: env[`PRICE_ID_${input.subType}`],
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/dashboard?checkoutSuccess=true`,
      cancel_url: `${baseUrl}/dashboard?checkoutCanceled=true`,
      subscription_data: {
        metadata: {
          userId: session.user?.id,
        },
      },
    })

    if (!checkoutSession) throw new Error('Could not create checkout session')

    return { checkoutUrl: checkoutSession.url }
  }),

  createBillingPortalSession: protectedProcedure.mutation(async ({ ctx }) => {
    const { stripe, session, prisma, req } = ctx

    const customerId = await getOrCreateStripeCustomerIdForUser({
      prisma,
      stripe,
      userId: session.user?.id,
    })

    if (!customerId) {
      throw new Error('Could not create customer')
    }

    const baseUrl = env.NODE_ENV === 'development' ? `http://${req.headers.host ?? 'localhost:3000'}` : `https://${req.headers.host ?? env.NEXTAUTH_URL}`

    const stripeBillingPortalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${baseUrl}/dashboard`,
    })

    if (!stripeBillingPortalSession) {
      throw new Error('Could not create billing portal session')
    }

    return { billingPortalUrl: stripeBillingPortalSession.url }
  }),

  updateSubscription: protectedProcedure.input(SubscriptionSchema).mutation(async ({ ctx, input }) => {
    if (input.subType == 'TRIAL') throw new Error('Cannot update to free trial')
    const { stripe, session, prisma } = ctx
    const user = await prisma.user.findUnique({
      where: {
        id: session.user?.id,
      },
      select: { subscriptionId: true },
    })

    if (!user) throw new Error('Could not find user')
    if (!user.subscriptionId) throw new Error('Could not find subscription')

    const subscription = await stripe.subscriptions.retrieve(user.subscriptionId)

    if (!subscription || !subscription?.items?.data[0]?.id) throw new Error('Could not find subscription')

    const updateSubscription = await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: false,
      proration_behavior: 'create_prorations',
      items: [
        {
          id: subscription.items.data[0].id,
          price: env[`PRICE_ID_${input.subType}`],
        },
      ],
    })
    return { subscription: updateSubscription }
  }),

  cancelSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    const { stripe, session, prisma } = ctx

    const user = await prisma.user.findUnique({
      where: {
        id: session.user?.id,
      },
      select: { subscriptionId: true },
    })

    if (!user) throw new Error('Could not find user')
    if (!user.subscriptionId) throw new Error('Could not find subscription')

    const subscription = await stripe.subscriptions.update(user.subscriptionId, {
      cancel_at_period_end: true,
    })

    return { subscription: subscription }
  }),
})
