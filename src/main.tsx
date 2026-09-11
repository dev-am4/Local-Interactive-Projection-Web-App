import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource/chakra-petch/400.css'
import '@fontsource/chakra-petch/500.css'
import '@fontsource/chakra-petch/600.css'
import '@fontsource/chakra-petch/700.css'
import App from './App'
import { installChromaKeyAssets } from './chroma-key-assets'
import './styles.css'
import './idle-home.css'
import './idle-center-fix.css'
import './career-alignment.css'
import './career-layout-v3.css'
import './netflix-font.css'

installChromaKeyAssets()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
