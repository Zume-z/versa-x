import React, { useEffect } from 'react'
import * as Progress from '@radix-ui/react-progress'
import { SubscriptionData } from '@/utils/functions/subscription'
import { round2Dec } from '@/utils/functions/convert'

interface UsageProps {
  subData?: SubscriptionData | null
}

export default function Usage({ subData }: UsageProps) {
  const [progress, setProgress] = React.useState(0)

  const calcProgress = () => {
    if (subData?.id == 'PREMIER') return setProgress(0)
    const total = subData?.tokenTotal
    const used = subData?.tokenBalance

    if (!total || used == null) return
    if (used > total) return setProgress(100)
    const percent = (used / total) * 100
    setProgress(percent)
  }

  useEffect(() => {
    const timer = setTimeout(() => calcProgress(), 300)
    return () => clearTimeout(timer)
  }, [subData?.tokenBalance])

  return (
    <div id={'usage'} className={`flex h-[600px]  w-full flex-col px-2 py-4 text-white sm:p-10 `}>
      <div>
        <div>
          <div className="text-2xl">Usage </div>
          <div className="text-sm">Usage this period.</div>
        </div>
        <div className={`mt-6 rounded border border-gray-500 p-4 ${subData?.status == 'past_due' ? 'pointer-events-none opacity-50' : ''}`}>
          <div>
            <div>
              {subData?.currentPeriodStart} - {subData?.currentPeriodEnd}
            </div>
            <div className="space-y-1 p-2 text-sm text-gray-400">
              <div>• Tokens Used: {subData?.tokenBalance} </div>
              {subData?.id != 'PREMIER' && <div>• Total Tokens: {subData?.tokenTotal} </div>}
              {subData?.id == 'PREMIER' && <div>• Unlimited Tokens </div>}
            </div>
          </div>

          <div className="my-4 flex items-center space-x-5">
            <Progress.Root className=" relative -z-10 h-[20px] w-full overflow-hidden rounded border border-gray-800 bg-gray-800" style={{ transform: 'translateZ(0)' }} value={progress}>
              <Progress.Indicator className="ease-[cubic-bezier(0.65, 0, 0.35, 1)] h-full w-full rounded bg-green-500 transition-transform duration-[660ms]" style={{ transform: `translateX(-${100 - progress}%)` }} />
            </Progress.Root>
            <div>{round2Dec(progress)}%</div>
          </div>
        </div>
      </div>
    </div>
  )
}
