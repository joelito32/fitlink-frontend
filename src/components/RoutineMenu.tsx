// components/RoutineMenu.tsx
'use client'

interface RoutineMenuProps {
    activeTab: string
    onTabChange: (tab: string) => void
}

export default function RoutineMenu({ activeTab, onTabChange }: RoutineMenuProps) {
    return (
        <div className="flex w-full border-b border-gray-700 mb-4 mt-3">
            <div className="w-1/2 flex justify-center">
                <button
                    onClick={() => onTabChange('Mis rutinas')}
                    className={`px-4 py-2 text-sm font-medium transition ${
                        activeTab === 'Mis rutinas'
                            ? 'text-[#1F7D53] border-b-2 border-[#1F7D53]'
                            : 'text-gray-400 hover:text-white'
                    }`}
                >
                    Mis rutinas
                </button>
            </div>
            <div className="w-1/2 flex justify-center">
                <button
                    onClick={() => onTabChange('Rutinas guardadas')}
                    className={`px-4 py-2 text-sm font-medium transition ${
                        activeTab === 'Rutinas guardadas'
                            ? 'text-[#1F7D53] border-b-2 border-[#1F7D53]'
                            : 'text-gray-400 hover:text-white'
                    }`}
                >
                    Rutinas guardadas
                </button>
            </div>
        </div>
    )
}
