import { Preset, defineConfig } from '@twind/core'
import presetTailwind from '@twind/preset-tailwind'
import presetAutoprefix from '@twind/preset-autoprefix'
import { Rule } from 'postcss'

// function presetRemToPx({ baseValue = 16 } = {}): Preset {
//   return {
//     finalize(rule: Rule & { d: string }) {
//       return {
//         ...rule,
//         // d: the CSS declaration body
//         // Based on https://github.com/TheDutchCoder/postcss-rem-to-px/blob/main/index.js
//         d: rule.d
//           ? rule.d.replace(/"[^"]+"|'[^']+'|url\([^)]+\)|(-?\d*\.?\d+)rem/g, (match, p1) => {
//               if (p1 === undefined) return match
//               return `${p1 * baseValue}${p1 == 0 ? '' : 'px'}`
//             })
//           : '',
//       }
//     },
//   }
// }

// function presetRemToPx({ baseValue = 16 } = {}) {
// 	return {
// 		finalize(rule: Rule) {
// 			return {
// 				...rule,
// 				// d: the CSS declaration body
// 				// Based on https://github.com/TheDutchCoder/postcss-rem-to-px/blob/main/index.js
// 				d: rule.d.replace(/"[^"]+"|'[^']+'|url\([^)]+\)|(-?\d*\.?\d+)rem/g, (match, p1) => {
// 					if (p1 === undefined) return match
// 					return `${p1 * baseValue}${p1 == 0 ? '' : 'px'}`
// 				}),
// 			}
// 		}
// 	}
// }

export default defineConfig({
  finalize(rule) {
    return {
      ...rule,
      d: rule.d
        ? rule.d.replace(/"[^"]+"|'[^']+'|url\([^)]+\)|(-?\d*\.?\d+)rem/g, (match, p1) => {
            if (p1 === undefined) return match
            return `${p1 * 16}${p1 == 0 ? '' : 'px'}`
          })
        : '',
    }
  },
  presets: [presetAutoprefix(), presetTailwind(/* options */)],
  theme: {
    extend: {
      animation: {
        cursor: 'cursor 1s linear infinite',
      },
      colors: {
        'dark-void': '#131518',
      },
      keyframes: {
        cursor: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
      },
    },
  },
})
