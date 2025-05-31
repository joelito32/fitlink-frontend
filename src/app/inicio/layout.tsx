// app/inicio/layout.tsx

import { ReactNode } from 'react'
import Header from '@/components/Header'

export const metadata = {
  title: 'FitLink · Inicio',
}

export default function InicioLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="pt-16">
        {children}
      </div>
    </div>
  )
}
