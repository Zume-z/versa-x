import { z } from 'zod'

import { createTRPCRouter, publicProcedure, protectedProcedure } from '@/server/api/trpc'

export const sessionSchema = z.object({
  sessionToken: z.string(),
})

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure.input(z.object({ text: z.string() })).query(({ input }) => {
    return {
      greeting: `Hello ${input.text}`,
    }
  }),

  greeting: publicProcedure.query(() => {
    return {
      greeting: 'Hello World',
    }
  }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany()
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return 'you can now see this secret message!'
  }),

  getSession: publicProcedure.input(sessionSchema).query(({ ctx, input }) => {
    return ctx.prisma.session.findUnique({
      where: {
        sessionToken: input.sessionToken,
      },
      include: { user: true },
    })
  }),
})
