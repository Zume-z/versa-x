import { scrapePage } from './scrapeRequest'
import { Dispatch, SetStateAction } from 'react'
import { CHROME_PORT, GPT_PORT_REQUEST, GPT_PORT_RESPONSE } from '../constants/chromeInterfaces'

export const genPrompts = async (setGenPromptRes: Dispatch<SetStateAction<string>>, setLoadingPrompts: Dispatch<SetStateAction<boolean>>, setGeneratedPrompts: Dispatch<SetStateAction<string[]>>) => {
  // Set Loading
  setGenPromptRes('')
  setGeneratedPrompts([])
  setLoadingPrompts(true)
  let fullResponse = ''
  let reponseSection = ''
  let chunkCounter = 0

  // Connect to port
  const port = chrome.runtime.connect({ name: CHROME_PORT.GPT_REQUEST })

  // Scrape website
  const pageData = scrapePage()

  // Make Gpt Request
  const gptPortReq: GPT_PORT_REQUEST = {
    port: CHROME_PORT.GPT_REQUEST,
    messages: [
      { role: 'system', content: 'You are a helpful helpful assistant running in a browser, you are being prompted with a user message followed by a text-content from a website or app they are currently on. If it is a messaging website or app help me reply to messages. Reponse with page text-content as context to help the user.' },
      { role: 'user', content: `Give the user 5 questions to ask you about following website, do not provide answers. Keep each questions to 5 words and make website specific. Return in this format: 1. Example question \n 2.Example question \n 3.Example question. The current website is Title:${pageData.title} URL:${pageData.url} Body:${pageData.body}` },
    ],
  }
  port.postMessage(gptPortReq)

  // Listen for response
  port.onMessage.addListener(function (response) {
    // Gpt Response
    if (response.port == CHROME_PORT.GPT_REQUEST) {
      const res = response as GPT_PORT_RESPONSE

      // Update response
      if (chunkCounter > 2) {
        setGenPromptRes((prev) => prev + res.value)
      }

      // Update
      fullResponse += res.value
      reponseSection += res.value
      chunkCounter++

      if (res.value.includes('\n')) {
        setGenPromptRes('')
        const chnk = formatGenPrompts(reponseSection)
        setGeneratedPrompts((prev) => [...prev, chnk])
        reponseSection = ''
        chunkCounter = 0
      }

      if (res.done == true) {
        setGenPromptRes('')
        reponseSection = ''

        setGeneratedPrompts(formatAllGenPrompts(fullResponse))
        setLoadingPrompts(false)
      }
    }

    // Error response
    if (response.port === CHROME_PORT.ERROR) {
      setLoadingPrompts(false)
    }
  })

  const formatGenPrompts = (prompt: string) => {
    // Remove quotation marks
    prompt = prompt.replace(/['"]+/g, '')
    // Remove new lines
    prompt = prompt.replace(/\n/g, ' ')
    // if promtp string starts with number, remove number and period
    prompt = prompt.trim()
    if (/^\d/.test(prompt)) prompt = prompt.slice(3)
    // Clean text
    prompt = prompt.trim()
    return prompt
  }

  const formatAllGenPrompts = (prompts: string) => {
    // Split prompts into array
    const promptArr = prompts.split('\n')
    // Remove quotation marks
    promptArr.forEach((prompt, i) => {
      prompt = prompt.replace(/['"]+/g, '')
      // Remove new lines
      prompt = prompt.replace(/\n/g, ' ')
      // if promtp string starts with number, remove number and period
      prompt = prompt.trim()
      if (/^\d/.test(prompt)) prompt = prompt.slice(3)
      // Clean text
      prompt = prompt.trim()
      promptArr[i] = prompt
    })
    return promptArr
  }
}
