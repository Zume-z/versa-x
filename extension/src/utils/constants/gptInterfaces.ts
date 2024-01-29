import { FormEvent, MouseEvent } from 'react'

export type GPT_AGENT = 'user' | 'system' | 'assistant'

export interface GPT_MESSAGE {
  role: GPT_AGENT
  content: string
}

export interface inputSubmitProps {
  message?: string
  event?: FormEvent<HTMLFormElement> | MouseEvent<HTMLDivElement>
  ctxPrompt?: string
}
