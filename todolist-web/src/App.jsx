import NotFound from './pages/404/NotFound'
import Auth from './pages/Auth/Auth'
import Board from './pages/Boards/_id'
import { Routes, Route, Navigate } from 'react-router-dom'

function App() {

  return (
    <Routes>
      {/* Redirect Route */}
      <Route path='/' element={
        // Ở đây cần replace giá trị true để nó thay thế route /, có thể hiểu là route / sẽ không còn nằm trong history của Browser
        // Dễ hiểu bằng cách nhấn Home từ trang 404 xong quay lại bằng back của trình duyệt giữa 2 trường hợp có replace hoặc không có
        <Navigate to="/boards/67f923d9b0287286d736dbb7" replace={true} />
      } />

      {/* Board Details */}
      <Route path='/boards/:boardId' element={<Board/>} />

      {/* Authentication */}
      <Route path='/login' element={<Auth/>} />
      <Route path='/register' element={<Auth/>} />

      {/* 404 Not Found Page*/}
      <Route path='*' element={<NotFound/>} />
    </Routes>
  )
}

export default App
