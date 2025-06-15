'use client'

import ProfileMenu from "@/components/ProfileMenu"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FiSettings } from "react-icons/fi"
import RoutineCard from "@/components/RoutineCard"
import ConfirmarBorrar from "@/components/ConfirmarBorrar"
import EditarRutina from "@/components/EditarRutina"
import PostCard from "@/components/PostCard"
import { 
    fetchCurrentUser,
    fetchUserStats,
    fetchUserPosts,
    fetchUserRoutines,
    deleteRoutine
} from "@/lib/api/api"
import { UserProfile, Routine, RoutineForEdit, Post } from "@/lib/api/types"

export default function PerfilPage() {
    const router = useRouter()
    const [menuOpen, setMenuOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('Publicaciones')
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [stats, setStats] = useState({ publicaciones: 0, rutinas: 0, seguidores: 0, seguidos: 0 })
    const [rutinas, setRutinas] = useState<Routine[]>([])
    const [posts, setPosts] = useState<Post[]>([])
    const [rutinaEditando, setRutinaEditando] = useState<RoutineForEdit | null>(null)
    const [borrarRutina, setBorrarRutina] = useState<Routine | null>(null)

    useEffect(() => {
        let isMounted = true;

        async function init() {
            try {
                const user = await fetchCurrentUser();
                const profilePicUrl = user.profilePic && user.profilePic.startsWith('http') 
                    ? user.profilePic 
                    : `${process.env.NEXT_PUBLIC_API_URL}${user.profilePic || ''}`;
                if (isMounted) {
                    setProfile({ 
                        ...user, 
                        profilePic: profilePicUrl,
                        name: user.name || '',
                        birthdate: user.birthdate || '',
                        email: user.email || ''
                    });
                }

                const [statsData, routinesData, postsData] = await Promise.all([
                    fetchUserStats(user.id),
                    fetchUserRoutines(user.id),
                    fetchUserPosts(user.id),
                ]);

                setStats(statsData);
                setRutinas(routinesData.map(r => ({
                    ...r,
                    createdAt: r.createdAt || r.updatedAt
                })));
                setPosts(postsData);
            } catch (err) {
                console.error(err);
                if (isMounted) router.push('/auth');
            }
        }
        init();

        return () => {
            isMounted = false
        }
    }, []);
    

    const handleLogout = () => {
        localStorage.removeItem('token')
        router.push('/auth')
    }

    const handleEditClick = (rutina: Routine) => {
        const formatted: RoutineForEdit = {
            id: rutina.id,
            title: rutina.title,
            description: rutina.description,
            isPublic: rutina.isPublic,
            exercises: rutina.exercises.map(e => ({
                id: e.id,
                name: e.name!,
                target: (e as any).target,
                secondaryMuscles: (e as any).secondaryMuscles,
                equipment: (e as any).equipment,
                bodyPart: (e as any).bodyPart,
                instructions: (e as any).instructions,
            })),
        };
        setRutinaEditando(formatted);
    };

    const handleDeleteRoutine = async (id: number) => {
        if (!profile) return;
        try {
            await deleteRoutine(id);
            const [statsData, routinesData] = await Promise.all([
                fetchUserStats(profile.id),
                fetchUserRoutines(profile.id),
            ]);
            setStats(statsData);
            setRutinas(routinesData.map(r => ({
                ...r,
                createdAt: r.createdAt || r.updatedAt
            })));
        } catch (err) {
            console.error(err);
        } finally {
            setBorrarRutina(null);
        }
    };

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
                                if (profile) {
                                    const routinesData = await fetchUserRoutines(profile.id)
                                    setRutinas(routinesData.map(r => ({
                                        ...r,
                                        createdAt: r.createdAt || r.updatedAt
                                    })))
                                }
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
                                    posts.length === 0 ? (
                                        <p className="text-center text-gray-400">No has creado ninguna publicación todavía.</p>
                                    ) : (
                                        posts.map((post: Post) => (
                                            <PostCard key={post.id} post={post} />
                                        ))
                                    )
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
                                            updatedAt={rutina.updatedAt}
                                            owner={rutina.owner}
                                            exercises={rutina.exercises}
                                            onEditClick={() => handleEditClick(rutina)}
                                            onDeleteClick={() => setBorrarRutina(rutina)}
                                            isOwnRoutine={rutina.owner.id === profile.id}
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
