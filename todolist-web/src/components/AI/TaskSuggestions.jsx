import React, { useState } from 'react'
import { Sparkles, Loader2, RefreshCw } from 'lucide-react'
import { generateTaskSuggestionsAPI } from '~/apis'
import { toast } from 'react-toastify'

const TaskSuggestions = ({ userInput, onSelectSuggestion, board, defaultColumn, columnTitle, isVisible }) => {
  const [suggestions, setSuggestions] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    if (!userInput || userInput.trim().length < 1) {
      toast.warning('Nhập ký tự vào "Tên nhiệm vụ" để AI gợi ý')
      return
    }

    setLoading(true)
    try {
      const context = {
        boardTitle: board?.title || '',
        columnTitle: columnTitle || defaultColumn?.title || '',
        columns: board?.columns?.map(c => ({
          title: c.title,
          cardCount: c.cards?.filter(card => !card.FE_PlaceholderCard).length || 0
        })) || [],
        wipLimit: board?.wipLimit || 5,
        wipEnabled: board?.wipEnabled || false,
        existingTasks: board?.columns?.flatMap(c => c.cards || [])?.map(c => c.title)?.slice(0, 5) || []
      }

      const res = await generateTaskSuggestionsAPI(userInput, context)
      const suggestionsData = res.data?.data || res.data || res
      setSuggestions(suggestionsData)
    } catch {
      toast.error('Không thể tạo gợi ý AI. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  if (!isVisible) return null

  return (
    <div className="mt-3 p-4 bg-gradient-to-r from-sky-50 to-purple-50 dark:from-gray-900/50 dark:to-gray-800/50 rounded-lg border border-sky-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-sky-500 dark:text-sky-400" />
          <span className="font-medium text-gray-700 dark:text-gray-100">Gợi ý tạo nhiệm vụ AI</span>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 bg-sky-500 hover:bg-sky-600 dark:bg-sky-500 dark:hover:bg-sky-600 text-white text-sm rounded-md transition-colors disabled:opacity-50 shadow-sm"
          title="Tạo gợi ý AI cho task này"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          <span className="hidden sm:inline">{loading ? 'Đang tạo...' : 'Tạo gợi ý'}</span>
        </button>
      </div>

      {suggestions ? (
        <div className="space-y-3 animate-fadeIn">
          {suggestions.titleSuggestions?.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                🎯 Gợi ý tiêu đề ({suggestions.titleSuggestions.length}):
              </h4>
              <div className="space-y-2">
                {suggestions.titleSuggestions.map((title, i) => (
                  <button
                    key={i}
                    onClick={() => onSelectSuggestion({
                      title,
                      description: suggestions.descriptionSuggestion,
                      suggestedColumnTitle: suggestions.suggestedColumnTitle
                    })}
                    className="w-full text-left p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-sky-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium text-gray-800 dark:text-gray-100"
                  >
                    {title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {suggestions.descriptionSuggestion && (
            <div>
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">📝 Gợi ý mô tả:</h4>
              <div className="p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                {suggestions.descriptionSuggestion}
              </div>
            </div>
          )}

          {suggestions.suggestedColumnTitle && (
            <div>
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">🔍 Gợi ý cột:
                <span className="font-medium"> {suggestions.suggestedColumnTitle}</span>
              </h4>
            </div>
          )}

          {suggestions.estimatedHours && (
            <div className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-600">
              ⏱️ Ước tính thời gian: <strong>{suggestions.estimatedHours} giờ</strong>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            ✨ Nhập câu hỏi vào "Tên nhiệm vụ" và nhấn "Tạo gợi ý" để AI hỗ trợ bạn
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            AI sẽ gợi ý tiêu đề, mô tả, trạng thái cột phù hợp và ước tính thời gian hoàn thành
          </p>
        </div>
      )}
    </div>
  )
}

export default TaskSuggestions