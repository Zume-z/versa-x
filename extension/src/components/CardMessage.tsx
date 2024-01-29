import IconGpt from './icons/IconGpt'
import { SESSION } from '../utils/constants/authInterfaces'
import { GPT_MESSAGE } from '../utils/constants/gptInterfaces'
import { icon_blue } from '../assets/styles/global'

interface CardMessageProps {
  message: GPT_MESSAGE
  loadingResponse?: boolean
  session?: SESSION | null
}

export default function CardMessage({ message, loadingResponse, session }: CardMessageProps) {
  const isAssistant = message.role === 'assistant'

  return (
    <div className={`py-6 text-white ${isAssistant && 'bg-gray-700/50'}`}>
      <div className="mx-auto max-w-2xl items-center ">
        <div className="flex items-start space-x-5">
          <div className="-mt-1">
            {isAssistant && <IconGpt className={` -ml-8 h-8 w-8 min-w-[32px]  rounded-sm p-1 text-white ${icon_blue}`} />}
            {!isAssistant && !session?.image && <div className="-ml-8 h-8 w-8 min-w-[32px] rounded-sm bg-gradient-to-br from-yellow-500  to-pink-500 p-1 " />}
            {!isAssistant && session?.image && <img src={session?.image} className="-ml-8 h-8 w-8 min-w-[32px] rounded-sm" />}
          </div>
          <div className="flex">
            <div className="whitespace-pre-line text-base ">
              {message.content}
              {loadingResponse && <span className="box-border inline-block h-3 w-2 animate-cursor bg-white will-change-transform" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
