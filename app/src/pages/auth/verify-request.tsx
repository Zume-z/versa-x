import Link from 'next/link'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import Logo from '@/components/Icons/Logo'

export default function VerifyRequest() {
  const router = useRouter()
  const { email } = router.query

  return (
    <Layout>
      <div className="flex h-screen flex-col items-center py-8 text-white sm:p-14 ">
        <Link href={'/'}>
          <Logo className="transition-200 h-12 w-12 text-transparent hover:text-white" borderColour="white" strokeWidth={30} />
        </Link>
        <div className="-mt-10 flex h-full w-full items-center justify-center ">
          <div className="flex w-full max-w-xl flex-col items-center space-y-10 p-4 sm:p-8">
            <div className="w-full text-center text-2xl text-white">Check your email.</div>
            <div className="text-center">A sign in link has been sent to {email ? email : 'your email'} from versax.app. Check your spam if you can't find the email.</div>
            <div className="text-gray-300">www.versax.app</div>
            <Link href={'/auth/signin'} className="transition-200 border border-gray-500 px-2 py-1 hover:border-white">
              Resend email
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}
