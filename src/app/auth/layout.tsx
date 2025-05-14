// app/auth/layout.tsx
import { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex items-center justify-center h-screen bg-[#1F7D53]">
            {children}
        </div>
    )
}