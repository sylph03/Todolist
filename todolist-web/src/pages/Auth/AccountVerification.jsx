import React, { useEffect, useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { verifyUserAPI } from '~/apis'
import PageLoadingSpinner from '~/components/UI/Loading/PageLoadingSpinner'

const AccountVerification = () => {
  // Lấy giá trị email và token từ URL
  let [searchParams] = useSearchParams()
  // const email = searchParams.get('email')
  // const token = searchParams.get('token')
  const { email, token } = Object.fromEntries([...searchParams])

  // Tạo một state để được đã verify tài khoản thành công hay chưa
  const [verified, setVerified] = useState(false)

  // Gọi API để verify tài khoản
  useEffect(() => {
    if (email && token) {
      verifyUserAPI({ email, token }).then(() => setVerified(true))
    }
  }, [email, token])

  // Nếu URL có vấn đề, không tồn tài 1 trong 2 giá trị email hoặc token thì đá ra trang 404
  if (!email || !token) {
    return <Navigate to="/404" />
  }

  // Nếu chưa verify xong thì hiện loading
  if (!verified) {
    return <PageLoadingSpinner caption={'Xác minh tài khoản của bạn...'}/>
  }

  // Verify thành công và không gặp vấn đề gì thì đá sang trang login cùng giá trị verifiedEmail
  return <Navigate to={`/login?verifiedEmail=${email}`} />
}

export default AccountVerification