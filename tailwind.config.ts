import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2E7D5E',
        'primary-light': '#E8F5EE',
        accent: '#F4A261',
        soft: '#F8F9FA',
      },
      borderRadius: { xl2: '1.25rem', xl3: '1.5rem' },
    },
  },
  plugins: [],
}
export default config
