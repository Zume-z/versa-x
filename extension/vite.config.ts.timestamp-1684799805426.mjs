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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYnJlbmRhbi9EZXNrdG9wL2NvbXAtZXh0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvYnJlbmRhbi9EZXNrdG9wL2NvbXAtZXh0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9icmVuZGFuL0Rlc2t0b3AvY29tcC1leHQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IHN2Z3IgZnJvbSBcInZpdGUtcGx1Z2luLXN2Z3JcIjtcbmltcG9ydCB7IGNyeCB9IGZyb20gXCJAY3J4anMvdml0ZS1wbHVnaW5cIjtcbmltcG9ydCBtYW5pZmVzdCBmcm9tIFwiLi9tYW5pZmVzdC5qc29uXCI7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICBzdmdyKHtcbiAgICAgIHN2Z3JPcHRpb25zOiB7XG4gICAgICAgIGljb246IHRydWUsXG4gICAgICAgIC8vIC4uLnN2Z3Igb3B0aW9ucyAoaHR0cHM6Ly9yZWFjdC1zdmdyLmNvbS9kb2NzL29wdGlvbnMvKVxuICAgICAgfSxcbiAgICB9KSxcbiAgICAvLyBCdWlsZCBDaHJvbWUgRXh0ZW5zaW9uXG4gICAgY3J4KHsgbWFuaWZlc3QgfSksXG4gIF0sXG4gIGJ1aWxkOiB7XG4gICAgb3V0RGlyOiBcImV4dGVuc2lvblwiLFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQStRLFNBQVMsb0JBQW9CO0FBQzVTLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsU0FBUyxXQUFXOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSXBCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLEtBQUs7QUFBQSxNQUNILGFBQWE7QUFBQSxRQUNYLE1BQU07QUFBQSxNQUVSO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFFRCxJQUFJLEVBQUUsMkJBQVMsQ0FBQztBQUFBLEVBQ2xCO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsRUFDVjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
