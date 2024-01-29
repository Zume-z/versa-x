import { env } from '@/env/env.mjs'
import { Client } from '@planetscale/database'
import { init } from '@dqbd/tiktoken/lite/init'
import { RequestCookies } from '@edge-runtime/cookies'
import { ChatGPTMessage, OpenAIStream, OpenAIStreamPayload } from '@/utils/requests/openAIStream'
import { Tiktoken } from '@dqbd/tiktoken/lite/init'
import gptModel from '@dqbd/tiktoken/encoders/cl100k_base.json'
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
  const sessionToken = cookies.get('__Secure-next-auth.session-token')?.value

  // - If session doesn’t exist return 401
  if (!sessionToken) return new Response(ERROR_CODE.SESSION_TOKEN_NOT_FOUND, { status: 401, statusText: ERROR_CODE.SESSION_NOT_FOUND })

  // - Query database for that session and attach user: Using DB planetscale
  const conn = db.connection()
  const [session] = await Promise.all([conn.execute('SELECT Session.id, Session.userId, Session.expires, User.tokenCount, User.subscriptionStatus, User.productId, User.trialStartedAt, User.image, User.admin FROM Session INNER JOIN User ON Session.userId=User.id WHERE Session.sessionToken = ? ', [sessionToken])])

  // - If session doesn’t exist return 401
  if (!session.rows.length) return new Response('Unauthorized', { status: 401, statusText: ERROR_CODE.SESSION_NOT_FOUND })

  // - Get session data
  const sessionData = session.rows[0] as SessionData

  // - Check users authenticated, if session expired return 401
  if (new Date(sessionData.expires) < new Date()) return new Response('Unauthorized', { status: 401, statusText: ERROR_CODE.SESSION_EXPIRED })

  // - Check Valid Subscription and token limit
  const subscriptionStatus = formatSessionData(sessionData)

  // - If subscription is invalid, return 402
  if (subscriptionStatus.validSession == false) return new Response('Unauthorized', { status: 401, statusText: subscriptionStatus.error })

  // - Stream GPT response
  const { messages, model, max_tokens, temperature } = (await req.json()) as {
    messages: ChatGPTMessage[]
    model?: string
    max_tokens?: number
    temperature?: number
  }

  if (!messages) return new Response('Bad Request', { status: 400, statusText: ERROR_CODE.NO_PROMPT_IN_REQUEST })

  // - Check token length of messages content
  const encoding = new Tiktoken(gptModel.bpe_ranks, gptModel.special_tokens, gptModel.pat_str)

  // - Deconstruct Messages
  const messageContent = messages.map((message) => message.content).join(' ')

  // - Count tokens
  const tokens = encoding.encode(messageContent)
  const tokenCount = tokens.length

  // - If no tokens, throw error
  if (!tokenCount) return new Response('Bad Request', { status: 400, statusText: ERROR_CODE.NO_TOKENS_IN_PROMPT })

  // - If no model, use gpt-3.5-turbo
  let selectedModel = model

  // - Update model depending on token count
  if (tokenCount < 4000) {
    selectedModel = 'gpt-3.5-turbo'
  }

  // - If token length is greater than 3900 use gpt-3.5-turbo-16k
  if (tokenCount > 4000) {
    selectedModel = 'gpt-3.5-turbo-16k'
  }

  const payload: OpenAIStreamPayload = {
    model: selectedModel || 'gpt-3.5-turbo',
    messages: messages,
    temperature: temperature || 1,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: max_tokens || Infinity,
    stream: true,
    n: 1,
  }

  const stream = await OpenAIStream(payload, sessionData.userId, conn)

  return new Response(stream)
}
