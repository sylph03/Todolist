import React, { useState } from 'react'
import { Layout, Plus } from 'lucide-react'
import FormCreateColumn from './FormCreateColumn'

const EmptyColumn = () => {
  const [isShowFormCreateColumn, setIsShowFormCreateColumn] = useState(false)

  return (
    <>
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8 text-center mx-auto animate-fadeIn">
        <div className="w-20 h-20 mb-6 text-sky-500 dark:text-sky-400 animate-bounce">
          <Layout className="w-full h-full" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Chưa có cột nào
        </h3>
        <p className="text-gray-800 dark:text-gray-200 mb-8 max-w-md text-base">
          Bắt đầu tổ chức công việc của bạn bằng cách tạo các cột để phân loại và quản lý nhiệm vụ.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setIsShowFormCreateColumn(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>Tạo cột đầu tiên</span>
          </button>
        </div>
        <div className="mt-8 text-sm text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-sky-500"></div>
          <p>Bạn có thể kéo thả để sắp xếp các cột sau khi tạo</p>
        </div>
      </div>

      {/* Form tạo cột mới */}
      <FormCreateColumn
        isShowFormCreateColumn={isShowFormCreateColumn}
        setIsShowFormCreateColumn={setIsShowFormCreateColumn}
      />
    </>
  )
}

export default EmptyColumn
