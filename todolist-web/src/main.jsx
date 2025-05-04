import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastContainer } from 'react-toastify'
import { ConfirmProvider } from './Context/ConfirmProvider'
import { ThemeProvider } from './Context/ThemeContext'
import { Provider } from 'react-redux'
import { store } from '~/redux/store'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename='/'>
      <Provider store={store}>
        <ThemeProvider>
          <ConfirmProvider>
            <App />
            <ToastContainer position="top-center" theme="light" newestOnTop closeOnClick/>
          </ConfirmProvider>
        </ThemeProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
)
