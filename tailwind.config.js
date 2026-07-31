/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Basis warna premium Neo Mirai dari image_d6513f.png
        'mirai-dark': '#0b0b0b',      // Background luar matte charcoal
        'mirai-panel': '#121212',     // Background bento panel yang sedikit kontras
        'mirai-text': '#e2e2e2',      // Teks body soft white
        'mirai-muted': '#666666',     // Teks keterangan / kode sekunder
        'mirai-gold': '#f0a929',      // AKASEN UTAMA: Solar gold khas Impeccable
      },
      fontFamily: {
        // Kontras ekstrem: Heading pake Plus Jakarta Sans (Black), Body pake Inter (Thin)
        'display': ['"Plus Jakarta Sans"', 'sans-serif'],
        'body': ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        'solar-subtle': '0 0 30px rgba(240, 169, 41, 0.03)',
      }
    },
  },
  plugins: [],
}