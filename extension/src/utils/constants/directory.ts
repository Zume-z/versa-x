export enum DIR {
  LOGIN = 'LOGIN',
  INDEX = 'INDEX',
  RESPONSE = 'RESPONSE',
  ERROR = 'ERROR',
}

export enum CONTACT_URL {
  TWITTER = 'https://twitter.com/Brendan_Elton',
  CONT_EMAIL = 'mailto:versax.app@gmail.com?subject=Contact&body=Hi Brendan,',
  FEAT_EMAIL = 'mailto:versax.app@gmail.com?subject=Feature Request&body=Hi Brendan,',
  SUPPORT_EMAIL = 'mailto:versax.app@gmail.com?subject=Support&body=Versa Support,',
}

export enum VERSA_URL {
  HOME = 'https://www.versax.app',
  DASHBOARD = 'https://www.versax.app/dashboard',
  SIGNIN = 'https://www.versax.app/auth/signin',
  SINGUP = 'https://www.versax.app/auth/signup',
  SIGNOUT = 'https://www.versax.app/auth/signout',
  USAGE = 'https://www.versax.app/dashboard#usage',
  SUBSCRIBE = 'https://www.versax.app/subscribe',
}

export enum VERSA_API {
  AUTH_SESSION = 'https://www.versax.app/api/user/session',
  GENERATE_GPT_STREAM = 'https://www.versax.app/api/generate/gpt-stream',
}
