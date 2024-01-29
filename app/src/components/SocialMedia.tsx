import { CONTACT_HREF } from '@/utils/constants/directory'
import { EnvelopeClosedIcon, TwitterLogoIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/router'

export default function SocialMedia() {
  const { push } = useRouter()
  return (
    <div className="grid  grid-cols-1 gap-5 text-white  sm:mb-20 md:grid-cols-2 lg:gap-10">
      <div onClick={() => push(CONTACT_HREF.TWITTER)} className="transition-200 mt-4 h-full w-full cursor-pointer  space-y-3 rounded-md  border border-gray-800  bg-gradient-to-br from-cyan-500 to-pink-500/80 p-8 hover:opacity-90">
        <TwitterLogoIcon className="h-10 w-10 rounded-md border  p-1 text-white" />
        <div className="text-xl">Stay up to date.</div>
        <div>Stay connected with all future updates and find out whats coming next.</div>
      </div>
      <div onClick={() => push(CONTACT_HREF.CONTACT)} className="transition-200 mt-4 h-full w-full cursor-pointer space-y-3 rounded-md border-gray-800  bg-gradient-to-br from-yellow-500 to-pink-500/80 p-8 hover:opacity-80">
        <EnvelopeClosedIcon className="h-10 w-10 rounded-md border  p-1 text-white" />
        <div className="text-xl">Get in touch.</div>
        <div> Want a new feature? Have an issue? Get in touch directly and we'll get back to you as soon as possible. </div>
      </div>
    </div>
  )
}
