import { ThemeProvider } from './Context/ThemeContext'
import Board from './pages/Boards/_id'

function App() {

  return (
    <ThemeProvider>
      <Board/>
    </ThemeProvider>
  )
}

export default App
