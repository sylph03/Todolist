/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // ColorPicker colors với opacity /20 - dùng pattern để match động
    {
      pattern: /bg-(sky|blue|indigo|purple|pink|rose|red|orange|amber|yellow|lime|green|emerald|teal|cyan|slate)-200(\/20)?/,
    },
    // Dark mode variants
    {
      pattern: /dark:bg-(sky|blue|indigo|purple|pink|rose|red|orange|amber|yellow|lime|green|emerald|teal|cyan|slate)-200(\/20)?/,
    },
    // Hoặc liệt kê cụ thể nếu pattern không hoạt động
    'bg-sky-200/20',
    'bg-blue-200/20',
    'bg-indigo-200/20',
    'bg-purple-200/20',
    'bg-pink-200/20',
    'bg-rose-200/20',
    'bg-red-200/20',
    'bg-orange-200/20',
    'bg-amber-200/20',
    'bg-yellow-200/20',
    'bg-lime-200/20',
    'bg-green-200/20',
    'bg-emerald-200/20',
    'bg-teal-200/20',
    'bg-cyan-200/20',
    'bg-slate-200/20',
    // Dark mode variants cụ thể
    'dark:bg-sky-200/20',
    'dark:bg-blue-200/20',
    'dark:bg-indigo-200/20',
    'dark:bg-purple-200/20',
    'dark:bg-pink-200/20',
    'dark:bg-rose-200/20',
    'dark:bg-red-200/20',
    'dark:bg-orange-200/20',
    'dark:bg-amber-200/20',
    'dark:bg-yellow-200/20',
    'dark:bg-lime-200/20',
    'dark:bg-green-200/20',
    'dark:bg-emerald-200/20',
    'dark:bg-teal-200/20',
    'dark:bg-cyan-200/20',
    'dark:bg-slate-200/20',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

