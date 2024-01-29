import { z } from 'zod'
import Modal from './Modal'
import { api } from '@/utils/api/api'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { SubType } from '@/server/api/routers/stripe'
import { VERSA_HREF } from '@/utils/constants/directory'
import { formatTokens } from '@/utils/functions/convert'
import { ModalType } from '@/utils/constants/interfaces'
import { SubscriptionData, formatSubData } from '@/utils/functions/subscription'
import { SubscriptionModel, subscriptionModel } from '@/utils/constants/subscriptionModel'

interface pricingProps {
  title: string
  subModel: SubscriptionModel
}

export default function Pricing({ title, subModel }: pricingProps) {
  const { push } = useRouter()
  const { data: session } = useSession()
  const { mutateAsync: createCheckoutSession } = api.stripe.createCheckoutSession.useMutation()
  const [modalOpen, setModalOpen] = useState(false)
  const [subData, setSubData] = useState<SubscriptionData | null>(null)
  const [updateSubType, setUpdateSubType] = useState<z.infer<typeof SubType> | null>(null)
  const [modalType, setModalType] = useState<ModalType | null>(null)
  const { data, isLoading } = api.user.subscriptionData.useQuery({}, { enabled: !!session })

  useEffect(() => {
    !isLoading && data && setSubData(formatSubData(data))
  }, [isLoading, data])

  const handleSelectPlan = async (subType: z.infer<typeof SubType>) => {
    if (!session) return void push('/auth/signup')

    // IF USER ISN'T SUBSCRIBED OR ARE TRIALING
    if (!subData || subData.id === 'TRIAL') {
      const { checkoutUrl } = await createCheckoutSession({ subType: subType })
      if (checkoutUrl) {
        void push(checkoutUrl)
      }
    }

    // IF USER IS SUBSCRIBED
    if (subData) {
      setModalOpen(true)
      setUpdateSubType(subType)
      setModalType(ModalType.UPDATE_SUBSCRIPTION)
    }
  }

  return (
    <div id={'pricing'} className="flex flex-col items-center justify-center text-white">
      <Modal open={modalOpen} setOpen={setModalOpen} modalType={modalType} updateSubType={updateSubType} />
      <div className="w-full bg-black text-white">
        <div>
          <div className="w-full py-10">
            <div className=" py-10 text-3xl  text-white">
              <p>{title}</p>
              <p className="text-2xl">Simple and flexible pricing to fit your needs.</p>
            </div>

            {Object.keys(subModel).map((key) => (
              <div key={subModel[key as keyof SubscriptionModel].id} className="flex w-full border-t pb-10 pt-2 text-white">
                <div className="w-2/3 text-2xl font-semibold text-white">{subModel[key as keyof SubscriptionModel].name}</div>
                <div className="w-full flex-col space-y-5 ">
                  <div className=" text-white">{subModel[key as keyof SubscriptionModel].description}</div>
                  <div className="flex items-end ">
                    <div className="w-full ">
                      <div className="grid w-full grid-cols-3 items-center border-t border-gray-500 py-1 text-sm font-semibold sm:text-base">
                        <div>Price</div>
                        <div onClick={() => push('/faq#tokens')} className="group flex cursor-pointer space-x-1">
                          <div>Tokens</div>
                          <div className="transition-200 -mt-1 text-[10px] text-gray-400 group-hover:text-white sm:mt-0 sm:text-xs">?</div>
                        </div>
                        <div>Period</div>
                      </div>

                      <div className="grid w-full grid-cols-3 items-center border-b border-t border-gray-500 py-1 text-sm sm:text-base  ">
                        <div>${subModel[key as keyof SubscriptionModel].price}</div>
                        <div>{formatTokens(subModel[key as keyof SubscriptionModel].tokens)}</div>
                        <div>{subModel[key as keyof SubscriptionModel].billingPeriod}</div>
                      </div>
                    </div>
                  </div>

                  {subData?.id !== subscriptionModel[key as keyof SubscriptionModel].subType && subscriptionModel[key as keyof SubscriptionModel].subType !== 'TRIAL' && (
                    <button onClick={() => handleSelectPlan(subscriptionModel[key as keyof SubscriptionModel].subType)} aria-describedby={subscriptionModel[key as keyof SubscriptionModel].id} className={'button-border  '}>
                      {subModel[key as keyof SubscriptionModel].selectTitle}
                    </button>
                  )}

                  {subData?.id === subscriptionModel[key as keyof SubscriptionModel].subType && subscriptionModel[key as keyof SubscriptionModel].subType !== 'TRIAL' && (
                    <button disabled aria-describedby={subscriptionModel[key as keyof SubscriptionModel].id} className={'button-border-disabled '}>
                      Current plan
                    </button>
                  )}

                  {subscriptionModel[key as keyof SubscriptionModel].subType === 'TRIAL' && (
                    <button onClick={() => push(VERSA_HREF.DOWNLOAD)} aria-describedby={subscriptionModel[key as keyof SubscriptionModel].id} className={'button-border '}>
                      Download
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
