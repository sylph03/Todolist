import { useSelector } from 'react-redux'
import NotFound from './pages/404/NotFound'
import AccountVerification from './pages/Auth/AccountVerification'
import Auth from './pages/Auth/Auth'
import Board from './pages/Boards/_id'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { selectCurrentUser } from './redux/user/userSlice'

// Chỉ định route cần đăng nhập
// <Outlet /> của react-router-dom để hiển thị các child route
const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to='/login' replace={true} />
  return <Outlet />
}

function App() {

  const currentUser = useSelector(selectCurrentUser)

  return (
    <Routes>
      {/* Redirect Route */}
      <Route path='/' element={
        // Ở đây cần replace giá trị true để nó thay thế route /, có thể hiểu là route / sẽ không còn nằm trong history của Browser
        // Dễ hiểu bằng cách nhấn Home từ trang 404 xong quay lại bằng back của trình duyệt giữa 2 trường hợp có replace hoặc không có
        <Navigate to="/boards/67f923d9b0287286d736dbb7" replace={true} />
      } />

      // ProtectedRoute (Những route chỉ truy cập sau khi đã login)
      <Route element={<ProtectedRoute user={currentUser}/>}>
        {/* <Outlet /> của react-router-dom sẽ chạy vào các child route trong này  */}

        {/* Board Details */}
        <Route path='/boards/:boardId' element={<Board/>} />
      </Route>

      {/* Authentication */}
      <Route path='/login' element={<Auth/>} />
      <Route path='/register' element={<Auth/>} />
      <Route path='/account/verification' element={<AccountVerification />} />

      {/* 404 Not Found Page*/}
      <Route path='*' element={<NotFound/>} />
    </Routes>
  )
}

export default App
