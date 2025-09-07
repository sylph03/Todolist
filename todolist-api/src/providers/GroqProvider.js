import Groq from 'groq-sdk'
import { env } from '~/config/environment'

class GroqProvider {
  constructor() {
    this.groq = new Groq({
      apiKey: env.GROQ_API_KEY
    })
  }

  async generateTaskSuggestions(userInput, context = {}) {
    const {
      boardTitle = '',
      columnTitle = '',
      columns = [],
      wipLimit = 5,
      wipEnabled = false,
      existingTasks = []
    } = context
    try {
      const prompt = `
Bạn là AI assistant chuyên hỗ trợ quản lý công việc. 

HÃY TRẢ LỜI BẰNG TIẾNG VIỆT HOÀN TOÀN.

Dựa trên:
- Input từ user: "${userInput}"
- Board: "${boardTitle}"
- Column hiện tại: "${columnTitle}"
- Các Column đã có: ${columns.map(col =>
    `${col.title} (${col.cardCount}/${wipLimit}${wipEnabled && col.cardCount >= wipLimit ? ' - ĐẠT LIMIT' : ''})`
  ).join(', ')}
- Các task đã có: ${existingTasks.slice(0, 3).map(task => `"${task}"`).join(', ')}
- Chế độ WIP: ${wipEnabled ? 'BẬT' : 'TẮT'}
- Giới hạn WIP: ${wipLimit} task/cột

Hãy gợi ý:
1. 3 tiêu đề task hoàn chỉnh và cụ thể
2. 1 mô tả chi tiết cho task này (2-3 câu)
3. Chọn ra 1 column phù hợp nhất trong danh sách cột
4. Ước tính thời gian hoàn thành (theo giờ)

QUAN TRỌNG: 
- Trả lời HOÀN TOÀN bằng tiếng Việt
- Tiêu đề task phải rõ ràng, cụ thể
- Mô tả phải chi tiết và dễ hiểu
- Thời gian ước tính phải thực tế
- ${wipEnabled ? `Khi chọn column, ưu tiên column chưa đạt WIP limit (dưới ${wipLimit} task). Nếu tất cả column đều đạt limit, chọn column phù hợp nhất về logic nghiệp vụ.` : ''}

JSON format (giữ nguyên key, chỉ thay đổi value):
{
  "titleSuggestions": ["tiêu đề 1", "tiêu đề 2", "tiêu đề 3"],
  "descriptionSuggestion": "mô tả chi tiết bằng tiếng Việt...",
  "suggestedColumnTitle": "một trong các cột đã cho",
  "estimatedHours": 2
}
`

      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'Bạn là AI assistant chuyên hỗ trợ quản lý task và project. Luôn trả về valid JSON và trả lời HOÀN TOÀN bằng tiếng Việt.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'llama-3.1-8b-instant',
        temperature: 0.7,
        max_tokens: 500
      })

      const response = completion.choices[0].message.content

      try {
        const parsed = JSON.parse(response)
        return parsed
      } catch (parseError) {
        // Fallback: Extract JSON từ response text
        try {
          const jsonMatch = response.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const extractedJson = jsonMatch[0]
            return JSON.parse(extractedJson)
          }
        } catch (extractError) {
          // Fallback nếu không thể extract JSON
        }

        // Final fallback
        return {
          titleSuggestions: [
            `${userInput} - Nhiệm vụ 1`,
            `${userInput} - Nhiệm vụ 2`,
            `${userInput} - Nhiệm vụ 3`
          ],
          descriptionSuggestion: `Chi tiết công việc liên quan đến: ${userInput}`,
          suggestedColumnTitle: columns[0]?.title || columnTitle || 'Todo',
          estimatedHours: 2
        }
      }

    } catch (error) {
      // Fallback khi API error
      return {
        titleSuggestions: [
          `${userInput} - Nhiệm vụ 1`,
          `${userInput} - Nhiệm vụ 2`,
          `${userInput} - Nhiệm vụ 3`
        ],
        descriptionSuggestion: `Chi tiết công việc liên quan đến: ${userInput}`,
        suggestedColumnTitle: columns[0]?.title || columnTitle || 'Todo',
        estimatedHours: 2
      }
    }
  }
}

export const groqProvider = new GroqProvider()