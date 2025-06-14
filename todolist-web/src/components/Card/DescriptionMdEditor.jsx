import { useState } from 'react'
import MDEditor from '@uiw/react-md-editor'
import rehypeSanitize from 'rehype-sanitize'
import { useDarkMode } from '../../Context/ThemeContext'
import { Text } from 'lucide-react'

const DescriptionMdEditor = ({ cardDescriptionProp, handleUpdateCardDescription, isCreateCard }) => {
  // Lấy giá trị 'dark' hoặc 'light' từ context để hỗ trợ phần Markdown bên dưới: data-color-mode={mode}
  const { darkMode } = useDarkMode()

  // State xử lý chế độ Edit và chế độ View
  const [markdownEditMode, setMarkdownEditMode] = useState(false)

  // State xử lý giá trị markdown khi chỉnh sửa
  const [cardDescription, setCardDescription] = useState(cardDescriptionProp)

  const onMarkdownEditMode = () => {
    setMarkdownEditMode(true)
    if (!isCreateCard) {
      setCardDescription(cardDescriptionProp)
    }
  }

  const updateCardDescription = () => {
    setMarkdownEditMode(false)
    handleUpdateCardDescription(cardDescription)
  }

  const handleCancel = () => {
    setMarkdownEditMode(false)
    setCardDescription(cardDescriptionProp)
  }

  return (
    <div className={`${isCreateCard ? 'mb-0' : 'mb-6'}`}>
      {
        !isCreateCard &&
        <div className="flex items-center gap-2 mb-3">
          <Text className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <span className="font-semibold text-gray-900 dark:text-gray-100">Mô tả</span>
        </div>
      }
      {markdownEditMode ? (
        <div className="space-y-4 animate-fadeIn">
          <div
            data-color-mode={darkMode ? 'dark' : 'light'}
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <MDEditor
              value={cardDescription}
              onChange={setCardDescription}
              previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
              height={isCreateCard ? 135 : 200}
              preview="edit"
            />
          </div>

          <div className="flex gap-3 mt-3">
            <button
              onClick={updateCardDescription}
              className="px-4 py-2 bg-sky-600 text-white rounded-md font-medium hover:bg-sky-700 transition-colors duration-200"
            >
              Lưu
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-md font-medium hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600 transition-colors duration-200"
            >
                Hủy
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {
            !cardDescription ?
              <button
                onClick={onMarkdownEditMode}
                className={`w-full text-left border border-gray-200 dark:border-gray-700 dark:text-gray-400 bg-gray-50 text-gray-600 hover:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 ${
                  isCreateCard ? 'px-3 pt-3 pb-25 bg-white dark:bg-gray-900 rounded-xl' : 'rounded-lg pt-4 pb-12 px-4 dark:bg-gray-900'
                }`}
              >
                Thêm mô tả chi tiết ...
              </button>
              :
              <div
                onClick={onMarkdownEditMode}
                data-color-mode={darkMode ? 'dark' : 'light'}
                className={`rounded-lg bg-white dark:bg-gray-800 border transition-all duration-200 cursor-text px-6.5 pb-3 pt-2 hover:border-sky-500 ${
                  isCreateCard ? 'border-gray-200 dark:border-gray-700' : 'border-transparent'
                }`}
              >
                <MDEditor.Markdown
                  source={cardDescription}
                  style={{
                    whiteSpace: 'pre-wrap',
                    backgroundColor: darkMode ? '#1E2939' : '#fff',
                    color: darkMode ? '#F3F4F6' : '#000'
                  }}
                />
              </div>
          }
        </div>
      )}
    </div>
  )
}

export default DescriptionMdEditor