import React from 'react'
import { X } from 'lucide-react'
import { toast } from 'react-toastify'

const CreateProjectForm = ({ formCreateProjectRef, setShowInput, formPosition }) => {

  return (
    <div
      ref={formCreateProjectRef}
      className="z-50 fixed w-80 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700"
      style={{ top: formPosition?.top, left: formPosition?.left }} >
      <div className="text-gray-900 dark:text-gray-100 font-semibold text-lg text-center mb-5 relative">
        Tạo bảng
        <X className="absolute top-1/2 right-0 -translate-y-1/2 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors" size={26} onClick={() => setShowInput(false)} />
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="board-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" >
            Tên bảng <span className="text-red-500">*</span>
          </label>
          <input id="board-name" type="text" placeholder="Nhập tên bảng..." className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 transition" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1.5">
            👋 Tiêu đề bảng là bắt buộc
          </p>
        </div>

        <div>
          <label htmlFor="board-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" >
            Mô tả
          </label>
          <input id="board-description" type="text" placeholder="Thêm mô tả cho bảng..." className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 transition" />
        </div>

        <button
          onClick={() => { toast.error('Vui lòng nhập tên bảng')}}
          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-lg px-4 py-2 shadow-md transition-all duration-300 dark:bg-sky-600 dark:hover:bg-sky-500" >
          Tạo bảng
        </button>
      </div>
    </div>
  )
}

export default CreateProjectForm