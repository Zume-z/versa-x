import Link from 'next/link'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import Logo from '@/components/Icons/Logo'
import { signOut, useSession } from 'next-auth/react'

export default function SignOut() {
  const { push } = useRouter()
  const { data: session, status } = useSession()

  return (
    <Layout>
      <div className="flex h-screen flex-col items-center p-14 text-white ">
        <Link href={'/'}>
          <Logo className="transition-200 h-12 w-12 text-transparent hover:text-white" borderColour="white" strokeWidth={30} />
        </Link>
        {session && (
          <div className="flex h-full flex-col items-center justify-center text-white ">
            <div className="text-white">Would you like to sign out of {session.user.email}?</div>
            <button onClick={() => signOut({ callbackUrl: '/' })} className=" transition-200 mt-6 rounded-sm border border-gray-700 px-4  py-2 hover:border-white ">
              Sign Out
            </button>
          </div>
        )}
        {!session && status != 'loading' && (
          <div className="flex h-full flex-col items-center justify-center ">
            <div className="text-white">You are already signed out.</div>
            <button onClick={() => push('/')} className=" transition-200 mt-6 rounded-sm border border-gray-700 px-4  py-2 hover:border-white  ">
              Return to homepage
            </button>
          </div>
        )}
      </div>
    </Layout>
  )
}
