import { scrapePage } from './scrapeRequest'
import { Dispatch, SetStateAction } from 'react'
import { GPT_MESSAGE } from '../constants/gptInterfaces'
import { CHROME_PORT, GPT_PORT_REQUEST, GPT_PORT_RESPONSE } from '../constants/chromeInterfaces'

export const gptRequest = async (input: string, setResponseGPT: Dispatch<SetStateAction<string>>, setLoadingGpt: Dispatch<SetStateAction<boolean>>, setMessages: Dispatch<SetStateAction<GPT_MESSAGE[]>>, messages: GPT_MESSAGE[], dbMessages: GPT_MESSAGE[], setDbMessages: Dispatch<React.SetStateAction<GPT_MESSAGE[]>>) => {
  setResponseGPT('')
  setLoadingGpt(true)

  // Connect to port
  const port = chrome.runtime.connect({ name: CHROME_PORT.GPT_REQUEST })
  let fullResponse = ''

  // Scrape Page
  const pageData = scrapePage()
  const currentDate = new Date().toLocaleDateString()

  // Gpt Request
  const gptPortReq: GPT_PORT_REQUEST = {
    port: CHROME_PORT.GPT_REQUEST,
    messages: [
      { role: 'system', content: `You are a helpful helpful assistant running in a browser. You are being prompted with a user message followed by a text-content from a website or app they are currently on. If it is a messaging website or app help me reply to messages. Respond with page data as context to help the user with their questions or responding to messages in the text content. You also have the current date.` },
     ...messages, 
     { role: 'user', content: `${input}. This is the page I am currently on, Title: ${pageData.title} Body: ${pageData.body} URL: ${pageData.url}, CurrentDate: ${currentDate}` }], 
  } //prettier-ignore
  port.postMessage(gptPortReq)

  // Listen for response
  port.onMessage.addListener(function (response) {
    // Gpt Response
    if (response.port == CHROME_PORT.GPT_REQUEST) {
      const res = response as GPT_PORT_RESPONSE
      fullResponse += res.value

      // Update response
      setResponseGPT((prev) => prev + res.value)

      if (res.done == true) {
        setMessages((prev) => [...prev, { role: 'assistant', content: fullResponse }])
        setLoadingGpt(false)
      }
    }

    // Error response
    if (response.port === CHROME_PORT.ERROR) {
      setLoadingGpt(false)
    }
  })
}
