import Layout from '@/components/Layout'
import NavIndex from '@/components/NavIndex'

export default function PrivacyPolicy() {
  return (
    <>
      <NavIndex />
      <Layout>
        <div className="px-2 py-10 pt-24 text-white sm:px-8">
          <div className="py-4">
            <p className="text-3xl">Privacy Policy</p>
            <p className="mt-4"> This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You. We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.</p>
          </div>
          <div className="py-4">
            <p className="text-2xl">Personal Information Collected</p>
            <p className="mt-2">When users sign up, we collect names and email addresses either through Google authentication or directly provided by the user. Website data is collected when the user opens the extension. Payment details are collected through the third-party payment system Stripe.</p>
          </div>
          <div className="py-4">
            <p className="text-2xl">Collection Methods</p>
            <p className="mt-2">Names and email addresses are obtained directly from users through authentication or direct input. Website data is collected by scraping the website the user is on when the extension is opened. Payment details are collected through the secure third-party payment system Stripe.</p>
          </div>
          <div className="py-4">
            <p className="text-2xl">Purpose of Collection</p>
            <p className="mt-2">We collect email addresses for user authentication, verification purposes and to manage your account. Your email may also be used to contact you on for informative communications related to the functionalities and security updates, when necessary or reasonable for their implementation. Payment details are collected for processing payments related to the Chrome extension. </p>
          </div>
          <div className="py-4">
            <p className="text-2xl">Cookies and Tracking</p>
            <p className="mt-2 text-lg">Session Cookies</p>
            <p className="">These Cookies are essential to provide You with services available through the Website and to enable You to use some of its features. They help to authenticate users and prevent fraudulent use of user accounts. Without these Cookies, the services that You have asked for cannot be provided, and We only use these Cookies to provide You with those services.</p>
            <p className="mt-2 text-lg">Functionality Cookies</p>
            <p className="">These Cookies allow us to remember choices You make when You use the Website, such as remembering your login details or language preference. The purpose of these Cookies is to provide You with a more personal experience and to avoid You having to re-enter your preferences every time You use the Website.</p>
            <p className="mt-2 text-lg">Message Storage</p>
            <p className="">User messages sent to the OpenAI API are collected in an anonymized and aggregated form. These messages are used for training and enhancing the app, but no personal or identifiable information about the sender is stored or retained.</p>
          </div>
          <div className="py-4">
            <p className="text-2xl">Retention of Personal Data</p>
            <p className="mt-2">
              The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use Your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies. The Company will also retain Usage Data for internal analysis purposes. Usage Data is generally retained
              for a shorter period of time, except when this data is used to strengthen the security or to improve the functionality of Our Service, or We are legally obligated to retain this data for longer time periods.
            </p>
          </div>
          <div className="py-4">
            <p className="text-2xl">Delete Your Personal Data</p>
            <p className="mt-2">
              You have the right to delete or request that We assist in deleting the Personal Data that We have collected about You. Our Service may give You the ability to delete certain information about You from within the Service. You may update, amend, or delete Your information at any time by signing in to Your Account, if you have one, and visiting the account settings section that allows you to manage Your personal information. You may also contact Us to request access to, correct, or
              delete any personal information that You have provided to Us. Please note, however, that We may need to retain certain information when we have a legal obligation or lawful basis to do so.
            </p>
          </div>
          <div className="py-4">
            <p className="text-2xl">Security of Your Personal Data</p>
            <p className="mt-2">The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially acceptable means to protect Your Personal Data, We cannot guarantee its absolute security.</p>
          </div>
          <div className="py-4">
            <p className="text-2xl">Children's Privacy</p>
            <p className="mt-2">
              Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If You are a parent or guardian and You are aware that Your child has provided Us with Personal Data, please contact Us. If We become aware that We have collected Personal Data from anyone under the age of 13 without verification of parental consent, We take steps to remove that information from Our servers. If We need to rely on
              consent as a legal basis for processing Your information and Your country requires consent from a parent, We may require Your parent's consent before We collect and use that information.
            </p>
          </div>
          <div className="py-4">
            <p className="text-2xl">Changes to this Privacy Policy</p>
            <p className="mt-2">
              We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page. We will let You know via email and/or a prominent notice on Our Service, prior to the change becoming effective and update the "Last updated" date at the top of this Privacy Policy. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
          </div>
          <div className="py-4">
            <p className="text-2xl">Contact Us</p>
            <p className="mt-2">If you have any questions about this Privacy Policy, You can contact us by email: versax.app@gmail.com</p>
          </div>
        </div>
      </Layout>
    </>
  )
}
