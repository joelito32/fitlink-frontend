// components/ProfileMenu.tsx
'use client'

type ProfileMenuProps = {
    activeTab: string
    onTabChange: (tab: string) => void
}

export default function ProfileMenu({ activeTab, onTabChange }: ProfileMenuProps) {
    const menuItems = ['Publicaciones', 'Rutinas']

    return (
        <nav className="flex space-x-4 justify-center mb-4">
            {menuItems.map(item => {
                const isActive = item === activeTab
                return (
                    <button
                        key={item}
                        onClick={() => onTabChange(item)}
                        className={`
                            px-4 py-2 transition-colors duration-200
                            ${isActive
                                ? 'text-[#1F7D53] bg-[#1F7D53]/20 rounded-full'
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
