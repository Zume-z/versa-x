import { z } from 'zod'
import { SubType } from '@/server/api/routers/stripe'

export interface SubsciptionTier {
  name: string
  id: string
  href: string
  price: number
  tokens: number

  billingPeriod: string
  description: string
  selectTitle: string
  subType: z.infer<typeof SubType>
}

export interface SubscriptionModel {
  freeTrial: SubsciptionTier
  basic: SubsciptionTier
  premium: SubsciptionTier
  premier: SubsciptionTier
}

export const subscriptionFrequencies = {
  monthly: { value: 'monthly', label: 'Monthly', priceSuffix: '/month' },
  annually: { value: 'annually', label: 'Annually', priceSuffix: '/year' },
}

export const subscriptionModel: SubscriptionModel = {
  freeTrial: {
    name: 'Free Trial',
    id: 'tier-free',
    subType: 'TRIAL',
    href: '#',
    price: 0,
    tokens: 1000000,
    billingPeriod: '7 days',
    selectTitle: 'Start your free trial',
    description: 'No credit card or commitment to a long-term contract required, just download and sign in to get started with your 7 day free trial.',
  },
  basic: {
    name: 'Basic',
    id: 'tier-basic',
    subType: 'BASIC',
    href: '#',
    price: 5,
    tokens: 1250000,
    billingPeriod: 'Monthly',
    selectTitle: 'Select plan',
    description: "Affordable access to essential features and functionality, providing a solid foundation for leveraging our browser extension's capabilities.",
  },
  premium: {
    name: 'Premium',
    subType: 'PREMIUM',
    id: 'tier-premium',
    href: '#',
    price: 10,
    tokens: 3000000,
    billingPeriod: 'Monthly',
    selectTitle: 'Select plan',
    description: 'Our Premium model aims to elevate the daily users browsing experience with tailored text generation and precise relevant answers allowing for data-driven decision making.',
  },
  premier: {
    name: 'Premier',
    id: 'tier-premier',
    subType: 'PREMIER',
    href: '#',
    price: 25,
    tokens: 9000000,
    billingPeriod: 'Monthly',
    selectTitle: 'Select plan',
    description: 'Designed with commercial usage in mind, the premier model offers enhanced productivity as you harness the power of adaptive text generation and personalised insights.',
  },
}
