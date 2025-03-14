import AppBar from './components/AppBar/AppBar'
import SideBar from './components/SideBar/SideBar'
import { ThemeProvider } from './Context/ThemeContext'
import BoardContent from './pages/Boards/BoardContent/BoardContent'

function App() {

  return (
    <>
      <ThemeProvider>
        <div className="h-screen w-screen dark:bg-gray-800 text-white dark:text-gray-100 flex flex-col">
          {/* Thanh AppBar trên cùng */}
          <AppBar />

          {/* Container chứa Sidebar + Nội dung chính */}
          <div className="flex flex-1 h-full relative">
            {/* Sidebar bên trái */}
            <SideBar />

            {/* Nội dung chính bên phải */}
            <BoardContent/>
          </div>
        </div>
      </ThemeProvider>
    </>
  )
}

export default App
