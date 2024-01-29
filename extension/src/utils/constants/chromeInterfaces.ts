import { GPT_MESSAGE } from './gptInterfaces'

export enum CHROME_ACTION {
  PIN_TAB = 'PIN_TAB',
  AUTH_CHECK = 'AUTH_CHECK',
  CREATE_TAB = 'CREATE_TAB',
  GPT_REQUEST = 'GPT_REQUEST',
  SCRAPE_PAGE = 'SCRAPE_PAGE',
  SCRAPE_CURRENT_TAB = 'SCRAPE_CURRENT_TAB',
  GET_FAVICON = 'GET_FAVICON',
  TOGGLE_MODAL = 'TOGGLE_MODAL',
  BOOKMARK_TAB = 'BOOKMARK_TAB',
  GET_CURRENT_TAB = 'GET_CURRENT_TAB',
  REQ_SESSION = 'REQ_SESSION',
  GET_CURRENT_TAB_AND_SCRAPE = 'GET_CURRENT_TAB_AND_SCRAPE',
}

export enum CHROME_PORT {
  GPT_REQUEST = 'GPT_REQUEST',
  SCRAPE_PAGE = 'SCRAPE_PAGE',
  ERROR = 'ERROR',
}

export interface GPT_PORT_REQUEST {
  port: CHROME_PORT
  messages: GPT_MESSAGE[]
  max_tokens?: number
  model?: string
}

export interface SCRAPE_PORT_REQUEST {
  port: CHROME_PORT
  url?: string
  textSize?: number
}

export interface GPT_PORT_RESPONSE {
  port: CHROME_PORT
  value: string
  done: boolean
}

export interface SCRAPE_PORT_RESPONSE {
  port: CHROME_PORT
  content: SCRAPE_PAGE_RES
}

export interface SCRAPE_PAGE_RES {
  title: string
  body: string
  url: string
}

export enum PORT_ERROR {
  NO_URL = 'NO_URL',
  PARSE_FAIL = 'PARSE_FAIL',
  GPT_FAIL = 'GPT_FAIL',
}
