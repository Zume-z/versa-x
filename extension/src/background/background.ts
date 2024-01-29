import { getCurrentTab } from '../utils/background/functions'
import { CHROME_ACTION, CHROME_PORT, GPT_PORT_REQUEST, PORT_ERROR } from '../utils/constants/chromeInterfaces'
import { VERSA_API } from '../utils/constants/directory'

// Listen for click
chrome.action.onClicked.addListener(async (tab: chrome.tabs.Tab) => {
  if (!tab.id) return
  chrome.tabs.sendMessage(tab.id, { action: CHROME_ACTION.TOGGLE_MODAL })
})

// Listen for messages
chrome.runtime.onMessage.addListener(function (request, sender, onSuccess) {
  // Create new tab
  if (request.action === CHROME_ACTION.CREATE_TAB) {
    chrome.tabs.create({ url: request.url, active: true })
  }

  // Get current tab
  if (request.action === CHROME_ACTION.GET_CURRENT_TAB) {
    getCurrentTab().then((tab) => {
      onSuccess(tab)
    })
  }

  // Get favicon
  if (request.action === CHROME_ACTION.GET_FAVICON) {
    const favUrl = new URL(chrome.runtime.getURL('/_favicon/'))
    favUrl.searchParams.set('pageUrl', request.url)
    favUrl.searchParams.set('size', '32')
    onSuccess(favUrl.toString())
  }

  // Req session
  if (request.action === CHROME_ACTION.REQ_SESSION) {
    fetch(VERSA_API.AUTH_SESSION, {
      mode: 'cors',
    })
      .then(async (res) => {
        if (!res.ok) return onSuccess(null)
        const data = await res.json()
        if (!data) return onSuccess(null)
        onSuccess(data)
      })
      .catch((err) => {
        onSuccess(null)
      })
  }

  return true
})

// Gpt Stream
chrome.runtime.onConnect.addListener(async function (port) {
  console.assert(port.name === CHROME_PORT.GPT_REQUEST)
  port.onMessage.addListener(function (input) {
    if (input.port === CHROME_PORT.GPT_REQUEST) {
      const req: GPT_PORT_REQUEST = input

      // GPT FETCH RESPONSE
      fetch(VERSA_API.GENERATE_GPT_STREAM, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: req.messages,
          max_tokens: req.max_tokens ? req.max_tokens : Infinity,
        }),
        mode: 'cors',
      }).then(async (res) => {
        if (!res.ok) return port.postMessage({ port: CHROME_PORT.ERROR, error: PORT_ERROR.GPT_FAIL, message: await res.text(), statusText: res.statusText })
        const data = res.body
        if (!data) return port.postMessage({ port: CHROME_PORT.ERROR, error: PORT_ERROR.GPT_FAIL, message: 'No data' })
        const reader = data.getReader()
        const decoder = new TextDecoder()
        let done = false
        let fullResponse = ''
        while (!done) {
          const { value, done: doneReading } = await reader.read()
          done = doneReading
          const chunkValue = decoder.decode(value)
          fullResponse += chunkValue
          port.postMessage({ port: CHROME_PORT.GPT_REQUEST, value: chunkValue, done: doneReading })
        }
      })
    }
  })

  return true
})

export {}
