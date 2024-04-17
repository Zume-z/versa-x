import { z } from 'zod'
import { api } from '@/utils/api/api'
import { useRouter } from 'next/router'
import { CheckIcon } from '@radix-ui/react-icons'
import { Dialog, Transition } from '@headlessui/react'
import { SubType } from '@/server/api/routers/stripe'
import { ModalType } from '@/utils/constants/interfaces'
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react'
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface ModalProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  modalType: ModalType | null
  updateSubType?: z.infer<typeof SubType> | null
  manageBilling?: () => Promise<void>
}

interface ModalData {
  header: string
  body: string
  confirmButton: JSX.Element
  icon: JSX.Element
}

export default function Modal({ open, setOpen, modalType, updateSubType, manageBilling }: ModalProps) {
  const { reload, push } = useRouter()
  const [modalData, setModalData] = useState<ModalData | null>(null)

  const { mutateAsync: updateSubscription } = api.stripe.updateSubscription.useMutation()

  const confrimUpdateSub = async () => {
    if (!updateSubType) return
    await updateSubscription({ subType: updateSubType }).then(() => {
      push('/dashboard').then(() => reload())
    })
  }

  const handleManageBilling = async () => {
    manageBilling && (await manageBilling())
    setOpen(!open)
  }

  useEffect(() => {
    if (modalType == ModalType.UPDATE_SUBSCRIPTION) {
      setModalData({
        header: 'Update Subscription',
        body: 'Your subscription will be updated immediately. You will be charged or credited the difference at the end of the billing period. Your new subscription may take a few minutes to reflect in your dashboard.',
        confirmButton: (
          <button type="button" className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:mr-3 sm:w-auto" onClick={() => confrimUpdateSub()}>
            Update Subscription
          </button>
        ),
        icon: (
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-500 sm:mx-0 sm:h-10 sm:w-10">
            <CheckIcon className="h-6 w-6 text-black" aria-hidden="true" />
          </div>
        ),
      })
    }
    if (modalType == ModalType.PAST_DUE) {
      setModalData({
        header: 'Payment Failed',
        body: 'Your most recent payment failed. Please update your payment method to continue using the service.',
        confirmButton: (
          <button type="button" className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:mr-3 sm:w-auto" onClick={() => handleManageBilling()}>
            Update Payment Method
          </button>
        ),
        icon: (
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-600 sm:mx-0 sm:h-10 sm:w-10">
            <ExclamationTriangleIcon className="h-6 w-6 text-black" aria-hidden="true" />
          </div>
        ),
      })
    }
  }, [modalType])

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enterTo="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg border border-gray-500 bg-black px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  {/* X BUTTON */}
                  <button type="button" className=" rounded-md bg-black text-white hover:text-gray-500 focus:outline-none " onClick={() => setOpen(false)}>
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  {modalData?.icon}
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-200">
                      {modalData?.header}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-50">{modalData?.body}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:ml-10 sm:mt-4 sm:flex sm:pl-4">
                  {modalData?.confirmButton}
                  <button type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" onClick={() => setOpen(false)}>
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
