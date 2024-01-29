import Link from 'next/link'
import Layout from '@/components/Layout'
import NavIndex from '@/components/NavIndex'
import Accordian from '@/components/Accordian'
import { CONTACT_HREF } from '@/utils/constants/directory'
import { securityFAQ, tokenFAQ } from '@/utils/constants/faq'

export default function Explain() {
  return (
    <>
      <NavIndex />
      <Layout>
        <div className="px-2 py-10 pt-24 text-white sm:px-8">
          <p className="text-3xl">Frequently asked questions.</p>
          <div id={'tokens'} className="py-10">
            <p className="mb-4  py-1 text-2xl">Tokens</p>
            <Accordian data={tokenFAQ} />
          </div>

          <div id={'security'} className="py-10">
            <p className="mb-4 py-1 text-2xl">Security</p>
            <Accordian data={securityFAQ} />
          </div>
          <div className="py-10">
            <div className="justify-between  sm:flex">
              <Link href={CONTACT_HREF.SUPPORT} className="w-full cursor-pointer whitespace-normal text-2xl hover:underline sm:whitespace-nowrap">
                Can't find your question? Get in touch.
              </Link>

              <div className="pt-4 sm:pt-0">
                <Link href="/privacy-policy" className="cursor-pointer whitespace-normal  text-2xl hover:underline sm:whitespace-nowrap ">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}
