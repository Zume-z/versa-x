import { Dispatch, SetStateAction } from 'react'
import { SESSION } from '../constants/authInterfaces'
import { DIR } from '../constants/directory'
import { CHROME_ACTION } from '../constants/chromeInterfaces'

// Authenticate user session
export const authCheck = async (setSession: Dispatch<SetStateAction<SESSION | null>>, setPage: Dispatch<SetStateAction<DIR>>) => {
  chrome.runtime.sendMessage({ action: CHROME_ACTION.REQ_SESSION }, (session) => {
    if (session && session.sessionData) setSession(session.sessionData)
    if (!session || !session.sessionData) setPage(DIR.LOGIN)
  })
}

// Create new Tab
export const createTab = (url: string, setModal?: Dispatch<SetStateAction<boolean>>) => {
  chrome.runtime.sendMessage({ action: CHROME_ACTION.CREATE_TAB, url: url }, () => {})
  setModal && setModal(false)
}
