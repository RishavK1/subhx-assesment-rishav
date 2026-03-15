import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#f4efe5',
        ink: '#172121',
        bronze: '#9f6f46',
        moss: '#3d5a40',
        blush: '#f7d9c4'
      },
      boxShadow: {
        panel: '0 24px 60px rgba(23, 33, 33, 0.12)'
      },
      fontFamily: {
        heading: ['var(--font-space-grotesk)'],
        body: ['var(--font-manrope)']
      }
    }
  },
  plugins: []
};

export default config;
