/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // The `dark` class is applied by ThemeContext to <html>
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // All resolved through CSS custom properties so they react to the theme
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-h)',
        },
        background: 'var(--color-bg)',
        secondary: 'var(--color-bg-sub)',
        card: 'var(--color-bg-card)',
        border: 'var(--color-border)',
        text: {
          DEFAULT: 'var(--color-text)',
          muted: 'var(--color-text-muted)',
        },
        sidebar: 'var(--color-sidebar)',
        header: 'var(--color-header)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
