import Login from './components/Login'
import Layout from './components/Layout'
import PageIndex from './components/PageIndex'
import PageError from './components/PageError'
import { DIR } from './utils/constants/directory'
import { useEffect, useRef, useState } from 'react'
import PageResponse from './components/PageResponse'
import ButtonSetting from './components/ButtonSetting'
import { gptRequest } from './utils/requests/gptRequest'
import { autoScroll } from './utils/functions/autoScroll'
import { authCheck } from './utils/requests/chromeRequest'
import { CHROME_ACTION } from './utils/constants/chromeInterfaces'
import { ERROR_CODE, SESSION } from './utils/constants/authInterfaces'
import { GPT_MESSAGE, inputSubmitProps } from './utils/constants/gptInterfaces'

export default function App() {
  const [input, setInput] = useState('')
  const [page, setPage] = useState<DIR>(DIR.INDEX)
  const [modal, setModal] = useState<boolean>(false)
  const [responseGpt, setResponseGpt] = useState('')
  const [loadingGpt, setLoadingGpt] = useState(false)
  const [messages, setMessages] = useState<GPT_MESSAGE[]>([])
  const [dbMessages, setDbMessages] = useState<GPT_MESSAGE[]>([])
  const [session, setSession] = useState<SESSION | null>(null)
  const [pageErrType, setPageErrType] = useState<ERROR_CODE | null>(null)
  const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab | null>(null)

  const refInput = useRef<HTMLInputElement>(null)
  const refResInput = useRef<HTMLInputElement>(null)
  const refContainer = useRef<HTMLDivElement>(null)

  // Listen to background
  chrome.runtime.onMessage.addListener(function (request) {
    if (request.action == CHROME_ACTION.TOGGLE_MODAL) {
      handleModal()
    }
  })

  // Check Auth
  useEffect(() => {
    authCheck(setSession, setPage)
  }, [page, modal])

  // Auto Scroll on messages change
  useEffect(() => {
    modal && autoScroll(refContainer)
  }, [messages])

  // Handle Session Error
  useEffect(() => {
    if (session?.error) {
      setPage(DIR.ERROR)
      switch (session.error) {
        case ERROR_CODE.TOKEN_LIMIT_EXCEEDED:
          setPageErrType(ERROR_CODE.TOKEN_LIMIT_EXCEEDED)
          break
        case ERROR_CODE.SUBSCRIPTION_NOT_FOUND:
          setPageErrType(ERROR_CODE.SUBSCRIPTION_NOT_FOUND)
          break
        case ERROR_CODE.PAYMENT_PAST_DUE:
          setPageErrType(ERROR_CODE.PAYMENT_PAST_DUE)
          break
      }
    }
  }, [session])

  // Handle Modal
  const handleModal = async () => {
    setModal(!modal)
    setInput('')
    setMessages([])
    session && setPage(DIR.INDEX)

    // get current tab
    chrome.runtime.sendMessage({ action: CHROME_ACTION.GET_CURRENT_TAB }, (res) => {
      setCurrentTab(res)
    })

    await new Promise((resolve) => setTimeout(resolve, 100)).then(() => {
      refInput?.current?.focus()
    })
  }

  // Handle Input Submit
  const inputSubmit = async (input: inputSubmitProps) => {
    if (!input.message) return
    input.event && input.event.preventDefault()
    DIR.INDEX && setPage(DIR.RESPONSE)

    // Reset Input
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: input.message! }])
    setTimeout(() => {
      refResInput.current?.focus()
    }, 100)
    await gptRequest(input.ctxPrompt ? input.ctxPrompt : input.message, setResponseGpt, setLoadingGpt, setMessages, messages, dbMessages, setDbMessages)
  }

  return (
    <>
      {modal && (
        <>
          <Layout handleModal={handleModal}>
            {page !== DIR.LOGIN && (
              <div className="relative h-full w-full">
                <ButtonSetting setModal={setModal} />
                <div ref={refContainer} className="h-full w-full overflow-y-auto">
                  {page === DIR.INDEX && <PageIndex input={input} inputSubmit={inputSubmit} refInput={refInput} setInput={setInput} setResponseGPT={setResponseGpt} setLoadingGpt={setLoadingGpt} currentTab={currentTab} session={session} />}
                  {page === DIR.RESPONSE && <PageResponse input={input} setInput={setInput} inputSubmit={inputSubmit} loadingResponse={loadingGpt} messages={messages} refResInput={refResInput} response={responseGpt} session={session} />}
                  {page === DIR.ERROR && <PageError setPage={setPage} pageErrType={pageErrType} session={session} />}
                </div>
              </div>
            )}
            {page === DIR.LOGIN && <Login modal={modal} setModal={setModal} />}
          </Layout>
        </>
      )}
    </>
  )
}
