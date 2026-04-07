import './globals.css'

export const metadata = {
  title: 'ZEEYA — Your AI Financial Brain',
  description: 'ZEEYA uses AI to understand your finances, predict spending, block fraud, and give you a daily budget that actually works.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
