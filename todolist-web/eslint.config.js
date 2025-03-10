import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020, // Sử dụng ECMAScript 2020 (ES11)
      globals: globals.browser, // Định nghĩa các biến toàn cục có sẵn trong môi trường browser
      parserOptions: {
        ecmaVersion: 'latest', // Sử dụng phiên bản ECMAScript mới nhất
        ecmaFeatures: { jsx: true }, // Bật tính năng JSX cho React
        sourceType: 'module' // Sử dụng modules (import/export) thay vì script thông thường
      }
    },
    plugins: {
      'react-hooks': reactHooks, // Plugin kiểm tra các quy tắc sử dụng React hooks
      'react-refresh': reactRefresh // Plugin hỗ trợ React Fast Refresh (reload khi thay đổi code)
    },
    rules: {
      ...js.configs.recommended.rules, // Áp dụng các quy tắc mặc định từ ESLint cho JavaScript
      ...reactHooks.configs.recommended.rules, // Áp dụng các quy tắc mặc định từ plugin react-hooks

      // Quy tắc cụ thể cho React
      'react-refresh/only-export-components': [
        'warn', // Cảnh báo nếu bạn không xuất các component React đúng cách
        { allowConstantExport: true } // Cho phép xuất các component là hằng số mà không bị cảnh báo
      ],
      'react-hooks/rules-of-hooks': 'error', // Kiểm tra quy tắc về việc sử dụng hooks trong React
      'react-hooks/exhaustive-deps': 'warn', // Cảnh báo nếu thiếu dependency trong useEffect hoặc các hooks khác
      'react/prop-types': 0, // Tắt kiểm tra prop-types (nếu không cần sử dụng)
      'react/display-name': 0, // Tắt cảnh báo về việc thiếu displayName trong component (không bắt buộc)

      // Các quy tắc JavaScript
      'no-console': 1, // Cảnh báo khi sử dụng console.log (nên tránh sử dụng trong mã sản xuất)
      'no-lonely-if': 1, // Cảnh báo khi có if đơn lẻ (nên sử dụng cú pháp hợp lý hơn)
      'no-trailing-spaces': 1, // Cảnh báo nếu có khoảng trắng thừa ở cuối dòng
      'no-multi-spaces': 1, // Cảnh báo nếu có nhiều khoảng trắng giữa các từ
      'no-multiple-empty-lines': 1, // Cảnh báo nếu có nhiều dòng trống liên tiếp
      'space-before-blocks': ['error', 'always'], // Yêu cầu có khoảng trắng trước mỗi khối lệnh (ví dụ: `if {`)
      'object-curly-spacing': [1, 'always'], // Cảnh báo nếu không có khoảng trắng trong các dấu ngoặc của đối tượng (ví dụ: `{ key: value }`)
      'indent': ['warn', 2], // Cảnh báo nếu không sử dụng thụt lề 2 khoảng trắng
      'semi': [1, 'never'], // Cảnh báo nếu có dấu chấm phẩy ở cuối dòng (không nên sử dụng)
      'quotes': ['error', 'single'], // Lỗi nếu không sử dụng dấu nháy đơn cho chuỗi (nên sử dụng dấu nháy đơn)
      'array-bracket-spacing': 1, // Cảnh báo nếu không có khoảng trắng trong dấu ngoặc của mảng (ví dụ: `[1, 2]`)
      'linebreak-style': 0, // Tắt kiểm tra kiểu dòng (Windows hoặc UNIX) (không bắt buộc)
      'no-unexpected-multiline': 'warn', // Cảnh báo khi có lỗi cú pháp liên quan đến các dòng mã không mong đợi (ví dụ: dấu ngoặc bị sai)
      'keyword-spacing': 1, // Cảnh báo nếu không có khoảng trắng trước và sau các từ khóa (ví dụ: `if(condition)`)
      'comma-dangle': 1, // Cảnh báo nếu thiếu dấu phẩy sau phần tử cuối cùng trong mảng hoặc đối tượng
      'comma-spacing': 1, // Cảnh báo nếu không có khoảng trắng sau dấu phẩy trong các đối tượng hoặc mảng
      'arrow-spacing': 1 // Cảnh báo nếu không có khoảng trắng sau dấu `=>` trong arrow functions
    }
  }
]

// import js from '@eslint/js'
// import globals from 'globals'
// import reactHooks from 'eslint-plugin-react-hooks'
// import reactRefresh from 'eslint-plugin-react-refresh'

// export default [
//   { ignores: ['dist'] },
//   {
//     files: ['**/*.{js,jsx}'],
//     languageOptions: {
//       ecmaVersion: 2020,
//       globals: globals.browser,
//       parserOptions: {
//         ecmaVersion: 'latest',
//         ecmaFeatures: { jsx: true },
//         sourceType: 'module'
//       }
//     },
//     plugins: {
//       'react-hooks': reactHooks,
//       'react-refresh': reactRefresh
//     },
//     rules: {
//       ...js.configs.recommended.rules,
//       ...reactHooks.configs.recommended.rules,
//       'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
//       'react-refresh/only-export-components': [
//         'warn',
//         { allowConstantExport: true }
//       ],
//       'react-hooks/rules-of-hooks': 'error',
//       'react-hooks/exhaustive-deps': 'warn',
//       'react/prop-types': 0,
//       'react/display-name': 0,

//       // Các quy tắc JavaScript
//       'no-console': 1,
//       'no-lonely-if': 1,
//       // 'no-unused-vars': 1,
//       'no-trailing-spaces': 1,
//       'no-multi-spaces': 1,
//       'no-multiple-empty-lines': 1,
//       'space-before-blocks': ['error', 'always'],
//       'object-curly-spacing': [1, 'always'],
//       'indent': ['warn', 2],
//       'semi': [1, 'never'],
//       'quotes': ['error', 'single'],
//       'array-bracket-spacing': 1,
//       'linebreak-style': 0,
//       'no-unexpected-multiline': 'warn',
//       'keyword-spacing': 1,
//       'comma-dangle': 1,
//       'comma-spacing': 1,
//       'arrow-spacing': 1
//     }
//   }
// ]
