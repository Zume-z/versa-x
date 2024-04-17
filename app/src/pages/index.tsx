import Layout from '@/components/Layout'
import Landing from '@/components/Landing'
import Pricing from '@/components/Pricing'
import NavIndex from '@/components/NavIndex'
import Features from '@/components/Features'
import SocialMedia from '@/components/SocialMedia'
import CallToAction from '@/components/CallToAction'
import { subscriptionModel } from '@/utils/constants/subscriptionModel'

export default function Home() {
  return (
    <>
      <NavIndex />
      <Layout className="pb-10">
        <Landing />
        <Features />
        <CallToAction />
        <Pricing title="Select your plan" subModel={subscriptionModel} />
        <SocialMedia />
      </Layout>
    </>
  )
}
