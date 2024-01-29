import { z } from 'zod'
import { createEnv } from '@t3-oss/env-nextjs'

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(['development', 'test', 'production']),
    // NEXTAUTH_SECRET: process.env.NODE_ENV === 'production' ? z.string().min(1) : z.string().min(1).optional(),
    NEXTAUTH_SECRET: z.string().min(1),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      process.env.VERCEL ? z.string().min(1) : z.string().url(),
    ),

    NEXT_PUBLIC_SENTRY_DSN: z.string(),
    GOOGLE_ID: z.string(),
    GOOGLE_SECRET: z.string(),
    GPTAPI_KEY: z.string(),
    EMAIL_SERVER: z.string().url(),
    EMAIL_FROM: z.string().email(),

    STRIPE_PK: z.string(),
    STRIPE_SK: z.string(),
    STRIPE_WEBHOOK_SECRET: z.string(),

    PRICE_ID_BASIC: z.string(),
    PRICE_ID_PREMIUM: z.string(),
    PRICE_ID_PREMIER: z.string(),
  },

  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string().min(1),
  },

  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,

    GOOGLE_ID: process.env.GOOGLE_ID,
    GOOGLE_SECRET: process.env.GOOGLE_SECRET,
    GPTAPI_KEY: process.env.GPTAPI_KEY,
    EMAIL_SERVER: process.env.EMAIL_SERVER,
    EMAIL_FROM: process.env.EMAIL_FROM,

    STRIPE_PK: process.env.STRIPE_PK,
    STRIPE_SK: process.env.STRIPE_SK,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,

    PRICE_ID_BASIC: process.env.PRICE_ID_BASIC,
    PRICE_ID_PREMIUM: process.env.PRICE_ID_PREMIUM,
    PRICE_ID_PREMIER: process.env.PRICE_ID_PREMIER,
  },
})
