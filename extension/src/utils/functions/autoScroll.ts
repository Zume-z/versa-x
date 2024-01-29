import { RefObject } from 'react'

export const autoScroll = (refContainer: RefObject<HTMLDivElement>) => {
  const scrollHeight = refContainer?.current?.scrollHeight
  if (!refContainer.current) return
  if (!scrollHeight) return

  refContainer.current?.scrollTo({ top: scrollHeight, behavior: 'smooth' })
}
