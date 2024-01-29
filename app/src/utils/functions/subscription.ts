import { z } from 'zod'
import { AppRouter } from '@/server/api/root'
import { checkActiveTrial } from './functions'
import { inferRouterOutputs } from '@trpc/server'
import { TRPCClientErrorLike } from '@trpc/client'
import { SubscriptionStatus } from '@prisma/client'
import { ERROR_CODE } from '../constants/interfaces'
import { SubType } from '@/server/api/routers/stripe'
import { UseTRPCQueryResult } from '@trpc/react-query/shared'
import { convDate, convTimeStamp, trialEndDate } from './convert'
import { subscriptionModel as subModel } from '../constants/subscriptionModel'

// OLD
// export enum PRODUCT_ID {
//   BASIC = 'prod_NzHgcec58VLlBB',
//   PREMIUM = 'prod_NzIvZgAafimPr8',
//   PREMIER = 'prod_Nzf8oJQVhed48D',
// }

export enum PRODUCT_ID {
  BASIC = 'prod_OAUsZuJtXau49W',
  PREMIUM = 'prod_OAUtKvvqkSp6VH',
  PREMIER = 'prod_OAUwNBm9rmnymB',
}

export interface SubscriptionData {
  type: string
  id: z.infer<typeof SubType> | null
  status: SubscriptionStatus
  price: number
  tokenTotal: number
  tokenBalance?: number
  currentPeriodStart?: string
  currentPeriodEnd?: string
  cancelAt?: string
  admin?: boolean
}

export interface SessionData {
  id: string
  userId: string
  expires: string
  tokenCount: number
  subscriptionStatus?: SubscriptionStatus
  productId?: string
  trialStartedAt: Date
  image?: string
  admin?: boolean
  validSession?: boolean
  error?: ERROR_CODE
  subTier?: z.infer<typeof SubType> | null
}

