import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastContainer } from 'react-toastify'
import { ConfirmProvider } from './Context/ConfirmProvider'
import { ThemeProvider } from './Context/ThemeContext'
import { Provider } from 'react-redux'
import { store } from '~/redux/store'
import { BrowserRouter } from 'react-router-dom'
import persistStore from 'redux-persist/es/persistStore'
import { PersistGate } from 'redux-persist/integration/react'

const persistor = persistStore(store)

// Kĩ thuật Inject Store: kĩ thuật khi cần sử dụng biến redux store ở các file ngoài phạm vi component
import { injectStore } from './utils/authorizeAxios'
injectStore(store)

createRoot(document.getElementById('root')).render(
  <BrowserRouter basename='/'>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ThemeProvider>
          <ConfirmProvider>
            <App />
            <ToastContainer position="top-center" theme="light" newestOnTop closeOnClick/>
          </ConfirmProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </BrowserRouter>
)
