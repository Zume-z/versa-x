import CardMessage from './CardMessage'
import ButtonSubmit from './ButtonSubmit'
import { SESSION } from '../utils/constants/authInterfaces'
import { ChangeEvent, Dispatch, FormEvent, MouseEvent, RefObject, SetStateAction } from 'react'

interface PageResponseProps {
  input: string
  messages: any[]
  setInput: Dispatch<SetStateAction<string>>
  inputSubmit: (input: { message?: string; ctxPrompt?: string; event?: FormEvent<HTMLFormElement> | MouseEvent<HTMLDivElement> }) => Promise<void>
  response: string
  loadingResponse: boolean
  refResInput: RefObject<HTMLInputElement>
  session: SESSION | null
}

export default function PageResponse({ input, messages, setInput, inputSubmit, response, loadingResponse, refResInput, session }: PageResponseProps) {
  const inputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value)
  }

  return (
    <>
      <div className="h-full">
        <div className="pb-14">
          {messages.map((message, index) => (
            <CardMessage message={message} key={index} session={session} />
          ))}
          {loadingResponse && <CardMessage message={{ role: 'assistant', content: response as string }} loadingResponse={true} />}
        </div>

        <div className="bg absolute bottom-0 z-[9998] w-full border-t border-gray-500 bg-dark-void p-4 ">
          <form onSubmit={(e) => inputSubmit({ message: input, event: e })}>
            <input ref={refResInput} onChange={inputChange} value={input} className="w-full bg-dark-void text-xl  focus:outline-none" placeholder="Send a message" />
            <ButtonSubmit input={input} inputSubmit={inputSubmit} />
          </form>
        </div>
      </div>
    </>
  )
}
