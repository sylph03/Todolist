import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div
      className="h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center text-center relative bg-[url('/src/assets/404/bg-404.gif')]"
    >
      <div className="relative z-10 px-4 sm:px-6 md:px-8 max-w-2xl mx-auto">
        <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold tracking-widest animate-bounce drop-shadow-lg">404</h1>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2 sm:mt-4 drop-shadow-lg">
          Không tìm thấy trang
        </h2>
        <p className="text-white mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed drop-shadow-lg max-w-md mx-auto">
          Rất tiếc, chúng tôi không tìm thấy trang bạn đang tìm kiếm.
          <br className="hidden sm:block" />
          Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chủ.
        </p>
        <Link
          to="/"
          className="group mt-4 sm:mt-6 inline-flex items-center gap-2 text-white text-sm sm:text-base font-semibold transition-all duration-300 hover:gap-3"
        >
          <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
          <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-white after:transition-all after:duration-300 group-hover:after:w-full">
            Quay lại trang chủ
          </span>
        </Link>
      </div>
    </div>
  )
}

export default NotFound
