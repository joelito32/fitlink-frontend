'use client'

import { useState } from "react"

const items = [
    'Publicaciones',
    'Gustados',
    'Guardados',
    'Comentados',
    'Mis publicaciones'
]

export default function FeedMenu() {
    const [active, setActive] = useState(items[0])

    return (
        <nav className="space-y-4">
            {items.map(item => {
                const isActive = item === active
                return (
                    <button
                        key={item}
                        onClick={() => setActive(item)}
                        className={`
                            w-full text-left py-2 px-4 transition-colors duration-200
                            ${isActive
                                ? 'text-[#1F7D53] bg-[#~1F7D53]/20 rounded-full'
                                : 'text-gray-400 hover:text-[#1F7D53] hover:bg-[#1F7D53]/10 rounded-full'
                            }
                        `}
                    >
                        {item}
                    </button>
                )
            })}
        </nav>
    )
}