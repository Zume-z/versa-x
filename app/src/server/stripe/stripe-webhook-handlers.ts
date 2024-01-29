import type Stripe from 'stripe'
import { TRPCError } from '@trpc/server'
import type { PrismaClient } from '@prisma/client'

// Retrieve a Stripe customer id for a given user if it exists or create a new one
export const getOrCreateStripeCustomerIdForUser = async ({ stripe, prisma, userId }: { stripe: Stripe; prisma: PrismaClient; userId: string }) => {
  // Get user
  const user = await prisma.user.findUnique({ where: { id: userId } })

  // If no user throw error
  if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found: getOrCreateStripeCustomerIdForUser' })

  // If user already has a customer id, return it
  if (user.customerId) return user.customerId

  // If no customer Id create a new customer : Use metadata to link this Stripe customer to internal user id
  const customer = await stripe.customers.create({ email: user.email ?? undefined, name: user.name ?? undefined, metadata: { userId } })

  // Update with new customer id
  const updatedUser = await prisma.user.update({ where: { id: userId }, data: { customerId: customer.id } })

  // If user was not updated throw error
  if (!updatedUser) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'UpdateUser Failed: getOrCreateStripeCustomerIdForUser' })

  // Return new customer id
  if (updatedUser.customerId) return updatedUser.customerId
}

export const handleSubscriptionCreated = async ({ event, prisma }: { event: Stripe.Event; prisma: PrismaClient }) => {
  const subscription = event.data.object as Stripe.Subscription

  // Get user id from metadata
  const userId = subscription.metadata.userId

  // If no user id throw error
  if (!userId) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found in metadata: handleSubscriptionCreated' })

  // Update user with subscription data | Reset TokenCount
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      subscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      productId: subscription.items.data[0]?.price.product as string,
      currentPeriodStart: subscription.current_period_start,
      currentPeriodEnd: subscription.current_period_end,
      cancelAt: subscription.cancel_at,
      tokenCount: 0,
    },
  })
  // If user was not updated throw error
  if (!updatedUser) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'UpdateUser failed: handleSubscriptionCreated' })
}

export const handleSubscriptionUpdated = async ({ event, prisma }: { event: Stripe.Event; prisma: PrismaClient }) => {
  const subscription = event.data.object as Stripe.Subscription

  // Get user id from metadata
  const userId = subscription.metadata.userId

  // If no user id throw error
  if (!userId) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found in metadata: handleSubscriptionUpdated' })

  // Update user with subscription data
  const userUpdate = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      subscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      productId: subscription.items.data[0]?.price.product as string,
      currentPeriodStart: subscription.current_period_start,
      currentPeriodEnd: subscription.current_period_end,
      cancelAt: subscription.cancel_at,
    },
  })

  // If user was not updated throw error
  if (!userUpdate) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'UpdateUser Failed: handleSubscriptionUpdated' })
}

export const handleInvoicePaid = async ({ event, stripe, prisma }: { event: Stripe.Event; stripe: Stripe; prisma: PrismaClient }) => {
  const invoice = event.data.object as Stripe.Invoice
  const subscriptionId = invoice.subscription
  const subscription = await stripe.subscriptions.retrieve(subscriptionId as string)

  // If no subscription throw error
  if (!subscription) throw new TRPCError({ code: 'NOT_FOUND', message: 'Subscription not found: handleInvoicePaid' })

  // Get user id from metadata
  const userId = subscription.metadata.userId

  // If no user id throw error
  if (!userId) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found in metadata: handleInvoicePaid' })

  // Update user with subscription data
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      subscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      productId: subscription.items.data[0]?.price.product as string,
      currentPeriodStart: subscription.current_period_start,
      currentPeriodEnd: subscription.current_period_end,
      cancelAt: subscription.cancel_at,
    },
  })

  // If user was not updated throw error
  if (!updatedUser) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'UpdateUser Failed: handleInvoicePaid' })
}

export const handleInvoiceCreated = async ({ event, stripe, prisma }: { event: Stripe.Event; stripe: Stripe; prisma: PrismaClient }) => {
  const invoice = event.data.object as Stripe.Invoice
  const subscriptionId = invoice.subscription
  const subscription = await stripe.subscriptions.retrieve(subscriptionId as string)

  // If no subscription throw error
  if (!subscription) throw new TRPCError({ code: 'NOT_FOUND', message: 'Subscription not found: handleInvoiceCreated' })

  // Get user id from metadata
  const userId = subscription.metadata.userId

  // If no user id throw error
  if (!userId) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found in metadata: handleInvoiceCreated' })

  // Update user | Reset TokenCount
  const updatedUser = await prisma.user.update({ where: { id: userId }, data: { tokenCount: 0 } })

  // If user was not updated throw error
  if (!updatedUser) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'UpdateUser Failed: handleInvoiceCreated' })
}

export const handleInvoicePaymentFailed = async ({ event, stripe, prisma }: { event: Stripe.Event; stripe: Stripe; prisma: PrismaClient }) => {
  const invoice = event.data.object as Stripe.Invoice
  const subscriptionId = invoice.subscription
  const subscription = await stripe.subscriptions.retrieve(subscriptionId as string)

  // If no subscription throw error
  if (!subscription) throw new TRPCError({ code: 'NOT_FOUND', message: 'Subscription not found: handleInvoicePaymentFailed' })

  // Get user id from metadata
  const userId = subscription.metadata.userId

  // If no user id throw error
  if (!userId) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found in metadata: handleInvoicePaymentFailed' })

  // Update user with subscription data
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      subscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      productId: subscription.items.data[0]?.price.product as string,
      currentPeriodStart: subscription.current_period_start,
      currentPeriodEnd: subscription.current_period_end,
      cancelAt: subscription.cancel_at,
    },
  })

  // If user was not updated throw error
  if (!updatedUser) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'UpdateUser Failed: handleInvoicePaymentFailed' })
}

export const handleSubscriptionCanceled = async ({ event, prisma }: { event: Stripe.Event; prisma: PrismaClient }) => {
  const subscription = event.data.object as Stripe.Subscription

  const userId = subscription.metadata.userId

  // If no user id throw error
  if (!userId) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found in metadata: handleSubscriptionCanceled' })

  // Clear user subscription data
  const userUpdate = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      subscriptionId: null,
      subscriptionStatus: null,
      productId: null,
      currentPeriodEnd: null,
      currentPeriodStart: null,
      cancelAt: null,
    },
  })

  // If user was not updated throw error
  if (!userUpdate) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'UpdateUser Failed: handleSubscriptionCanceled' })
}
