import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { GptModel, Prisma } from '@prisma/client'
import { z } from 'zod'

export const subscriptionSchema = z.object({
  data: z.string().optional(),
})

export const updateUserSettingsSchema = z.object({
  genPrompts: z.boolean(),

  gptModel: z.enum(['gpt35turbo', 'gpt4']),
})

export const userRouter = createTRPCRouter({
  subscriptionData: protectedProcedure.input(subscriptionSchema).query(async ({ ctx }) => {
    const { session, prisma } = ctx

    if (!session.user?.id) {
      throw new Error('Not authenticated')
    }

    const data = await prisma.user.findUnique({
      where: {
        id: session.user?.id,
      },
      select: {
        subscriptionStatus: true,
        subscriptionId: true,
        tokenCount: true,
        productId: true,
        currentPeriodStart: true,
        currentPeriodEnd: true,
        cancelAt: true,
        image: true,
        trialStartedAt: true,
        admin: true,
        genPrompts: true,
        gptModel: true,
      },
    })

    if (!data) {
      throw new Error('Could not find user')
    }

    return data
  }),

  updateUserSettings: protectedProcedure.input(updateUserSettingsSchema).mutation(async ({ ctx, input }) => {
    const { session, prisma } = ctx

    if (input.genPrompts) {
    }

    const updateUser = await prisma.user.update({
      where: {
        id: session.user?.id,
      },
      data: {
        genPrompts: input.genPrompts,
        gptModel: input.gptModel,
      },
    })

    if (!updateUser) {
      throw new Error('Could not update user')
    }
    return { user: updateUser }
  }),
})
