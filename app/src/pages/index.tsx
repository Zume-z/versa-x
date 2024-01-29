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
      {/* DISPLAY TAG */}
      {/* <div className=" fixed right-5 top-16 cursor-pointer ">
        <div className="fixed right-5 top-16 rounded-lg p-0.5 px-1 text-center">X</div>
        <div className="rounded-md border border-blue-800 bg-white p-5 text-blue-600">
          <span className="text-sm">This site is for display purposes only.</span>
        </div>
      </div> */}

      <Layout className="pb-10">
        {/* SITE MATINENCE */}
        {/* <div className="flex h-screen items-center justify-center text-white ">
          <div>Site Under Maintenance.</div>
        </div> */}

        <Landing />
        <Features />
        <CallToAction />
        <Pricing title="Select your plan" subModel={subscriptionModel} />
        <SocialMedia />
      </Layout>
    </>
  )
}
