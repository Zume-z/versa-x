import { useEffect, useState } from 'react'
import { createTab } from '../utils/requests/chromeRequest'
import { VERSA_URL, DIR } from '../utils/constants/directory'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { ERROR_CODE, SESSION } from '../utils/constants/authInterfaces'
import { error_button } from '../assets/styles/global'

interface PageErrorProps {
  setPage: (value: DIR) => void
  session: SESSION | null
  pageErrType: ERROR_CODE | null
}

interface ErrorData {
  header: string
  body: string
  button: JSX.Element
  icon: JSX.Element
}

export default function PageError({ session, pageErrType, setPage }: PageErrorProps) {
  const [errorData, setErrorData] = useState<ErrorData | null>(null)
  const bgImage = chrome.runtime.getURL('src/assets/img/index.png')

  useEffect(() => {
    if (pageErrType == ERROR_CODE.PAYMENT_PAST_DUE) {
      setErrorData({
        header: 'Payment Failed.',
        body: `There was an issue proccessing the payment of your ${session?.subTier ? session.subTier.toLowerCase() : ''} plan. Please update your billing method to continue.`,
        icon: <ExclamationTriangleIcon className="h-8 w-8 text-red-600" aria-hidden="true" />,
        button: (
          <div className={error_button} onClick={() => createTab(VERSA_URL.DASHBOARD)}>
            Update Payment
          </div>
        ),
      })
    }
    if (pageErrType == ERROR_CODE.TOKEN_LIMIT_EXCEEDED) {
      setErrorData({
        header: 'Token Limit Reached.',
        body: `You have reached the token limit of your ${session?.subTier ? session.subTier.toLowerCase() : ''} plan. Please upgrade your plan to continue. You can view your usage in the dashboard.`,
        icon: <ExclamationTriangleIcon className="h-8 w-8 text-red-600" aria-hidden="true" />,
        button: (
          <div className={error_button} onClick={() => createTab(VERSA_URL.SUBSCRIBE)}>
            Upgrade Plan
          </div>
        ),
      })
    }
    if (pageErrType == ERROR_CODE.SUBSCRIPTION_NOT_FOUND) {
      setErrorData({
        header: 'Subscription Not Found.',
        body: `No subscription was found, upgrade your plan to get started today.`,
        icon: <ExclamationTriangleIcon className="h-8 w-8 text-gray-200" aria-hidden="true" />,
        button: (
          <div className={error_button} onClick={() => createTab(VERSA_URL.SUBSCRIBE)}>
            Upgrade Plan
          </div>
        ),
      })
    }
  }, [pageErrType])

  return (
    <>
      <img src={bgImage} alt="" className="absolute -z-10 h-full w-full p-1" />
      <div className="flex h-full w-full items-center bg-dark-void/40 backdrop-blur-md ">
        <div className="w-full flex-col items-center justify-center px-40">
          <div className="mx-auto w-min p-2 ">{errorData?.icon}</div>
          <div className="p-2 text-center text-lg">{errorData?.header}</div>
          <div className=" p-2 text-center text-gray-100">{errorData?.body}</div>
          <div className="mt-4 flex items-center justify-center space-x-4">
            {errorData?.button}
            <div className={error_button} onClick={() => createTab(VERSA_URL.DASHBOARD)}>
              View Account
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
