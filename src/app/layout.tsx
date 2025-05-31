import { ReactNode } from "react";
import './globals.css'

export const metadata = {
  title: 'Fitlink',
  description: 'Tu app de fitness',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-black text-white">
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}