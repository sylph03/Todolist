import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'

const Auth = () => {
  const location = useLocation()
  const Login = location.pathname === '/login'
  const register = location.pathname === '/register'

  const currentUser = useSelector(selectCurrentUser)
  if (currentUser) {
    return <Navigate to='/' replace={true} />
  }

  return (
    <div className='h-screen flex items-center justify-center bg-no-repeat bg-center bg-cover bg-[url(https://i.pinimg.com/originals/49/cd/d8/49cdd838e8c6d7fe5e2dd55deead5567.gif)]'>
      {/* <div className='min-h-screen flex items-center justify-center bg-no-repeat bg-center bg-cover bg-[url(https://i.pinimg.com/originals/0f/88/3e/0f883e6f5db348671c1e26a7dfd2e5f3.gif)]'> */}
      {Login && <LoginForm/>}
      {register && <RegisterForm/>}
    </div>
  )
}

export default Auth