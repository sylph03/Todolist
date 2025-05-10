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
        <X 
          className="absolute top-1/2 right-0 -translate-y-1/2 p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200" 
          size={28} 
          onClick={() => setShowInput(false)} 
        />
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="board-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" >
            Tên bảng <span className="text-red-500">*</span>
          </label>
          <input 
            id="board-name" 
            type="text" 
            placeholder="Nhập tên bảng..." 
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3.5 py-2 hover:border-sky-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:focus:ring-sky-400 transition-colors duration-200" 
          />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1.5 flex items-center gap-1.5">
            <span className="text-sky-500">💡</span> Tiêu đề bảng là bắt buộc
          </p>
        </div>

        <div>
          <label htmlFor="board-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" >
            Mô tả
          </label>
          <input 
            id="board-description" 
            type="text" 
            placeholder="Thêm mô tả cho bảng..." 
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3.5 py-2 hover:border-sky-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:focus:ring-sky-400 transition-colors duration-200" 
          />
        </div>

        <button
          onClick={() => { toast.error('Vui lòng nhập tên bảng')}}
          className="interceptor-loading w-full bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-lg px-4 py-2.5 shadow-md hover:shadow-lg active:shadow-sm transition-all duration-200" >
          Tạo bảng
        </button>
      </div>
    </div>
  )
}

export default CreateProjectForm