import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import rtlPlugin from 'stylis-plugin-rtl'
import { prefixer } from 'stylis'
import App from './ui/App'

// Create RTL cache for MUI + Emotion
const rtlCache = createCache({ key: 'muirtl', stylisPlugins: [prefixer, rtlPlugin] })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CacheProvider value={rtlCache}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CacheProvider>
  </React.StrictMode>
)