import Link from 'next/link'
import Settings from './Settings'
import { Session } from 'next-auth'
import { useRouter } from 'next/router'
import { formatTokens, getUserName } from '@/utils/functions/convert'
import { SubscriptionData } from '@/utils/functions/subscription'

interface AccountProps {
  session: Session | null
  subData?: SubscriptionData | null
  manageBilling: () => Promise<void>
  settingsData: any
}

export default function Account({ session, subData, manageBilling, settingsData }: AccountProps) {
  const { push } = useRouter()

  return (
    <div id={'account'} className="flex w-full flex-col px-2 py-4 text-white sm:p-10">
      <div>
        <div className="text-2xl">Account</div>
        <div className="text-sm">Manage your account.</div>
      </div>
      <div className="mt-6 space-y-4">
        <div className="py-2">
          <div>Profile</div>
          <div className="my-2 h-[0.5px] w-full bg-gray-500/70" />
          <div className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-12 w-12 rounded-full border border-gray-800 bg-gradient-to-br from-yellow-500  to-pink-500" />
              <div className="text-sm text-white">{getUserName(session)}</div>
            </div>
          </div>
        </div>

        {/* EMAIL */}
        <div className="py-2">
          <div>Email Addresses</div>
          <div className="my-2 h-[0.5px] w-full bg-gray-500/70" />
          <div className="p-4">
            <div className="flex items-center space-x-2 text-white">
              <div className="text-sm">{session?.user.email}</div>
              <div className="rounded border border-gray-500 px-1 text-xs text-gray-300">Primary</div>
            </div>
          </div>
        </div>

        {/* SUBSCRIPTION */}
        <div className="py-2">
          <div className="item-center flex space-x-2 text-white">
            <div>Subscription</div>
            {!subData && <div className="flex items-center rounded border border-gray-500 px-1 text-sm text-gray-300">Inactive</div>}
            {subData?.status == 'active' && (
              <>
                {!subData.cancelAt && <div className="flex items-center rounded border border-green-500 px-1 text-sm text-green-500"> Active</div>}
                {subData.cancelAt && <div className="flex items-center rounded border border-orange-500 px-1 text-sm text-orange-500 "> Cancelled. Subscription ends {subData.cancelAt}</div>}
              </>
            )}
            {subData?.status == 'trialing' && (
              <div className="flex items-center rounded border  border-blue-700 px-1 text-sm text-blue-500">
                <div>Trial</div>
              </div>
            )}
            {subData?.status == 'past_due' && (
              <div className="flex items-center rounded border  border-red-700 px-1 text-sm text-red-500">
                <div>Payment Failed</div>
              </div>
            )}
          </div>
          <div className="my-2 h-[0.5px] w-full bg-gray-500/70" />
          <div className="p-4 text-sm">
            {/* SUBSCRIBED USER */}
            {subData && (
              <>
                <div className={`button-outline group w-full max-w-[400px] cursor-pointer p-4 ${subData.status == 'past_due' ? 'pointer-events-none opacity-50' : ''}`} onClick={() => push('/subscribe')}>
                  <div className="flex w-full items-center justify-between space-x-2 ">
                    <div className="whitespace-nowrap text-base">{subData?.type}</div>
                    <div className="rounded border border-gray-500 px-1 text-sm text-gray-300 group-hover:border-white group-hover:text-white">Update</div>
                  </div>
                  <div className="space-y-1 p-2 text-gray-400">
                    <div className="whitespace-nowrap"> • ${subData?.price}/month </div>
                    <div className="whitespace-nowrap"> • {formatTokens(subData?.tokenTotal)} Tokens </div>
                    <div>
                      <div className="whitespace-nowrap">
                        • {subData.currentPeriodStart} - {subData.currentPeriodEnd}
                      </div>
                    </div>
                  </div>
                </div>

                {subData.status == 'active' && (
                  <button onClick={() => manageBilling()} className="button-outline mt-5 w-min whitespace-nowrap p-1 px-2 text-base ">
                    Manage Billing & Subscription
                  </button>
                )}

                {subData.status == 'past_due' && (
                  <button onClick={() => manageBilling()} className="button-outline mt-5 w-min whitespace-nowrap p-1 px-2 text-base ">
                    Update Payment Method
                  </button>
                )}
              </>
            )}

            {/* UNSUBSCRIBED USER */}
            {!subData && (
              <div className="transition-200 flex w-min items-center rounded border border-gray-500 px-4 py-1 text-center text-base hover:bg-white hover:text-black ">
                <Link className="" href={'/subscribe'}>
                  Upgrade
                </Link>
              </div>
            )}
          </div>
        </div>
        <Settings settingsData={settingsData} />
      </div>
    </div>
  )
}
