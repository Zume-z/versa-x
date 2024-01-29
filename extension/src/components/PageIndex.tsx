import { Command } from 'cmdk'
import ItemPrompt from './ItemPrompt'
import ButtonSubmit from './ButtonSubmit'
import { PaperPlaneIcon } from '@radix-ui/react-icons'
import { PROMPT_DB } from '../utils/constants/promptDb'
import { SESSION } from '../utils/constants/authInterfaces'
import { genPrompts } from '../utils/requests/genPromptsRequest'
import { cdmk_group_header, transition_200 } from '../assets/styles/global'
import { Dispatch, FormEvent, MouseEvent, SetStateAction, useEffect, useState } from 'react'

interface IndexProps {
  input: string
  setInput: Dispatch<SetStateAction<string>>
  inputSubmit: (input: { message?: string; ctxPrompt?: string; event?: FormEvent<HTMLFormElement> | MouseEvent<HTMLDivElement> }) => Promise<void>
  refInput: React.RefObject<HTMLInputElement>
  setResponseGPT: Dispatch<SetStateAction<string>>
  setLoadingGpt: Dispatch<SetStateAction<boolean>>
  currentTab: chrome.tabs.Tab | null
  session: SESSION | null
}

export default function PageIndex({ input, setInput, inputSubmit, refInput, session }: IndexProps) {
  const [prompts, setPrompts] = useState<{ label: string; ctxPrompt: string }[] | undefined[]>([])
  const [genPromptRes, setGenPromptRes] = useState('')
  const [loadingPrompts, setLoadingPrompts] = useState(false)
  const [generatedPrompts, setGeneratedPrompts] = useState<string[]>([])

  useEffect(() => {
    const promptsArray = Object.keys(PROMPT_DB).map((key) => {
      const randomIndex = Math.floor(Math.random() * PROMPT_DB[key as keyof typeof PROMPT_DB].length)
      return PROMPT_DB[key as keyof typeof PROMPT_DB][randomIndex]
    })
    setPrompts(promptsArray as { label: string; ctxPrompt: string }[])
    if (session?.genPrompts) {
      genPrompts(setGenPromptRes, setLoadingPrompts, setGeneratedPrompts)
    }
  }, [])

  return (
    <>
      <Command shouldFilter={false} loop={true} onMouseEnter={() => refInput.current?.focus()}>
        <Command.List className="w-full pb-14 ">
          {/* Input Wrapper*/}
          <Command.Item onSelect={() => inputSubmit({ message: input })} className={`group-aria-selected group absolute bottom-0 z-[9999] w-full  rounded-b-lg border-t border-gray-500  py-4 text-lg text-transparent aria-selected:z-[9997] ${input ? 'bg-dark-void/40' : ''}    `}>
            <div>Input</div>
            <div className={`${transition_200} absolute right-0 top-0  m-4 rounded border  border-gray-500 bg-dark-void p-1 text-gray-500 `}>
              <PaperPlaneIcon className=" h-5 w-5" />
            </div>
          </Command.Item>

          {/* Suggestions */}
          <div className={cdmk_group_header}>{'Things to ask'}</div>
          {prompts.map((value, index) => (
            <ItemPrompt key={index} inputSubmit={inputSubmit} label={value?.label} ctxPrompt={value?.ctxPrompt} />
          ))}

          {/* Generated Prompts */}
          {generatedPrompts.map((prompt, index) => (
            <ItemPrompt key={index} inputSubmit={inputSubmit} label={prompt} />
          ))}
          {/* Loading Prompt */}
          {loadingPrompts && <ItemPrompt inputSubmit={inputSubmit} label={genPromptRes} loadingPrompt={true} />}
        </Command.List>

        {/* Input */}
        <div className="absolute bottom-0 z-[9998] w-full rounded-b-lg bg-dark-void p-4">
          <Command.Input ref={refInput} value={input} onValueChange={setInput} className=" w-full bg-dark-void text-lg text-white focus:outline-none" placeholder="Ask about this page..." />
          <ButtonSubmit input={input} inputSubmit={inputSubmit} />
        </div>
      </Command>
    </>
  )
}
