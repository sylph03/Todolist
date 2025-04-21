import { ConfirmProvider } from './Context/ConfirmProvider'
import { ThemeProvider } from './Context/ThemeContext'
import Board from './pages/Boards/_id'

function App() {

  return (
    <ThemeProvider>
      <ConfirmProvider>
        <Board/>
      </ConfirmProvider>
    </ThemeProvider>
  )
}

export default App
