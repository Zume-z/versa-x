import Link from 'next/link'
import Logo from './Icons/Logo'
import { Session } from 'next-auth'
import ButtonLink from './ButtonLink'
import { useRouter } from 'next/router'
import { signOut } from 'next-auth/react'
import { AppRouter } from '@/server/api/root'
import { Disclosure } from '@headlessui/react'
import { inferRouterOutputs } from '@trpc/server'
import { SlashIcon } from '@radix-ui/react-icons'
import { TRPCClientErrorLike } from '@trpc/client'
import { CONTACT_HREF } from '@/utils/constants/directory'
import { getUserName } from '@/utils/functions/convert'
import { UseTRPCQueryResult } from '@trpc/react-query/shared'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { SubscriptionData } from '@/utils/functions/subscription'

interface NavDashProps {
  session: Session | null
  userData?: UseTRPCQueryResult<inferRouterOutputs<AppRouter>['user']['subscriptionData'], TRPCClientErrorLike<AppRouter>>['data']
  userLoading?: boolean
  manageBilling?: () => Promise<void>
  subData?: SubscriptionData | null
}

export default function NavDash({ session, userData, userLoading, manageBilling, subData }: NavDashProps) {
  const { pathname } = useRouter()

  const navigation = [
    { name: 'Account', href: ' ', current: true, disabled: pathname === '/subscribe' },
    { name: 'Dashboard', href: '/dashboard', current: true, disabled: pathname === '/dashboard' },
    { name: 'Usage', href: '#usage', current: false, disabled: !subData },
    { name: 'Billing', onClick: manageBilling, current: false, disabled: subData?.status !== 'active' && subData?.status !== 'past_due' },
    { name: 'Feedback', href: CONTACT_HREF.FEEDBACK, current: false },
    { name: 'Support', href: CONTACT_HREF.SUPPORT, current: false },
    { name: 'Sign Out', onClick: signOut, current: false },
  ]

  return (
    <Disclosure as="nav" className="fixed z-50 w-full border-b border-gray-700/50 bg-black/70 backdrop-blur-md  ">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 md:px-16">
            <div className="relative flex h-14 items-center justify-between">
              {/* Mobile menu button*/}
              <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-100  hover:text-white focus:outline-none ">
                  <span className="sr-only">Open main menu</span>
                  {open ? <XMarkIcon className="block h-8 w-8" aria-hidden="true" /> : <Bars3Icon className="block h-8 w-8" aria-hidden="true" />}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1   sm:items-stretch sm:justify-start">
                <div className="flex h-8 items-center space-x-1 text-white">
                  <Link href={'/'} className="">
                    <Logo className="transition-200 mr-1  h-8 w-8 text-gray-100 XY:hover:text-transparent" borderColour="white" strokeWidth={40} />
                  </Link>
                  <SlashIcon className=" h-7 w-auto rotate-6  text-gray-800" />
                  <div className="h-8 w-8 rounded-full border border-gray-800 bg-gradient-to-br from-yellow-500  to-pink-500" />
                  <div>
                    <div className="text px-1 text-gray-100"> {getUserName(session)}</div>
                  </div>
                </div>
              </div>

              {/* BUTTONS RIGHT */}
              {!userLoading && (
                <div className="absolute inset-auto  inset-y-0  right-0 hidden items-center space-x-4 text-white sm:flex">
                  {!userData?.subscriptionStatus && pathname === '/dashboard' && <ButtonLink href={'/subscribe'} className="button-background" text="Upgrade" />}
                  {userData?.subscriptionStatus == 'trialing' && pathname === '/dashboard' && <ButtonLink href={'/subscribe'} className="button-background" text="Upgrade" />}
                  {userData?.subscriptionStatus && userData?.subscriptionStatus !== 'trialing' && <ButtonLink href={CONTACT_HREF.FEEDBACK} className="button-background" text="Feedback" />}
                  {pathname === '/subscribe' && <ButtonLink href={'/dashboard'} className="button-background" text="Dashboard" />}
                  <button onClick={() => signOut({ callbackUrl: '/' })} className=" button-border ">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

          <Disclosure.Panel className=" h-screen border-t border-gray-700 sm:hidden">
            <div className="flex flex-col space-y-3 px-8  pt-4">
              {navigation.map((item) => (
                <Disclosure.Button key={item.name} as="a" href={item.href} onClick={() => item.onClick && item.onClick()} className={`text-xl text-white ${item.disabled ? 'hidden' : ''} `} aria-current={item.current ? 'page' : undefined}>
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
