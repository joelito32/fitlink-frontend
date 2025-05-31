// app/perfil/page.tsx
'use client'

import ProfileMenu from "@/components/ProfileMenu"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FiSettings } from "react-icons/fi"

interface UserProfile {
    id: number
    username: string
    name: string
    birthdate: string
    bio?: string
    email?: string
    profilePic: string
}

export default function PerfilPage() {
    const router = useRouter()
    const [menuOpen, setMenuOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('Publicaciones')
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [stats, setStats] = useState({
        publicaciones: 0,
        rutinas: 0,
        seguidores: 0,
        seguidos: 0
    })
    const API_URL = process.env.NEXT_PUBLIC_API_URL

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) return

        fetch(`${API_URL}/api/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
                if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
                return res.json()
            })
            .then(data => {
                console.log("Datos recibidos del usuario:", data)
                const profilePic = data.profilePic?.startsWith('http')
                    ? data.profilePic
                    : `${API_URL}${data.profilePic}`
                setProfile({ ...data, profilePic })

                const userId = data.id

                console.log('Obteniendo datos desde:', {
                    followers: `${API_URL}/api/followers/followers/count`,
                    following: `${API_URL}/api/followers/following/count`,
                    posts: `${API_URL}/api/posts/user/${userId}`,
                    routines: `${API_URL}/api/routines`
                })

                Promise.all([
                    fetch(`${API_URL}/api/followers/followers/count`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`${API_URL}/api/followers/following/count`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`${API_URL}/api/posts/user/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`${API_URL}/api/routines`, { headers: { Authorization: `Bearer ${token}` } }),
                ])
                .then(async ([followersRes, followingRes, postsRes, routinesRes]) => {
                    for (const res of [followersRes, followingRes, postsRes, routinesRes]) {
                        if (!res.ok) {
                            const text = await res.text()
                            console.error(`Error en fetch: ${res.url}\nStatus: ${res.status}\nBody: ${text}`)
                            throw new Error(`Fetch error en ${res.url}`)
                        }
                    }

                    const [followers, following, posts, routines] = await Promise.all([
                        followersRes.json(),
                        followingRes.json(),
                        postsRes.json(),
                        routinesRes.json(),
                    ])
                    setStats({
                        publicaciones: posts.length,
                        rutinas: routines.length,
                        seguidores: followers.followers,
                        seguidos: following.following
                    })
                })
                .catch(error => {
                    console.error("Error al obtener estadísticas:", error)
                })
            })
            .catch(console.error)
    }, [API_URL])

    const handleLogout = () => {
        localStorage.removeItem('token')
        router.push('/auth')
    }

    if (!profile) return null

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Centro */}
            <div className="w-full p-6">
                <div className="flex justify-between items-center mb-6">
                    {/* Username */}
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
                                <button
                                    onClick={() => {
                                        setMenuOpen(false)
                                        router.push('/complete-profile')
                                    }}
                                    className="block w-full text-left px-4 py-2 hover:bg-white/10 transition"
                                >
                                    Editar perfil
                                </button>
                                <button
                                    onClick={() => {
                                        setMenuOpen(false)
                                        handleLogout()
                                    }}
                                    className="block w-full text-left px-4 py-2 hover:bg-white/10 transition"
                                >
                                    Cerrar sesión
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Foto y estadísticas */}
                <div className="flex items-center justify-center mt-6 space-y-4 gap-6">
                    {/* Foto */}
                    <img
                        src={profile.profilePic}
                        alt="Foto de perfil"
                        className="w-24 h-24 rounded-full border-2 border-gray-700 mb-2"
                        crossOrigin="anonymous"
                    />
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

                {/* Menú publicaciones/rutinas */}
                <div className="border-b border-gray-700 mb-6 pb-4">
                    <ProfileMenu 
                        activeTab={activeTab}
                        onTabChange={tab => setActiveTab(tab)}
                    />
                </div>
                <div className="border-b border-gray-700 pb-6 space-y-4">
                    {activeTab === 'Publicaciones' ? (
                        <>
                            <div className="bg-gray-800 p-4 rounded">Tu publicación #1</div>
                        </>
                    ) : (
                        <>
                            <div className="bg-gray-800 p-4 rounded">Tu rutina #1</div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
