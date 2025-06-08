// app/rutinas/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import SemanaRutinas from '@/components/SemanaRutinas'
import RoutineCard from '@/components/RoutineCard'
import RoutineMenu from '@/components/RoutineMenu'
import CrearRutina from '@/components/CrearRutina'

interface Routine {
    id: number
    title: string
    description: string
    isPublic: boolean
    createdAt: string
    updatedAt: string
}

export default function RutinasPage() {
    const [rutinas, setRutinas] = useState<Routine[]>([])
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('Mis rutinas')
    const [modoCreacion, setModoCreacion] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) return

        fetch(`${API_URL}/api/routines`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => res.ok ? res.json() : Promise.reject(res))
        .then(data => setRutinas(data))
        .catch(err => console.error("Error al cargar rutinas:", err))
    }, [API_URL])

    return (
        <div className="flex w-full min-h-screen bg-black text-white">
            {/* Barra lateral izquierda */}
            <div className="w-1/4 p-4 border-r border-gray-700">
                {/* contenido izquierda */}
            </div>

            {/* Barra central */}
            <div className="w-2/4 px-4">
                {modoCreacion ? (
                    <CrearRutina onClose={() => setModoCreacion(false)} />
                ) : (
                    <>
                        <SemanaRutinas />
                        <div className="flex justify-center mb-4 mt-4">
                            <button
                                onClick={() => setModoCreacion(true)}
                                className="hover:bg-[#1F7D53] bg-[#27391C] text-white font-semibold py-2 px-4 rounded"
                            >
                                Crear nueva rutina
                            </button>
                        </div>
                        <RoutineMenu activeTab={activeTab} onTabChange={setActiveTab}/>


                        <div className="mt-6 space-y-4">
                            {rutinas.map(rutina => (
                                <RoutineCard
                                    key={rutina.id}
                                    id={rutina.id}
                                    title={rutina.title}
                                    description={rutina.description}
                                    isPublic={rutina.isPublic}
                                    updatedAt={rutina.updatedAt || rutina.createdAt}
                                    exerciseImages={[
                                        'https://via.placeholder.com/100',
                                        'https://via.placeholder.com/100',
                                        'https://via.placeholder.com/100',
                                        'https://via.placeholder.com/100',
                                        'https://via.placeholder.com/100',
                                        'https://via.placeholder.com/100'
                                    ]}
                                />
                            ))}
                        </div>
                    </>
                )}
                
            </div>

            {/* Barra lateral derecha */}
            <div className="w-1/4 p-4 border-l border-gray-700">
                {/* contenido derecha */}
            </div>
        </div>
    )
}
