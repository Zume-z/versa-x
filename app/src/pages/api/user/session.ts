import { env } from '@/env/env.mjs'
import { Client } from '@planetscale/database'
import { init } from '@dqbd/tiktoken/lite/init'
import { RequestCookies } from '@edge-runtime/cookies'
// @ts-expect-error - no types
import wasm from '@dqbd/tiktoken/lite/tiktoken_bg.wasm?module'
import { SessionData, formatSessionData } from '@/utils/functions/subscription'
import { ERROR_CODE } from '@/utils/constants/interfaces'

export const config = {
  runtime: 'edge',
}

const db = new Client({
  url: env.DATABASE_URL,
})

export default async function POST(req: Request): Promise<Response> {
  // - init tiktoken
  await init((imports) => WebAssembly.instantiate(wasm, imports))

  // - Get cookie next-auth.session-token
  const cookies = new RequestCookies(req.headers)

  // - next-auth.session-token
  const sessionToken = cookies.get('__Secure-next-auth.session-token')?.value

  // - If session doesn’t exist return 401
  if (!sessionToken) return new Response(ERROR_CODE.SESSION_TOKEN_NOT_FOUND, { status: 401, statusText: ERROR_CODE.SESSION_NOT_FOUND })

  // - Query database for that session and attach user: Using DB planetscale
  const conn = db.connection()
  const [session] = await Promise.all([conn.execute('SELECT Session.id, Session.userId, Session.expires, User.tokenCount, User.subscriptionStatus, User.productId, User.trialStartedAt, User.image, User.admin, User.genPrompts FROM Session INNER JOIN User ON Session.userId=User.id WHERE Session.sessionToken = ? ', [sessionToken])])

  // - If session doesn’t exist return 401
  if (!session.rows.length) return new Response(ERROR_CODE.SESSION_NOT_FOUND, { status: 401, statusText: ERROR_CODE.SESSION_NOT_FOUND })

  // - Get session data
  const sessionRow = session.rows[0] as SessionData

  // - Check users authenticated, if session expired return 401
  if (new Date(sessionRow.expires) < new Date()) return new Response('Unauthorized', { status: 401, statusText: ERROR_CODE.SESSION_EXPIRED })

  // - Config valid subscription for return
  const sessionData = formatSessionData(sessionRow)

  // return succesful response wiht session data
  return new Response(JSON.stringify({ sessionData }), {
    status: 200,
    statusText: 'OK',
  })
}
