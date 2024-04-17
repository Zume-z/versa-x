import React from 'react'
import { useRouter } from 'next/router'
import { CONTACT_HREF } from '@/utils/constants/directory'
import { SubscriptionData } from '@/utils/functions/subscription'

export default function SideBar({ subData, manageBilling }: { subData: SubscriptionData | null; manageBilling: () => Promise<void> }) {
  const { asPath, push } = useRouter()

  const sidebarNav = [
    { name: 'Account', href: ' ', active: asPath === '/dashboard' },
    { name: 'Usage', href: '#usage', disabled: !subData, active: asPath === '/dashboard#usage' },
    { name: 'Billing', disabled: subData?.status !== 'active' && subData?.status !== 'past_due', active: asPath === '/dashboard/billing', onClick: manageBilling },
    { name: 'Support', href: CONTACT_HREF.CONTACT, active: asPath === '/dashboard/support' },
  ]

  return (
    <div className="fixed hidden h-full flex-col space-y-3 border-r border-gray-800 bg-black px-12 pt-10 sm:block  ">
      {sidebarNav.map((nav) => (
        <div key={nav.name} className={nav.disabled ? 'pointer-events-none opacity-50' : 'cursor-pointer'}>
          <div
            onClick={() => {
              nav.onClick && nav.onClick()
              nav.href && push(nav.href)
            }}
            className={nav.active ? 'text-white' : 'text-gray-500 hover:text-white'}
          >
            {nav.name}
          </div>
        </div>
      ))}
    </div>
  )
}
