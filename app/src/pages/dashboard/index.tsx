import { api } from '@/utils/api/api'
import Modal from '@/components/Modal'
import Usage from '@/components/Usage'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import SideBar from '@/components/SideBar'
import Account from '@/components/Account'
import NavDash from '@/components/NavDash'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { ModalType } from '@/utils/constants/interfaces'
import { SubscriptionData, formatSubData } from '@/utils/functions/subscription'

export default function Dashboard() {
  const { push } = useRouter()
  const { data: session, status } = useSession()
  const { data, isLoading } = api.user.subscriptionData.useQuery({})
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<ModalType | null>(null)
  const [subData, setSubData] = useState<SubscriptionData | null>(null)
  const { mutateAsync: createBillingPortalSession } = api.stripe.createBillingPortalSession.useMutation()

  const manageBilling = async () => {
    const { billingPortalUrl } = await createBillingPortalSession()
    if (billingPortalUrl) void push(billingPortalUrl)
  }

  useEffect(() => {
    status === 'unauthenticated' && push('/auth/signin')
  }, [status])

  useEffect(() => {
    if (!isLoading && data?.subscriptionStatus == 'past_due') {
      setModalOpen(true)
      setModalType(ModalType.PAST_DUE)
    }
  }, [isLoading, data?.subscriptionStatus])

  useEffect(() => {
    !isLoading && data && setSubData(formatSubData(data))
  }, [isLoading, data])

  return (
    <>
      <NavDash session={session} userData={data} userLoading={isLoading} manageBilling={manageBilling} subData={subData} />
      {!isLoading && (
        <Layout>
          <Modal open={modalOpen} setOpen={setModalOpen} modalType={modalType} manageBilling={manageBilling} />
          {session && (
            <div className="flex h-screen flex-col pt-14">
              <div className="flex flex-grow border-t border-gray-700/50">
                <SideBar subData={subData} manageBilling={manageBilling} />
                <div className="w-full overflow-y-auto sm:pl-40">
                  <Account session={session} subData={subData} manageBilling={manageBilling} settingsData={data} />
                  {subData && <Usage subData={subData} />}
                </div>
              </div>
            </div>
          )}
        </Layout>
      )}
    </>
  )
}
