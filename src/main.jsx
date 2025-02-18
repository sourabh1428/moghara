import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import MyProvider from './Context/MyProvider.jsx'
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from "@vercel/analytics/react"

const theme = createTheme({
  palette: {
    primary: {
      main: '#dc004e',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <ThemeProvider theme={theme}>
      
    <MyProvider>
      <Analytics/>
    <SpeedInsights />
    <App />
  </MyProvider>
    </ThemeProvider>


    </BrowserRouter>
  </StrictMode>,
)
