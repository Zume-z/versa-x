import { FormEvent, MouseEvent } from 'react'
import { PaperPlaneIcon } from '@radix-ui/react-icons'
import { icon_blue, transition_200 } from '../assets/styles/global'

interface ButtonSubmitProps {
  inputSubmit: (input: { message?: string; ctxPrompt?: string; event?: FormEvent<HTMLFormElement> | MouseEvent<HTMLDivElement> }) => Promise<void>
  input?: string
}

export default function ButtonSubmit({ inputSubmit, input }: ButtonSubmitProps) {
  return (
    <div onClick={(e) => inputSubmit({ message: input, event: e })} className={`${transition_200} absolute right-0 top-0 m-4 rounded border p-1 ${input ? `${icon_blue} border-dark-void text-white` : 'border-gray-500 text-gray-500'}`}>
      <PaperPlaneIcon className=" h-5 w-5  " />
    </div>
  )
}
