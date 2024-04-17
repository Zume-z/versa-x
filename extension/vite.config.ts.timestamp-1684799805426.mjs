// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { crx } from '@crxjs/vite-plugin'

// manifest.json
var manifest_default = {
  manifest_version: 3,
  name: 'React Content Script',
  version: '1.0.0',
  host_permissions: ['<all_urls>'],
  action: { default_title: 'React Content' },
  icons: {
    16: 'src/assets/img/logo192.png',
  },
  permissions: ['activeTab', 'history', 'scripting', 'tabs', 'storage', 'bookmarks', 'favicon', 'nativeMessaging', 'cookies', 'webRequest', 'declarativeNetRequestWithHostAccess', 'declarativeWebRequest', 'unlimitedStorage'],
  optional_permissions: ['unlimitedStorage'],
  content_scripts: [
    {
      matches: ['<all_urls>'],
      js: ['src/main.tsx'],
    },
  ],
  background: {
    service_worker: 'src/background/background.ts',
  },
}

// vite.config.ts
var vite_config_default = defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
      },
    }),
    crx({ manifest: manifest_default }),
  ],
  build: {
    outDir: 'extension',
  },
})
export { vite_config_default as default }
