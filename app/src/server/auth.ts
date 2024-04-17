import { env } from '@/env/env.mjs'
import { prisma } from '@/server/db'
import EmailProvider from 'next-auth/providers/email'
import { type GetServerSidePropsContext } from 'next'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { getServerSession, type NextAuthOptions, type DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
    } & DefaultSession['user']
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
    // error: async (error, _ctx) => {
    //   // Send to Sentry
    //   // await Sentry.captureException(error);
    //   return Promise.resolve(error)
    // }
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_ID,
      clientSecret: env.GOOGLE_SECRET,
    }),
    EmailProvider({
      server: env.EMAIL_SERVER,
      from: env.EMAIL_FROM,
      // sendVerificationRequest({ identifier: email, url, provider: { server, from }, theme }) {
      //   emailConfig({ identifier: email, url, provider: { server, from }, theme })
      // },
    }),
  ],
  theme: {
    colorScheme: 'auto',
  },

  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    verifyRequest: '/auth/verify-request',
  },
}

export const getServerAuthSession = (ctx: { req: GetServerSidePropsContext['req']; res: GetServerSidePropsContext['res'] }) => {
  return getServerSession(ctx.req, ctx.res, authOptions)
}
