import App from './App'
import React from 'react'
import './assets/styles/global.css'
import config from '../twind.config'
import 'construct-style-sheets-polyfill'
import { createRoot } from 'react-dom/client'
import { twind, cssom, observe } from '@twind/core'

// Inject content script
const body = document.querySelector('body')
const app = document.createElement('div')
app.id = 'versaX_extension'
app.style.fontFamily = 'sans-serif'
app.style.lineHeight = '20px'
app.style.zIndex = '999999999990'

// Create separate CSSStyleSheet
const sheet = cssom(new CSSStyleSheet())
const tw = twind(config, sheet)

// Create shadow dom root with adopted styles
const shadowRoot = app.attachShadow({ mode: 'open' })
shadowRoot.adoptedStyleSheets = [sheet.target]
observe(tw, shadowRoot)

// Create root component
const comp_ext = createRoot(shadowRoot)

// Append to body
if (body) body.append(app)

comp_ext.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
