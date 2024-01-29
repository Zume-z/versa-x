import Link from 'next/link'
import { VERSA_HREF } from '@/utils/constants/directory'

export default function CallToAction() {
  return (
    <div className="flex h-80 flex-col items-center justify-center text-white">
      <div className="text-2xl">Start your free trial today.</div>
      <Link href={VERSA_HREF.DOWNLOAD} className=" transition-200 mb-1 mt-4 rounded border border-gray-700 px-8 py-1 text-lg hover:border-blue-700">
        Download
      </Link>
    </div>
  )
}
