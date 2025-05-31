'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FaDumbbell } from "react-icons/fa"
import { FiList, FiInbox } from 'react-icons/fi'
import { RiHome2Line } from 'react-icons/ri'
import { LuTrophy } from 'react-icons/lu'
import { IoPersonOutline } from 'react-icons/io5'

const navItems = [
    { href: '/inicio/feed', Icon: RiHome2Line, label: 'Feed'},
    { href: '/inicio/rutinas', Icon: FiList, label: 'Rutinas'},
    { href: '/inicio/estadisticas', Icon: LuTrophy, label: 'Estadísticas'},
    { href: '/inicio/perfil', Icon: IoPersonOutline, label: 'Perfil'},
]

export default function Header() {
    const pathname = usePathname()
    return (
        <header className="fixed top-0 left-0 w-full h-16 bg-[#27391C] shadow-md flex items-center justify-between px-6 z-30 border-b-3 border-b-[#1F7D53]">
            {/* Izquierda */}
            <button className="text-white text-3xl">
                <FaDumbbell />
            </button>

            {/* Centro: menú de navegación */}
            <nav className="flex space-x-8">
                {navItems.map(({ href, Icon, label }) => {
                    const isActive = pathname === href
                    return (
                        <Link
                            key={href}
                            href={href}
                            aria-label={label}
                            className={`text-3xl p-2 rounded-full transition-colors duration-200 hover:bg-white/10 hover:text-[#1F7D53]
                                ${isActive
                                        ? 'text-[#1F7D53]'
                                        : 'text-white hover:text-[#1F7D53]'}
                            `}
                        >
                            <Icon 
                            />
                        </Link>
                    )
                })}
            </nav>

            {/* Derecha */}
            <button className="text-white text-3xl">
                <FiInbox />
            </button>
        </header>
    )
}
