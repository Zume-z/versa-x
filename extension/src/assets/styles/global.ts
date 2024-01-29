import { apply } from '@twind/core'

/* TRANSITIONS */
export const transition_200 = apply`transition duration-200 ease-out`
export const transition_500 = apply`transition duration-500 ease-in-out`

/* CDMK */
export const cdmk_group_header = apply`overflow-hidden text-ellipsis whitespace-nowrap px-4 pb-1 pt-3.5 text-base text-gray-400`
export const cdmk_item = apply`group-aria-selected group flex border-l border-transparent px-4 py-4 text-gray-100 aria-selected:border-gray-200 aria-selected:bg-gray-700/50`
export const cdmk_label = apply`flex items-baseline space-x-2 text-white`
export const cdmk_subLabel = apply`hidden text-gray-400 group-aria-selected:block`
export const cdmk_icon_wrapper = apply`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md`
export const cdmk_icon = apply`h-7 w-7 p-1`

/* ICONS */
export const icon_blue = apply`bg-gradient-to-br from-[#2f6eeb] to-blue-800`

/* BUTTONS */
export const error_button = apply`${transition_200} cursor-pointer border border-gray-500 px-2 py-1 text-gray-50 hover:border-white hover:text-white`
