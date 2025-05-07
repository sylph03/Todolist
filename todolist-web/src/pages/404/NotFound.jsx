import React from 'react'
import { ArrowLeft } from 'lucide-react'

const NotFound = () => {
  return (
    <div
      className="h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center text-center relative bg-[url(https://i.pinimg.com/originals/4d/0a/cb/4d0acb2f9981ff25b9e793b82f3e8f51.gif)]"
    >
      <div className="relative z-10 px-4">
        <h1 className="text-white text-sm uppercase tracking-widest">404</h1>
        <h2 className="text-5xl font-bold text-white mt-2">Không tìm thấy trang</h2>
        <p className="text-white mt-4 text-lg">
          Rất tiếc, chúng tôi không tìm thấy trang bạn đang tìm kiếm.
        </p>
        <a
          href="/"
          className="mt-6 inline-flex items-center gap-2 text-white font-semibold hover:underline"
        >
          <ArrowLeft className="size-4" />
          Quay lại trang chủ
        </a>
      </div>
    </div>
  )
}

export default NotFound
