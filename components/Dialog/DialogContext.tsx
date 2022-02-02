import { createContext, ReactNode, useContext } from 'react'

type DialogContextType = {
  onRequestClose: () => void
  isShowing: boolean
}

const DialogContext = createContext({
  onRequestClose: () => {},
  isShowing: false,
})

export const useDialogContext = () => useContext(DialogContext)

export const DialogContextProvider = ({
  children,
  ...value
}: DialogContextType & { children: ReactNode }) => (
  <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
)