// Get subscription data
export const formatSubData = (data: UseTRPCQueryResult<inferRouterOutputs<AppRouter>['user']['subscriptionData'], TRPCClientErrorLike<AppRouter>>['data']): SubscriptionData | null => {
  // Check if user is admin
  if (data?.admin) {
    const adminSub: SubscriptionData = { type: 'Admin', id: 'PREMIER', status: 'active', price: 0, tokenTotal: subModel.premier.tokens, tokenBalance: data?.tokenCount, admin: true }
    return adminSub
  }
  // Check Active
  if (data?.subscriptionStatus == 'active') {
    switch (data?.productId) {
      case PRODUCT_ID.BASIC:
        const basicActiveSub: SubscriptionData = { type: 'Basic', id: 'BASIC' as typeof SubType.Values.BASIC, status: 'active', price: subModel.basic.price, tokenTotal: subModel.basic.tokens, tokenBalance: data?.tokenCount, currentPeriodStart: convTimeStamp('MONTH', data?.currentPeriodStart), currentPeriodEnd: convTimeStamp('MONTH', data?.currentPeriodEnd), cancelAt: convTimeStamp('MONTH', data?.cancelAt) }
        return basicActiveSub
      case PRODUCT_ID.PREMIUM:
        const premiumActiveSub: SubscriptionData = { type: 'Premium', id: 'PREMIUM' as typeof SubType.Values.PREMIUM, status: 'active', price: subModel.premium.price, tokenTotal: subModel.premium.tokens, tokenBalance: data?.tokenCount, currentPeriodStart: convTimeStamp('MONTH', data?.currentPeriodStart), currentPeriodEnd: convTimeStamp('MONTH', data?.currentPeriodEnd), cancelAt: convTimeStamp('MONTH', data?.cancelAt) }
        return premiumActiveSub
      case PRODUCT_ID.PREMIER:
        const premierActiveSub: SubscriptionData = { type: 'Premier', id: 'PREMIER' as typeof SubType.Values.PREMIER, status: 'active', price: subModel.premier.price, tokenTotal: subModel.premier.tokens, tokenBalance: data?.tokenCount, currentPeriodStart: convTimeStamp('MONTH', data?.currentPeriodStart), currentPeriodEnd: convTimeStamp('MONTH', data?.currentPeriodEnd), cancelAt: convTimeStamp('MONTH', data?.cancelAt) }
        return premierActiveSub
    }
  }
  // Check Past Due
  if (data?.subscriptionStatus == 'past_due') {
    switch (data?.productId) {
      case PRODUCT_ID.BASIC:
        const basicPastDueSub: SubscriptionData = { type: 'Basic', id: 'BASIC' as typeof SubType.Values.BASIC, status: 'past_due', price: subModel.basic.price, tokenTotal: subModel.basic.tokens, tokenBalance: data?.tokenCount, currentPeriodStart: convTimeStamp('MONTH', data?.currentPeriodStart), currentPeriodEnd: convTimeStamp('MONTH', data?.currentPeriodEnd), cancelAt: convTimeStamp('MONTH', data?.cancelAt) }
        return basicPastDueSub
      case 'prod_NzIvZgAafimPr8':
        const premiumActiveSub: SubscriptionData = { type: 'Premium', id: 'PREMIUM' as typeof SubType.Values.PREMIUM, status: 'past_due', price: subModel.premium.price, tokenTotal: subModel.premium.tokens, tokenBalance: data?.tokenCount, currentPeriodStart: convTimeStamp('MONTH', data?.currentPeriodStart), currentPeriodEnd: convTimeStamp('MONTH', data?.currentPeriodEnd), cancelAt: convTimeStamp('MONTH', data?.cancelAt) }
        return premiumActiveSub
      case 'prod_Nzf8oJQVhed48D':
        const premierActiveSub: SubscriptionData = { type: 'Premier', id: 'PREMIER' as typeof SubType.Values.PREMIER, status: 'past_due', price: subModel.premier.price, tokenTotal: subModel.premier.tokens, tokenBalance: data?.tokenCount, currentPeriodStart: convTimeStamp('MONTH', data?.currentPeriodStart), currentPeriodEnd: convTimeStamp('MONTH', data?.currentPeriodEnd), cancelAt: convTimeStamp('MONTH', data?.cancelAt) }
        return premierActiveSub
    }
  }
  // Check Trial
  if (checkActiveTrial(data?.trialStartedAt) && !data?.productId && !data?.subscriptionStatus) {
    const trialActiveSub: SubscriptionData = { type: 'Free Trial', id: 'TRIAL' as typeof SubType.Values.TRIAL, status: 'trialing', price: subModel.freeTrial.price, tokenTotal: subModel.freeTrial.tokens, tokenBalance: data?.tokenCount, currentPeriodStart: convDate('MONTH', data?.trialStartedAt), currentPeriodEnd: trialEndDate('MONTH', data?.trialStartedAt), cancelAt: trialEndDate('MONTH', data?.trialStartedAt) }
    return trialActiveSub
  }

  return null
}

export const formatSessionData = (session: SessionData): SessionData => {
  // - Check Admin
  if (session?.admin) return { ...session, validSession: true }

  // - Check Active Subscription
  if (session.subscriptionStatus == 'active') {
    switch (session?.productId) {
      // - Basic Active Subscription
      case PRODUCT_ID.BASIC:
        session.subTier = 'BASIC'
        if (session.tokenCount < subModel.basic.tokens) return { ...session, validSession: true }
        else return { ...session, validSession: false, error: ERROR_CODE.TOKEN_LIMIT_EXCEEDED }

      // - Premium Active Subscription
      case PRODUCT_ID.PREMIUM:
        session.subTier = 'PREMIUM'
        if (session.tokenCount < subModel.premium.tokens) return { ...session, validSession: true }
        else return { ...session, validSession: false, error: ERROR_CODE.TOKEN_LIMIT_EXCEEDED }

      // - Premier Active Subscription
      case PRODUCT_ID.PREMIER:
        session.subTier = 'PREMIER'
        if (session.tokenCount < subModel.premier.tokens) return { ...session, validSession: true }
        else return { ...session, validSession: false, error: ERROR_CODE.TOKEN_LIMIT_EXCEEDED }
    }
  }

  // - Check Past Due Subscription
  if (session?.subscriptionStatus == 'past_due') {
    return { ...session, validSession: false, error: ERROR_CODE.PAYMENT_PAST_DUE }
  }

  // - Check Active Trial Subscription
  if (checkActiveTrial(session?.trialStartedAt) && !session?.subscriptionStatus) {
    // - Trial Active Subscription
    session.subTier = 'TRIAL'
    if (session.tokenCount < subModel.freeTrial.tokens) return { ...session, validSession: true }
    else return { ...session, validSession: false, error: ERROR_CODE.TOKEN_LIMIT_EXCEEDED }
  }

  // No Subscription
  return { ...session, validSession: false, error: ERROR_CODE.SUBSCRIPTION_NOT_FOUND }
}

