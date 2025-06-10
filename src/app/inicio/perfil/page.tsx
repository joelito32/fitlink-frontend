'use client'

import ProfileMenu from "@/components/ProfileMenu"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FiSettings } from "react-icons/fi"
import RoutineCard from "@/components/RoutineCard"
import ConfirmarBorrar from "@/components/ConfirmarBorrar"
import EditarRutina from "@/components/EditarRutina"

interface UserProfile {
    id: number
    username: string
    name: string
    birthdate: string
    bio?: string
    email?: string
    profilePic: string
}

interface RawExercise {
    exerciseId: string
    name?: string
}

interface Routine {
    id: number
    title: string
    description: string
    isPublic: boolean
    createdAt: string
    updatedAt: string
    owner: {
        id: number
        username: string
    }
    exercises: RawExercise[]
}

interface RoutineForEdit {
    id: number
    title: string
    description: string
    isPublic: boolean
    exercises: FullExercise[]
}

interface FullExercise {
    id: string
    name: string
    target: string
    secondaryMuscles: string[]
    equipment: string
    bodyPart: string
    instructions: string
}

export default function PerfilPage() {
    const router = useRouter()
    const [menuOpen, setMenuOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('Publicaciones')
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [stats, setStats] = useState({ publicaciones: 0, rutinas: 0, seguidores: 0, seguidos: 0 })
    const [rutinas, setRutinas] = useState<Routine[]>([])
    const [rutinaEditando, setRutinaEditando] = useState<RoutineForEdit | null>(null)
    const [borrarRutina, setBorrarRutina] = useState<Routine | null>(null)
    const API_URL = process.env.NEXT_PUBLIC_API_URL

    const fetchProfileRoutines = async () => {
        const token = localStorage.getItem('token')
        if (!token) return

        const res = await fetch(`${API_URL}/api/routines`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) return

        const routines = await res.json()
        const rutinasConDatosCompletos = await Promise.all(
            routines.map(async (rutina: any) => {
                const ejerciciosCompletos = await Promise.all(
                    rutina.exercises.map(async (e: any) => {
                        const exRes = await fetch(`${API_URL}/api/exercises/${e.exerciseId}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        })
                        const exData = await exRes.json()
                        return {
                            id: exData.id,
                            name: exData.name,
                            target: exData.target,
                            secondaryMuscles: exData.secondaryMuscles || [],
                            equipment: exData.equipment,
                            bodyPart: exData.bodyPart,
                            instructions: exData.instructions || '',
                            exerciseId: exData.id
                        }
                    })
                )
                return {
                    ...rutina,
                    exercises: ejerciciosCompletos
                }
            })
        )
        setRutinas(rutinasConDatosCompletos)
    }

    const fetchStats = async (userId: number, token: string) => {
        const [followers, following, posts, routines] = await Promise.all([
            fetch(`${API_URL}/api/followers/followers/count`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
            fetch(`${API_URL}/api/followers/following/count`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
            fetch(`${API_URL}/api/posts/user/${userId}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
            fetch(`${API_URL}/api/routines`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json())
        ])
        setStats({ publicaciones: posts.length, rutinas: routines.length, seguidores: followers.followers, seguidos: following.following })
    }

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) return

        fetch(`${API_URL}/api/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => res.ok ? res.json() : Promise.reject(res))
        .then(async data => {
            const profilePic = data.profilePic?.startsWith('http') ? data.profilePic : `${API_URL}${data.profilePic}`
            setProfile({ ...data, profilePic })

            await fetchStats(data.id, token)

            const routinesRes = await fetch(`${API_URL}/api/routines`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            const routines = await routinesRes.json()

            const rutinasConDatosCompletos = await Promise.all(
                routines.map(async (rutina: any) => {
                    const ejerciciosCompletos = await Promise.all(
                        rutina.exercises.map(async (e: any) => {
                            const exRes = await fetch(`${API_URL}/api/exercises/${e.exerciseId}`, {
                                headers: { Authorization: `Bearer ${token}` }
                            })
                            const exData = await exRes.json()
                            return {
                                id: exData.id,
                                name: exData.name,
                                target: exData.target,
                                secondaryMuscles: exData.secondaryMuscles || [],
                                equipment: exData.equipment,
                                bodyPart: exData.bodyPart,
                                instructions: exData.instructions || '',
                                exerciseId: exData.id
                            }
                        })
                    )
                    return {
                        ...rutina,
                        exercises: ejerciciosCompletos
                    }
                })
            )
            setRutinas(rutinasConDatosCompletos)
        })
        .catch(console.error)
    }, [API_URL])

    const handleLogout = () => {
        localStorage.removeItem('token')
        router.push('/auth')
    }

    const handleEditClick = async (rutina: Routine) => {
        const token = localStorage.getItem('token')
        if (!token) return
        const ejerciciosCompletos = await Promise.all(
            rutina.exercises.map(async (e) => {
                const res = await fetch(`${API_URL}/api/exercises/${e.exerciseId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                const data = await res.json()
                return {
                    id: data.id, name: data.name, target: data.target,
                    secondaryMuscles: data.secondaryMuscles || [],
                    equipment: data.equipment, bodyPart: data.bodyPart,
                    instructions: data.instructions || ''
                }
            })
        )
        setRutinaEditando({
            id: rutina.id, title: rutina.title,
            description: rutina.description, isPublic: rutina.isPublic,
            exercises: ejerciciosCompletos
        })
    }

    const handleDeleteRoutine = async (id: number) => {
        const token = localStorage.getItem('token')
        if (!token || !profile) return
        await fetch(`${API_URL}/api/routines/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        })
        await fetchProfileRoutines()
        await fetchStats(profile.id, token)
        setBorrarRutina(null)
    }

    if (!profile) return null

    return (
        <div className="min-h-screen bg-black text-white">
            {rutinaEditando ? (
                <div className="flex w-full">
                    <div className="w-1/4 p-4 border-r border-gray-700" />
                    <div className="w-2/4 px-4 py-4">
                        <EditarRutina
                            routine={rutinaEditando}
                            onClose={() => setRutinaEditando(null)}
                            onRoutineUpdated={async () => {
                                await fetchProfileRoutines()
                                setRutinaEditando(null)
                            }}
                        />
                    </div>
                    <div className="w-1/4 p-4 border-l border-gray-700" />
                </div>
            ) : (
                <>
                    <div className="w-full">
                        <div className="flex justify-between items-center mb-6 p-6">
                            <h1 className="text-3xl font-bold">@{profile.username}</h1>
                            <div className="relative">
                                <button
                                    onClick={() => setMenuOpen(open => !open)}
                                    className="text-white text-2xl p-2 rounded-full hover:bg-white/10 transition"
                                    aria-label="Configuración"
                                >
                                    <FiSettings />
                                </button>
                                {menuOpen && (
                                    <div className="absolute right-0 mt-2 w-44 bg-[#27391C] text-white rounded shadow-lg z-50">
                                        <button onClick={() => { setMenuOpen(false); router.push('/complete-profile') }} className="block w-full text-left px-4 py-2 hover:bg-white/10 transition">
                                            Editar perfil
                                        </button>
                                        <button onClick={() => { setMenuOpen(false); handleLogout() }} className="block w-full text-left px-4 py-2 hover:bg-white/10 transition">
                                            Cerrar sesión
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center justify-center mt-6 space-y-4 gap-6">
                            <img src={profile.profilePic} alt="Foto de perfil" className="w-24 h-24 rounded-full border-2 border-gray-700 mb-2" crossOrigin="anonymous" />
                            <div className="flex space-x-6">
                                {[ 
                                    { label: 'Publicaciones', count: stats.publicaciones },
                                    { label: 'Rutinas', count: stats.rutinas },
                                    { label: 'Seguidores', count: stats.seguidores },
                                    { label: 'Seguidos', count: stats.seguidos }
                                ].map(({ label, count }) => (
                                    <div key={label} className="flex flex-col items-center">
                                        <span className="text-xl font-semibold">{count}</span>
                                        <span className="text-gray-400 text-sm">{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="text-center mt-6 pb-6">
                            <h2 className="text-xl font-semibold">
                                {profile.name} 
                                <span className="text-sm text-white ml-2"> · </span>
                                <span className="text-sm text-white/60 ml-2"> {profile.birthdate}</span>
                            </h2>
                            <p className="text-sm text-white/50 mt-2 max-w-xl mx-auto">{profile.bio}</p>
                        </div>
                        <div className="border-b border-gray-700 pb-4">
                            <ProfileMenu activeTab={activeTab} onTabChange={tab => setActiveTab(tab)} />
                        </div>
                        <div className="flex w-full min-h-screen">
                            <div className="w-1/4 border-r border-gray-700" />
                            <div className="w-2/4 px-4 py-4 space-y-4">
                                {activeTab === 'Publicaciones' ? (
                                    <p className="text-center text-gray-400">Tus publicaciones aparecerán aquí.</p>
                                ) : rutinas.length === 0 ? (
                                    <p className="text-center text-gray-400">No has creado ninguna rutina todavía.</p>
                                ) : (
                                    rutinas.map((rutina: Routine) => (
                                        <RoutineCard
                                            key={rutina.id}
                                            id={rutina.id}
                                            title={rutina.title}
                                            description={rutina.description}
                                            isPublic={rutina.isPublic}
                                            updatedAt={rutina.updatedAt || rutina.createdAt}
                                            owner={rutina.owner.username}
                                            exercises={rutina.exercises}
                                            onEditClick={() => handleEditClick(rutina)}
                                            onDeleteClick={() => setBorrarRutina(rutina)}
                                        />
                                    ))
                                )}
                            </div>
                            <div className="w-1/4 border-l border-gray-700" />
                        </div>
                    </div>
                </>
            )}
            {borrarRutina && (
                <ConfirmarBorrar
                    onCancel={() => setBorrarRutina(null)}
                    onConfirm={() => handleDeleteRoutine(borrarRutina.id)}
                />
            )}
        </div>
    )
}
