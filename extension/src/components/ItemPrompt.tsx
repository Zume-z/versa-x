import { Command } from 'cmdk'
import { FormEvent, MouseEvent } from 'react'
import { ChevronRightIcon } from '@radix-ui/react-icons'
import { cdmk_item, cdmk_label } from '../assets/styles/global'

interface ItemPromptProps {
  label?: string
  ctxPrompt?: string
  loadingPrompt?: boolean
  inputSubmit: (input: { message?: string; ctxPrompt?: string; event?: FormEvent<HTMLFormElement> | MouseEvent<HTMLDivElement> }) => Promise<void>
}

export default function ItemPrompt({ label, ctxPrompt, inputSubmit, loadingPrompt }: ItemPromptProps) {
  return (
    <Command.Item onSelect={() => inputSubmit({ message: label, ctxPrompt: ctxPrompt })} value={label} className={cdmk_item}>
      <div className="flex-1">
        <div className="flex items-center">
          <div className={cdmk_label}>
            <div className="whitespace-pre-line text-base">
              {label}
              {loadingPrompt && <span className="box-border inline-block h-3 w-2 animate-cursor bg-white  will-change-transform" />}
            </div>
          </div>
        </div>
      </div>
      <ChevronRightIcon className=" ml-2 flex h-5 w-5 text-gray-500 group-aria-selected:text-[#2f6eeb]" />
    </Command.Item>
  )
}
