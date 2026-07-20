/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: '#10151c', elevated: '#171f29', card: '#1c2531' },
        line: '#2a3441',
        accent: { blue: '#4fa3e3', blueDim: '#3a7bab', amber: '#f2a65a', amberSoft: '#f7c68b' },
        ink: { DEFAULT: '#ecedf1', slate: '#8492a6', slateDim: '#5b6b80' },
        state: { danger: '#e2665a', caution: '#e0b34f', success: '#6fbf8b' }
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['Newsreader', 'serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    },
  },
  plugins: [],
}
