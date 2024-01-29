import { api } from '@/utils/api/api'
import { GptModel } from '@prisma/client'
import * as Switch from '@radix-ui/react-switch'
import * as Select from '@radix-ui/react-select'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import { MouseEvent, useEffect, useState } from 'react'

export default function Settings({ settingsData }: { settingsData: any }) {
  const [settingGenPrompts, setSettingGenPrompts] = useState(false)
  const [settingsModel, setSettingsModel] = useState<GptModel | string>(GptModel.gpt35turbo)
  const [settingsChange, setSettingsChange] = useState(false)
  const { mutateAsync: updateSettings } = api.user.updateUserSettings.useMutation()

  useEffect(() => {
    if (settingsData) {
      setSettingGenPrompts(settingsData.genPrompts)
      setSettingsModel(settingsData.gptModel)
    }
  }, [settingsData])

  useEffect(() => {
    if (settingsModel != settingsData.gptModel || settingGenPrompts != settingsData.genPrompts) {
      setSettingsChange(true)
    } else {
      setSettingsChange(false)
    }
  }, [settingGenPrompts, settingsModel])

  const formatTitle = (str: string) => {
    switch (str) {
      case GptModel.gpt35turbo:
        return 'GPT-3.5 Turbo'
      case GptModel.gpt4:
        return 'GPT-4'
      default:
        return str
    }
  }

  const submitSettings = async (e: MouseEvent<HTMLButtonElement>, settingsModel: string, settingGenPrompts: boolean) => {
    await updateSettings({ gptModel: settingsModel as GptModel, genPrompts: settingGenPrompts })
    console.log('submitting settings', e)
  }

  return (
    <div id={'settings'} className="py-2">
      <div>Settings</div>
      <div className="my-2 h-[0.5px] w-full bg-gray-500/70" />
      <form className="space-y-4 p-4">
        {/* Generated Prompts */}
        <div className="w-full items-center justify-between sm:flex ">
          <div>
            <label className="pr-2 leading-none text-white">Generated Prompts</label>
            <div className="mt-1 text-sm text-gray-500">Select whether you would like helpful prompts generated on opening the app.</div>
          </div>
          <Switch.Root checked={settingGenPrompts} onCheckedChange={setSettingGenPrompts} className="relative mt-4 h-[22px] w-[38px]  flex-shrink-0 cursor-pointer rounded-full bg-gray-700  outline-none  data-[state=checked]:bg-blue-700" id="airplane-mode">
            <Switch.Thumb className="block h-[18px] w-[18px] translate-x-0.5 rounded-full bg-white transition-transform  duration-100 will-change-transform data-[state=checked]:translate-x-[18px] data-[state=check]:bg-gray-100" />
          </Switch.Root>
        </div>

        {/* Select Model */}
        <div className=" text-white">
          <div className="h-full w-full justify-between sm:flex">
            <div>
              <div>GPT Model</div>
              <div className="text-sm text-gray-500">Select the GPT model you would like to use. Gpt-4 access coming soon.</div>
            </div>
            <div className="pointer-events-none mt-4   opacity-50">
              <Select.Root value={''} onValueChange={setSettingsModel} disabled={true}>
                <Select.Trigger className={`transition-200 group inline-flex w-[150px] items-center justify-center gap-[5px] rounded border border-gray-500 bg-black px-2 py-2 text-base leading-none text-white outline-none hover:border-white`}>
                  <Select.Value>{formatTitle(settingsModel)}</Select.Value>
                  <Select.Icon>
                    <ChevronDownIcon />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Content id="Content" align="start" position="popper" sideOffset={5} className=" z-10 overflow-hidden rounded-md border border-gray-500 bg-black   ">
                  <Select.Viewport className=" w-[150px] bg-black  ">
                    <Select.Item value={GptModel.gpt35turbo} className="transition-200  p-2 text-base text-gray-500  hover:text-white focus:outline-none">
                      GPT-3.5 Turbo
                    </Select.Item>
                    <Select.Item value={GptModel.gpt4} className="transition-200 p-2 text-gray-500 hover:text-white  focus:outline-none">
                      GPT-4
                    </Select.Item>
                  </Select.Viewport>
                </Select.Content>
              </Select.Root>
            </div>
          </div>
        </div>

        {/* Save Settings */}
        <div className={`flex pt-5 sm:justify-end ${settingsChange ? '' : 'pointer-events-none opacity-50'}`}>
          <button onClick={(e) => submitSettings(e, settingsModel, settingGenPrompts)} className="transition-200 rounded  border border-gray-500 px-2 py-1 text-white hover:border-white">
            Save Settings
          </button>
        </div>
      </form>
    </div>
  )
}
