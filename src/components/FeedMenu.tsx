'use client'

interface FeedMenuProps {
    activeTab: string
    onTabChange: (tab: string) => void
}

export default function FeedMenu({ activeTab, onTabChange }: FeedMenuProps) {
    const tabs = ['Publicaciones', 'Gustados', 'Guardados', 'Comentados', 'Mis publicaciones']

    return (
        <div className="flex flex-col justify-center items-center text-white gap-3 w-full pt-4">
            {tabs.map(tab => (
                <button
                    key={tab}
                    onClick={() => onTabChange(tab)}
                    className={`w-full px-4 py-2 transition-colors duration-200 ${activeTab === tab ? 'text-[#1F7D53] bg-[#1F7D53]/20 rounded-full' : 'text-gray-400 hover:text-[#1F7D53] hover:bg-[#1F7D53]/10 rounded-full'}`}
                >
                    {tab}
                </button>
            ))}
        </div>
    )
}