import Link from 'next/link'
import Logo from './Icons/Logo'
import { api } from '@/utils/api/api'
import ButtonLink from './ButtonLink'
import { useSession } from 'next-auth/react'
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { CONTACT_HREF } from '@/utils/constants/directory'

export default function NavIndex() {
  const { data: session, status: sessionStatus } = useSession()
  const { data, isLoading } = api.user.subscriptionData.useQuery({}, { enabled: !!session })

  const navigation = [
    { name: 'Features', href: '/#features', current: false },
    { name: 'Pricing', href: '/#pricing', current: false },
    { name: 'FAQ', href: '/faq', current: false },
  ]

  const mobileNavigation = [
    { name: 'Features', href: '/#features', current: false },
    { name: 'Pricing', href: '/#pricing', current: false },
    { name: 'FAQ', href: '/faq', current: false },
    { name: 'Feedback', href: CONTACT_HREF.FEEDBACK, current: false },
    { name: 'Support', href: CONTACT_HREF.SUPPORT, current: false },
  ]

  return (
    <Disclosure as="nav" className="fixed z-50 w-full border-b border-gray-700/50 bg-black/70 backdrop-blur-md  ">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 md:px-16">
            <div className="relative flex items-center justify-between py-3 ">
              {/* Mobile menu button*/}
              <div className="absolute inset-y-0 left-0 flex items-center focus:outline-none sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-100  hover:text-white focus:outline-none ">
                  <span className="sr-only">Open main menu</span>
                  {open ? <XMarkIcon className="block h-8 w-8" aria-hidden="true" /> : <Bars3Icon className="block h-8 w-8" aria-hidden="true" />}
                </Disclosure.Button>
              </div>

              {/* Header  */}
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Link href={'/'}>
                    <Logo className=" transition-200 mr-4  h-8  w-8 text-gray-100 XY:hover:text-transparent" borderColour="white" strokeWidth={40} />
                  </Link>
                </div>
                <div className="hidden  sm:block">
                  <div className="flex h-full  space-x-2">
                    {navigation.map((item) => (
                      <div className="flex h-full items-center justify-center" key={item.name}>
                        <a href={item.href} className="button-background" aria-current={item.current ? 'page' : undefined}>
                          {item.name}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute inset-auto inset-y-0 right-0 flex items-center space-x-4 text-white">
                {!session && sessionStatus !== 'loading' && (
                  <>
                    <ButtonLink href={'/auth/signin'} className="button-background hidden sm:flex" text="Log in" />
                    <ButtonLink href={'/auth/signup'} className="button-border" text="Sign up" />
                  </>
                )}

                {session && !isLoading && (
                  <>
                    {!data?.subscriptionStatus && <ButtonLink href={'/subscribe'} className="button-background" text="Upgrade" />}
                    {data?.subscriptionStatus == 'trialing' && !isLoading && <ButtonLink href={'/subscribe'} className="button-background" text="Upgrade" />}
                    {data?.subscriptionStatus && data?.subscriptionStatus != 'trialing' && <ButtonLink href={CONTACT_HREF.FEEDBACK} className="button-background hidden sm:flex" text="Feedback" />}
                    <ButtonLink href={'/dashboard'} className="button-border" text="Dashboard" />
                  </>
                )}
              </div>
            </div>
          </div>
          <Disclosure.Panel className=" h-screen border-t border-gray-700 sm:hidden">
            <div className="flex flex-col space-y-3 px-8 pt-4">
              {mobileNavigation.map((item) => (
                <Disclosure.Button key={item.name} as="a" href={item.href} className={'text-xl text-white '} aria-current={item.current ? 'page' : undefined}>
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
