import { TRPCError } from '@trpc/server'
import { ChatGPTMessage } from './openAIStream'
import { Connection } from '@planetscale/database'
import { Tiktoken } from '@dqbd/tiktoken/lite/init'
import gptModel from '@dqbd/tiktoken/encoders/cl100k_base.json'

interface UpdateTokenProps {
  connection: Connection
  messages: ChatGPTMessage[]
  gptResponse: string
  userId: string
}

export async function UpdateTokenCount(data: UpdateTokenProps) {
  // - Init Tiktoken
  const encoding = new Tiktoken(gptModel.bpe_ranks, gptModel.special_tokens, gptModel.pat_str)

  // - Deconstruct Messages
  const messageContent = data.messages.map((message) => message.content).join(' ')

  // - Count tokens
  const tokens = encoding.encode(messageContent + data.gptResponse)
  const tokenCount = tokens.length

  // - If no tokens, throw error
  if (!tokenCount) throw new TRPCError({ code: 'BAD_REQUEST', message: 'No tokens in the response' })

  // - Update token Count
  const updateUser = await data.connection.execute(`UPDATE User SET tokenCount = tokenCount + ${tokenCount} WHERE id = ?`, [data.userId])

  // - If token count update fails, throw error
  if (!updateUser.rowsAffected) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Token count update failed' })

  // - Get last Message from user
  const userMessage = data.messages.filter((message) => message.role === 'user').pop()
  if (userMessage?.content.includes('this is the website I am curerently on')) {
    const userMessageContent = userMessage?.content.split(', this is the website I am curerently on,')[0]
    const userMessageURL = userMessage?.content.split('URL:')[1]

    // - Push User Message to DB
    const insertUserMessage = await data.connection.execute(`INSERT INTO UserMessage (url, text) VALUES (?, ?)`, [userMessageURL, userMessageContent])
    if (!insertUserMessage.rowsAffected) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'User message insert failed' })
  }
}
