import AppBar from './components/AppBar/AppBar'
import SideBar from './components/SideBar/SideBar'
import { ThemeProvider } from './Context/ThemeContext'

function App() {

  return (
    <>
      <ThemeProvider>
        <div className="h-screen dark:bg-gray-800 text-white dark:text-[#E0E0E0] flex flex-col">
          {/* Thanh AppBar trên cùng */}
          <AppBar />

          {/* Container chứa Sidebar + Nội dung chính */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar bên trái */}
            <SideBar />

            {/* Nội dung chính bên phải */}
            <div className="flex-1 h-screen p-4 text-amber-300 overflow-auto">
              Nội dung chính ở đây
              <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
              Nội dung chính ở đây
            </div>
          </div>
        </div>
      </ThemeProvider>
    </>
  )
}

export default App
