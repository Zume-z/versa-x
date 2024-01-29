import Image from 'next/image'
import options from '../assets/featureOptions.png'
import featureBg from '../assets/featureBackDrop.png'
import { ChatBubbleIcon, CubeIcon, EyeOpenIcon, GlobeIcon, LightningBoltIcon, QuestionMarkIcon } from '@radix-ui/react-icons'

export default function Features() {
  return (
    <div id={'features'} className="flex flex-col pt-24 text-white">
      <div className="relative mb-4 flex h-[475px] w-full justify-center overflow-clip  rounded-md border  border-gray-500 bg-gray-800/20  p-8  lg:justify-end">
        <div className="z-10  ">
          <div className="max-w-lg">
            <CubeIcon className="-800 h-14 w-14 flex-shrink-0 rounded-md border-[0.5px] border-white bg-gradient-to-br from-slate-700 to-transparent p-2" />
            <div className="mt-4 text-2xl">What does Versa X do?</div>
            <div className="mt-4 whitespace-pre-line text-gray-400 ">
              <span>Versa X is a contextually aware AI assistant seamlessly integrated into your web browser. By leveraging a deep understanding of the website you're visiting, Versa X delivers relevant and accurate answers through a convenient conversation window right in your browser.</span>
              <span className="mt-1 hidden sm:block"> Whether you're conducting in-depth research, crafting engaging content, or seeking valuable insights, Versa X is purpose-built to assist you along the way. With this ability streamlining tedious and time-consuming tasks you're free to focus on what to do what you do best.</span>
            </div>
          </div>
        </div>

        <div className="absolute left-8 top-80 h-[500px] w-[700px] md:top-64 lg:top-8     ">
          <div className="absolute h-[400px] w-[800px] rounded-lg bg-gradient-to-r from-transparent from-20% to-[#07080b] to-50% sm:from-20% sm:to-80% "> </div>
          <Image className="absolute -z-10   h-[400px] w-[800px] rounded-lg border border-gray-500  object-cover  opacity-30 backdrop-blur-sm lg:opacity-100" alt="" src={options} />
        </div>
      </div>

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="relative  w-full rounded-md border border-gray-500 bg-gray-800/20 ">
          <Image className="absolute h-full w-full object-cover pt-0 opacity-50 sm:pt-8 md:opacity-90" alt="" src={featureBg} />

          <div className="p-8">
            <GlobeIcon className="h-14 w-14 rounded-md border-[0.5px] border-white bg-gradient-to-br from-slate-700  to-transparent p-2" />
            <div className="mt-4 text-2xl">AI wherever you go.</div>
            <div className="mt-4 text-gray-400">Designed for seamless integration with your browser our extension gives you the ability to leverage website-specific insights no matter where you are, enhancing your productivity and decision-making on the go.</div>
          </div>
        </div>

        <div className="flex w-full flex-col space-y-4 rounded-md  ">
          <div className="flex h-full items-center rounded-md border border-gray-500 bg-gray-800/20 px-4 py-2  ">
            <LightningBoltIcon className="h-10 w-10 flex-shrink-0 rounded-md border border-red-800 bg-gradient-to-br from-red-500 to-orange-600 p-2 text-white/80" />
            <div className="ml-4">
              <div>Prompt</div>
              <div className="text-sm text-gray-400">Website specific generated prompts, so you know what to ask.</div>
            </div>
          </div>
          <div className="flex h-full items-center rounded-md border border-gray-500 bg-gray-800/20 px-4 py-2 ">
            <EyeOpenIcon className=" h-10 w-10 flex-shrink-0 rounded-md border border-cyan-800 bg-gradient-to-br from-blue-500 to-cyan-600 p-2 text-white/80" />
            <div className="ml-4">
              <div>Summarise</div>
              <div className="text-sm text-gray-400">Save time with fast, concise summaries of any website.</div>
            </div>
          </div>
          <div className="flex h-full items-center rounded-md border border-gray-500 bg-gray-800/20  px-4 py-2 ">
            <QuestionMarkIcon className="h-10 w-10 flex-shrink-0 rounded-md border border-emerald-800 bg-gradient-to-br from-emerald-500 to-cyan-600 p-2 text-white/80" />
            <div className="ml-4">
              <div>Explain</div>
              <div className="text-sm text-gray-400">Confusing website? Have it explained any way you like.</div>
            </div>
          </div>
          <div className="flex h-full items-center rounded-md border border-gray-500 bg-gray-800/20  px-4 py-2 ">
            <ChatBubbleIcon className="h-10 w-10  flex-shrink-0 rounded-md border border-pink-800 bg-gradient-to-br from-pink-500 to-fuchsia-600 p-2 text-white/80" />
            <div className="ml-4">
              <div className="">Message</div>
              <div className="text-sm text-gray-400">Save time with contextually generated responses.</div>
            </div>
          </div>
          <div className="flex h-full items-center rounded-md border border-gray-500 bg-gray-800/20  px-4 py-2">
            <GlobeIcon className="h-10 w-10 flex-shrink-0  rounded-md border border-gray-700 bg-gradient-to-br from-gray-400 to-slate-600  p-2 text-white/80" />
            <div className="ml-4">
              <div>Extract</div>
              <div className="text-sm text-gray-400">Generate tailored unique insights from any site.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// VersaX is a contextually aware AI assistant seamlessly integrated into your web browser. By leveraging a deep understanding of the website you're visiting, VersaX delivers relevant and accurate answers through a convenient conversation window right in your browser.
//               Whether you're conducting in-depth research, crafting engaging content, or seeking valuable insights, VersaX is purpose-built to assist you along the way. With this ability streamlining tedious and time-consuming tasks you're free to focus on what to do what you do best.
