import IconAva from './icons/IconAva'
import ItemSetting from './ItemSetting'
import { transition_200 } from '../assets/styles/global'
import { Dispatch, SetStateAction, useState } from 'react'
import { createTab } from '../utils/requests/chromeRequest'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { CONTACT_URL, VERSA_URL } from '../utils/constants/directory'
import { ExitIcon, PersonIcon, EnvelopeClosedIcon, EnvelopeOpenIcon, PaperPlaneIcon, TwitterLogoIcon, MixerHorizontalIcon, ChatBubbleIcon } from '@radix-ui/react-icons'

export default function ButtonSetting({ setModal }: { setModal: Dispatch<SetStateAction<boolean>> }) {
  const [open, setOpen] = useState(false)
  const [contactOptions, setContactOptions] = useState(false)

  const handleContactOptions = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    setContactOptions(!contactOptions)
  }

  return (
    <div className="absolute right-3 top-2 ">
      <DropdownMenu.Root open={open} onOpenChange={() => (setOpen(!open), setContactOptions(false))}>
        <DropdownMenu.Trigger className="focus:outline-none">
          <div className="inline-flex cursor-pointer items-center rounded-full p-0.5 text-white ">{open ? <IconAva className={`${transition_200} h-7 w-7 cursor-pointer text-transparent`} borderColour="white" strokeWidth={40} /> : <IconAva className={`${transition_200} h-7 w-7 cursor-pointer text-transparent hover:text-white`} borderColour="gray" strokeWidth={40} />}</div>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content id={'content_dropdown'} align="end" side="bottom" className="z-[999999999994] w-[300px] rounded border border-gray-500 bg-[#1f2127] bg-opacity-60 px-4 py-2 backdrop-blur-md" sideOffset={0}>
          <ItemSetting label="Account" icon={<PersonIcon className="h-full w-full" />} onSelect={() => createTab(VERSA_URL.DASHBOARD, setModal)} />
          <ItemSetting label="Contact" icon={<EnvelopeClosedIcon className="h-full w-full" />} onSelect={handleContactOptions} />
          {contactOptions && (
            <div className="ml-2 border-l border-gray-500">
              <ItemSetting className="ml-1" label="Feature Request" icon={<PaperPlaneIcon className="h-full w-full" />} onSelect={() => createTab(CONTACT_URL.FEAT_EMAIL, setModal)} />
              <ItemSetting className="ml-1" label="Support" icon={<ChatBubbleIcon className="h-full w-full" />} onSelect={() => createTab(CONTACT_URL.SUPPORT_EMAIL, setModal)} />
              <ItemSetting className="ml-1" label="Message" icon={<TwitterLogoIcon className="h-full w-full" />} onSelect={() => createTab(CONTACT_URL.TWITTER, setModal)} />
              <ItemSetting className="ml-1" label="Email" icon={<EnvelopeOpenIcon className="h-full w-full" />} onSelect={() => createTab(CONTACT_URL.CONT_EMAIL, setModal)} />
            </div>
          )}
          <ItemSetting label="Usage" icon={<MixerHorizontalIcon className="h-full w-full" />} onSelect={() => createTab(VERSA_URL.USAGE, setModal)} />
          <ItemSetting label="Sign Out" icon={<ExitIcon className="h-full w-full" />} onSelect={() => createTab(VERSA_URL.SIGNOUT, setModal)} />
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  )
}
