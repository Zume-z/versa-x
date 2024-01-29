import Link from 'next/link'
import Image from 'next/image'
import optionsMain from '../assets/optionsMain.png'
import { VERSA_HREF } from '@/utils/constants/directory'

export default function Landing() {
  return (
    <div className="flex h-screen flex-col items-center justify-center   text-white ">
      <Image className=" absolute left-0 right-0 -z-20 m-auto  -mt-40 max-h-[575px]  border-gray-500  object-contain   p-4 backdrop-blur-sm" alt="" src={optionsMain} />
      <div className="absolute left-0 right-0 -z-10 m-auto -mt-40  h-full w-full rounded bg-gradient-to-b from-transparent from-35% to-black to-60% sm:to-65%" />
      <div className="mt-32 p-2  pt-28 text-center text-4xl sm:mt-56">AI wherever you go.</div>
      <div className="p-2 text-center text-2xl">Upgrade your browser with the contextually aware assistant, Versa X</div>
      <div className="transition-200 relative mt-6 flex overflow-clip rounded p-[1px] hover:bg-blue-700">
        <Link href={VERSA_HREF.DOWNLOAD} className="transition-200  h-full w-full rounded  border-gray-500 bg-black px-8 py-1 text-lg  text-gray-300  hover:text-white">
          Download
        </Link>
        <div className="absolute -left-4 -top-16 -z-10 h-44 w-44 flex-shrink-0 animate-spin-slow  rounded-full  bg-gradient-to-br  from-blue-500 from-20% to-blue-900/50  to-80% " />
      </div>
    </div>
  )
}
