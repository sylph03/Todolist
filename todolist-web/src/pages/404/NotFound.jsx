import React from 'react'

const NotFound = () => {
  return (
    <div
      className="h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center text-center relative bg-[url(https://i.pinimg.com/originals/12/72/f7/1272f7e73de47c19e405c542fb9e4b69.gif)]"
    >
      <div className="relative z-10 px-4">
        <h1 className="text-white text-sm uppercase tracking-widest">404</h1>
        <h2 className="text-5xl font-bold text-white mt-2">Không tìm thấy trang</h2>
        <p className="text-white mt-4 text-lg">
          Rất tiếc, chúng tôi không tìm thấy trang bạn đang tìm kiếm.
        </p>
        <a
          href="/"
          className="mt-6 inline-block text-white font-semibold hover:underline"
        >
          ← Back to home
        </a>
      </div>
    </div>
  )
}

export default NotFound
