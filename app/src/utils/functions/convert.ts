import { Session } from 'next-auth'

// CONVERT TIMESTAMP TO DATE
export const convTimeStamp = (type: 'MONTH' | 'YEAR' | 'DATE', time?: number | null) => {
  if (!time) return
  const date = new Date(time * 1000)
  if (type === 'MONTH') return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
  if (type === 'YEAR') return date.toLocaleDateString('en-US', { year: 'numeric' })
  if (type === 'DATE') return date.toLocaleDateString('en-US')
}

// CONVERT DATE TO TYPE
export const convDate = (type: 'MONTH' | 'YEAR' | 'DATE', date?: Date) => {
  if (!date) return
  if (type === 'MONTH') return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
  if (type === 'YEAR') return date.toLocaleDateString('en-US', { year: 'numeric' })
  if (type === 'DATE') return date.toLocaleDateString('en-US')
}

// GET TRIAL END DATE
export const trialEndDate = (type: 'MONTH' | 'YEAR' | 'DATE', trialStartedAt?: Date) => {
  if (!trialStartedAt) return
  const trialEnd = new Date(trialStartedAt)
  trialEnd.setDate(trialEnd.getDate() + 7)
  if (type === 'MONTH') return trialEnd.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
  if (type === 'YEAR') return trialEnd.toLocaleDateString('en-US', { year: 'numeric' })
  if (type === 'DATE') return trialEnd.toLocaleDateString('en-US')
}

// CONVERT USERNAME
export const getUserName = (session: Session | null) => {
  if (session?.user?.name) {
    return session.user.name
  } else if (session?.user?.email) {
    return session.user.email?.split('@')[0]?.replaceAll('.', ' ')
  } else {
    return 'User'
  }
}

// FORMAT TOKENS
export const formatTokens = (tokens?: number) => {
  if (!tokens) return

  return tokens / 1000 + 'K'
}

// ROUND TWO DECIMALS
export const round2Dec = (num: number) => {
  return Math.round((num + Number.EPSILON) * 100) / 100
}