// // Check if subscription is valid
// export const checkValidSubscription = (data: SessionData) => {
//   // Admin
//   if (data?.admin) return { res: true }

//   // Active Subscription
//   if (data.subscriptionStatus == 'active') {
//     switch (data?.productId) {
//       case PRODUCT_ID.BASIC:
//         // Basic Subscription
//         if (data.tokenCount < subModel.basic.tokens) return { res: true }
//         else return { res: false, error: ERROR_CODE.TOKEN_LIMIT_EXCEEDED }

//       case 'prod_NzIvZgAafimPr8':
//         // Premium Subscription
//         if (data.tokenCount < subModel.premium.tokens) return { res: true }
//         else return { res: false, error: ERROR_CODE.TOKEN_LIMIT_EXCEEDED }

//       case 'prod_Nzf8oJQVhed48D':
//         // Unlimited Subscription
//         return { res: true }
//     }
//     return { res: false, error: ERROR_CODE.SUBSCRIPTION_NOT_FOUND }
//   }

//   // Active Trial Subscription
//   if (checkActiveTrial(data?.trialStartedAt) && !data?.subscriptionStatus) {
//     // Trial Subscription
//     if (data.tokenCount < subModel.freeTrial.tokens) return { res: true }
//     else return { res: false, error: ERROR_CODE.TOKEN_LIMIT_EXCEEDED }
//   }

//   // Past Due Subscription
//   if (data?.subscriptionStatus == 'past_due') {
//     return { res: false, error: ERROR_CODE.PAYMENT_PAST_DUE }
//   }

//   // No Subscription
//   return { res: false, error: ERROR_CODE.SUBSCRIPTION_NOT_FOUND }
// }

// export const configValidSubscription = (data: SessionData) => {
//   const session: SesssionUpdate = data

//   // Admin
//   if (data?.admin) return { ...session, tokenCountExceeded: false }

//   // Active Subscription
//   if (data.subscriptionStatus == 'active') {
//     switch (data?.productId) {
//       case 'prod_NzHgcec58VLlBB':
//         // Basic Subscription
//         session.subTier = 'BASIC'
//         if (data.tokenCount < subModel.basic.tokens) return { ...session, tokenCountExceeded: false }
//         else return { ...session, tokenCountExceeded: true, error: ERROR_CODE.TOKEN_LIMIT_EXCEEDED }

//       case 'prod_NzIvZgAafimPr8':
//         // Premium Subscription
//         session.subTier = 'PREMIUM'
//         if (data.tokenCount < subModel.premium.tokens) return { ...session, tokenCountExceeded: false }
//         else return { ...session, tokenCountExceeded: true, error: ERROR_CODE.TOKEN_LIMIT_EXCEEDED }

//       case 'prod_Nzf8oJQVhed48D':
//         // Unlimited Subscription
//         return { ...session, subTier: 'PREMIER', tokenCountExceeded: false }
//     }
//     return session
//   }

//   // Past Due Subscription
//   if (data?.subscriptionStatus == 'past_due') {
//     return { ...session, pastDue: true, error: ERROR_CODE.PAYMENT_PAST_DUE }
//   }

//   // Active Trial Subscription
//   if (checkActiveTrial(data?.trialStartedAt) && !data?.subscriptionStatus) {
//     // Trial Subscription
//     session.subTier = 'TRIAL'
//     if (data.tokenCount < subModel.freeTrial.tokens) return { ...session, tokenCountExceeded: false }
//     else return { ...session, tokenCountExceeded: true, error: ERROR_CODE.TOKEN_LIMIT_EXCEEDED }
//   }

//   // No Subscription
//   return { ...session, error: ERROR_CODE.SUBSCRIPTION_NOT_FOUND }
// }
