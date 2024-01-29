import { env } from '@/env/env.mjs'
import { Connection } from '@planetscale/database'
import { UpdateTokenCount } from './updateTokenCount'
import { createParser, ParsedEvent, ReconnectInterval } from 'eventsource-parser'

export type ChatGPTAgent = 'user' | 'system' | 'assistant'

export interface ChatGPTMessage {
  role: ChatGPTAgent
  content: string
}

export interface OpenAIStreamPayload {
  model: string
  messages: ChatGPTMessage[]
  functions?: { name: string; description: string; parameters?: string }[]
  function_call?: string
  temperature?: number
  top_p?: number
  frequency_penalty?: number
  presence_penalty?: number
  max_tokens?: number
  stream?: boolean
  n?: number
}

export async function OpenAIStream(payload: OpenAIStreamPayload, userId: string, connection: Connection) {
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()
  let counter = 0
  let fullResponse = ''

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.GPTAPI_KEY}`,
    },
    method: 'POST',
    body: JSON.stringify(payload),
  })

  const stream = new ReadableStream({
    async start(controller) {
      function onParse(event: ParsedEvent | ReconnectInterval) {
        if (event.type === 'event') {
          const data = event.data
          if (data === '[DONE]') {
            controller.close()
            return
          }
          try {
            const json = JSON.parse(data)
            const text = json.choices[0].delta?.content || ''
            if (counter < 2 && (text.match(/\n/) || []).length) {
              return
            }
            fullResponse += text
            const queue = encoder.encode(text)
            controller.enqueue(queue)
            counter++
          } catch (e) {
            controller.error(e)
          }
        }
      }

      const parser = createParser(onParse)

      for await (const chunk of res.body as unknown as AsyncIterable<Uint8Array>) {
        parser.feed(decoder.decode(chunk))
      }

      // - Update Token Count
      await UpdateTokenCount({ connection: connection, gptResponse: fullResponse, messages: payload.messages, userId: userId })
    },
  })

  return stream
}
