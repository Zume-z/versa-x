import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import Pricing from '@/components/Pricing'
import NavDash from '@/components/NavDash'
import { useSession } from 'next-auth/react'
import { removeFreeTrial } from '@/utils/functions/functions'
import { subscriptionModel } from '@/utils/constants/subscriptionModel'

export default function Subscribe() {
  const { push } = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    status === 'unauthenticated' && push('/auth/signin')
  }, [status])

  return (
    <>
      <NavDash session={session} />
      <Layout>{session && <Pricing title="Upgrade your plan" subModel={removeFreeTrial(subscriptionModel)} />}</Layout>
    </>
  )
}
