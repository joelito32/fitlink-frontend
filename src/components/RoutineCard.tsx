// components/RoutineCard.tsx
'use client'

import Link from 'next/link'
import { FaLock, FaLockOpen } from 'react-icons/fa'

interface RoutineCardProps {
    id: number
    title: string
    description: string
    isPublic: boolean
    updatedAt: string
    exerciseImages?: string[]
}

export default function RoutineCard({
    id,
    title,
    description,
    isPublic,
    updatedAt,
    exerciseImages = []
}: RoutineCardProps) {
    return (
        <Link href={`/rutinas/${id}`} className="block hover:shadow-lg transition-shadow">
            <div className="relative bg-gray-800 rounded-lg p-4">
                {/* Candado arriba a la derecha */}
                <div className="absolute top-3 right-3 text-white text-lg">
                    {isPublic ? <FaLockOpen /> : <FaLock />}
                </div>

                {/* Título y fecha */}
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold">{title}</h3>
                    <span className="text-xs text-gray-400">
                        {new Date(updatedAt).toLocaleDateString('es-ES')}
                    </span>
                </div>

                {/* Descripción */}
                <p className="text-sm text-gray-300 mb-4">{description}</p>

                {/* Ejercicios (máx 6 imágenes) */}
                <div className="grid grid-cols-6 gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="w-full aspect-square bg-gray-700 rounded overflow-hidden"
                        >
                            {exerciseImages[i] ? (
                                <img
                                    src={exerciseImages[i]}
                                    alt={`Ejercicio ${i + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>
        </Link>
    )
}
