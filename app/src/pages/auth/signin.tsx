import Link from 'next/link'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import Logo from '@/components/Icons/Logo'
import { useEffect, useState } from 'react'
import GoogleIcon from '@/components/Icons/GoogleIcon'
import SpinnerIcon from '@/components/Icons/SpinnerIcon'
import { BuiltInProviderType } from 'next-auth/providers'
import { ClientSafeProvider, LiteralUnion, getProviders, signIn, useSession } from 'next-auth/react'
import { VERSA_HREF } from '@/utils/constants/directory'

export default function SignIn() {
  const { push, query } = useRouter()
  const { data: session, status } = useSession()
  const [email, setEmail] = useState<string>('')
  const [providers, setProviders] = useState<Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null>()
  const [inputError, setInputError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    // tslint:disable-next-line
    ;(async () => {
      setProviders(await getProviders())
    })()
  }, [])

  useEffect(() => {
    if (query.error) {
      if (query.error === 'OAuthAccountNotLinked') setInputError('Email address not linked to account. Please log in with original method.')
      else {
        setInputError('Error signing in. Please try again.')
      }
    }
  }, [query])

  const submitEmail = async (e: { preventDefault: () => void }) => {
    setInputError('')
    e.preventDefault()

    // Error Handling
    if (!email) return setInputError('Please enter your email address')
    if (!email.includes('@')) return setInputError('Please enter a valid email address')

    setLoading(true)
    await signIn('email', { email: email, redirect: false }).then((res) => {
      if (res?.error) {
        setInputError('Email address error. Please try again.')
      } else if (res?.ok && res.url) {
        push(VERSA_HREF.VERIFY_REQ + email)
      }
    })
    setLoading(false)
  }

  const signInOAuth = async (provider: string) => {
    setLoading(true)
    await signIn(provider, { callbackUrl: VERSA_HREF.DASHBOARD }).then(() => {
      setTimeout(() => {
        setLoading(false)
      }, 2000)
    })
  }

  // Redirect
  if (session) push('/dashboard')
  if (status == 'unauthenticated')
    return (
      <Layout>
        <div className="flex h-screen flex-col items-center py-8  text-white  sm:p-14 ">
          <Link href={'/'}>
            <Logo className="transition-200 h-12 w-12 text-transparent hover:text-white" borderColour="white" strokeWidth={30} />
          </Link>
          {loading && (
            <div className="flex h-full w-full items-center justify-center ">
              <SpinnerIcon className="-mt-24" />
            </div>
          )}
          {!loading && (
            <>
              {providers && (
                <div className="flex h-full w-full items-center justify-center ">
                  <div className="w-full max-w-sm flex-col space-y-10 px-4  sm:-mt-10 sm:px-8 ">
                    <div className="w-full text-center text-2xl text-white">Welcome back.</div>

                    {/* EMAIL SIGNIN */}
                    <form className="flex w-full flex-col" onSubmit={submitEmail}>
                      {inputError && <div className="mb-2 py-1 text-xs text-red-500">{inputError}</div>}
                      <div className="z-50 -mb-2 ml-2 w-min whitespace-nowrap bg-black px-1 text-xs">Email Address</div>
                      <input className=" w-full border border-white bg-black px-3 py-3 text-white focus:outline-none" id="email" name="email" placeholder="@example.com" onChange={(e) => setEmail(e.target.value)} />
                      <button className="  transition-200 mt-6 border border-gray-500 bg-white p-3 text-black hover:bg-black hover:text-white " type="submit">
                        Continue
                      </button>
                    </form>

                    {/* SEPERATOR */}
                    <div className="space-y-3">
                      <div className=" flex w-full items-center justify-center space-x-1 text-center text-sm">
                        <p>Don't have an account? </p>
                        <p onClick={() => push('/auth/signup')} className="cursor-pointer text-blue-500 hover:underline">
                          Sign up
                        </p>
                      </div>
                      <div className="flex items-center justify-center ">
                        <span className="h-[0.5px] w-full bg-white" />
                        <div className="px-2 text-xs">OR</div>
                        <span className="h-[0.5px] w-full bg-white" />
                      </div>
                    </div>

                    {/* GOOGLE OAUTH */}
                    <div>
                      <button className="transition-200 flex w-full items-center justify-center space-x-2 border border-gray-500  p-4 text-white  hover:border-white" onClick={() => signInOAuth(providers.google.id)}>
                        <GoogleIcon className="h-6 w-6" />
                        <div>Continue in with {providers.google.name}</div>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Layout>
    )
}
