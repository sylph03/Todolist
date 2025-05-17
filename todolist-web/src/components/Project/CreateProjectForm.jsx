import React from 'react'
import { X } from 'lucide-react'
import { toast } from 'react-toastify'
import { createNewBoardAPI } from '~/apis'
import { useForm } from 'react-hook-form'
import FieldErrorAlert from '~/components/UI/FieldErrorAlert'

const CreateProjectForm = ({ formCreateProjectRef, setShowInput, formPosition, affterCreatedNewBoard }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const submitCreateProject = async (data) => {
    const response = await createNewBoardAPI(data)
    setShowInput(false)
    reset() // Reset form sau khi tạo thành công
    
    // Gọi callback với board mới tạo
    if (affterCreatedNewBoard) {
      affterCreatedNewBoard(response)
    }
  }

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

      <form onSubmit={handleSubmit(submitCreateProject)} className="space-y-4">
        <div>
          <label htmlFor="board-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" >
            Tên bảng <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Nhập tên bảng..."
            className={`w-full rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3.5 py-2 focus:outline-none transition-colors duration-200
              ${errors['title']
                ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-400 hover:border-red-500'
                : 'border-gray-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 hover:border-sky-500'
              }`}
            {...register('title', { required: '💡Tiêu đề bảng là bắt buộc' })}
          />
          <FieldErrorAlert errors={errors} fieldName={'title'} />
        </div>

        <div>
          <label htmlFor="board-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" >
            Mô tả
          </label>
          <textarea
            placeholder="Thêm mô tả cho bảng..."
            rows="3"
            className="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3.5 py-2 hover:border-sky-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:focus:ring-sky-400 transition-colors duration-200 resize-none"
            {...register('description')}
          />
        </div>

        <button
          type="submit"
          className="interceptor-loading w-full bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-lg px-4 py-2.5 shadow-md hover:shadow-lg active:shadow-sm transition-all duration-200" >
          Tạo bảng
        </button>
      </form>
    </div>
  )
}

export default CreateProjectForm