// app/auth/layout.tsx
import { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-[#1F7D53]">
            <div className='w-4/5 h-4/5'>
                {children}
            </div>
        </div>
    )
}