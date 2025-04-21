import { createContext, useContext, useState, useCallback } from 'react'
import ConfirmDialog from '~/components/UI/ConfirmDialog'

const ConfirmContext = createContext()

export const ConfirmProvider = ({ children }) => {
  const [stateConfirm, setStateConfirm] = useState({
    isOpen: false,
    title: '',
    message: '',
    modal: true,
    resolve: null
  })

  const confirm = useCallback(({ title, message, modal = true }) => {
    return new Promise((resolve) => {
      setStateConfirm({ isOpen: true, title, message, modal, resolve })
    })
  }, [])

  const handleConfirm = () => {
    stateConfirm.resolve(true)
    setStateConfirm(prev => ({ ...prev, isOpen: false }))
  }

  const handleCancel = () => {
    stateConfirm.resolve(false)
    setStateConfirm(prev => ({ ...prev, isOpen: false }))
  }

  return (
    <ConfirmContext.Provider value={{ confirm, stateConfirm }}>
      {children}
      {stateConfirm.isOpen && (
        <ConfirmDialog
          title={stateConfirm.title}
          message={stateConfirm.message}
          handleConfirm={handleConfirm}
          handleCancel={handleCancel}
          modal={stateConfirm.modal}
        />
      )}
    </ConfirmContext.Provider>
  )
}

export const useConfirm = () => useContext(ConfirmContext)
