import { VERSA_URL } from '../utils/constants/directory'
import { createTab } from '../utils/requests/chromeRequest'
import IconAva from './icons/IconAva'

export default function Login({ modal, setModal }: { modal: boolean; setModal: React.Dispatch<React.SetStateAction<boolean>> }) {
  const bgImage = chrome.runtime.getURL('src/assets/img/index.png')

  return (
    <>
      <img src={bgImage} alt="" className="absolute -z-10 h-full w-full p-1" />
      <div className="flex h-full w-full items-center justify-center bg-dark-void/40 backdrop-blur-md">
        <div className="flex-col space-y-3 ">
          <div onClick={() => createTab(VERSA_URL.HOME)}>
            <IconAva className="transition-200 mx-auto -mt-16 h-10 w-10 cursor-pointer text-transparent hover:text-white" borderColour="white" strokeWidth={30} />
          </div>
          <div className=" w-full text-center text-lg">Welcome Back.</div>
          <div className=" mx-auto my-2 w-min cursor-pointer border border-gray-500 px-2 text-lg hover:border-white " onClick={() => createTab(VERSA_URL.SIGNIN, setModal)}>
            Login
          </div>
        </div>
      </div>
    </>
  )
}
