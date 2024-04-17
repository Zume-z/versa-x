import { userRouter } from './routers/user'
import { stripeRouter } from './routers/stripe'
import { createTRPCRouter } from '@/server/api/trpc'

export const appRouter = createTRPCRouter({
  stripe: stripeRouter,
  user: userRouter,
})

export type AppRouter = typeof appRouter
