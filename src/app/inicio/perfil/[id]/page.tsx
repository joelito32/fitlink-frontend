'use client'

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import RoutineCard from '@/components/RoutineCard';
import PostCard from '@/components/PostCard';
import EditarRutina from '@/components/EditarRutina';
import ConfirmarBorrar from '@/components/ConfirmarBorrar';
import ProfileMenu from '@/components/ProfileMenu';
import { IoMdClose } from 'react-icons/io';
import ConfirmarUnfollow from '@/components/ConfirmarUnfollow';
import {
    fetchUserProfile,
    fetchUserStats,
    fetchUserRoutines,
    fetchUserPosts,
    checkIfFollowing,
    followUser,
    unfollowUser,
    deleteRoutine
} from '@/lib/api/api';

interface UserProfile {
    id: number;
    username: string;
    name: string;
    birthdate: string;
    bio?: string;
    email?: string;
    profilePic: string;
}

export default function ProfilePage() {
    const { id } = useParams();
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [rutinas, setRutinas] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'Publicaciones' | 'Rutinas'>('Publicaciones');
    const [rutinaEditando, setRutinaEditando] = useState<any>(null);
    const [borrarRutina, setBorrarRutina] = useState<any>(null);
    const [stats, setStats] = useState({ publicaciones: 0, rutinas: 0, seguidores: 0, seguidos: 0 });
    const [isFollowing, setIsFollowing] = useState(false)
    const [mostrarConfirmarUnfollow, setMostrarConfirmarUnfollow] = useState(false)

    useEffect(() => {
        async function init() {
            try {
                const user = await fetchUserProfile(id as string);
                setProfile(user);

                const [statsData, routinesData, postsData, following] = await Promise.all([
                    fetchUserStats(user.id),
                    fetchUserRoutines(user.id),
                    fetchUserPosts(user.id),
                    checkIfFollowing(id as string)
                ]);

                setStats(statsData);
                setRutinas(routinesData);
                setPosts(postsData);
                setIsFollowing(following);
            } catch (err) {
                console.error(err);
            }
        }
        init();
    }, [id]);

    const handleEditClick = (rutina: any) => {
        setRutinaEditando(rutina);
    };

    const handleDeleteRoutine = async (routineId: number) => {
        try {
            await deleteRoutine(routineId);
            setRutinas(prev => prev.filter(r => r.id !== routineId));
            setBorrarRutina(null);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchProfileRoutines = async () => {
        const data = await fetchUserRoutines(profile.id);
        setRutinas(data);
    };

    const handleFollowClick = async () => {
        if (!profile) return;
        try {
            if (isFollowing) {
                setMostrarConfirmarUnfollow(true);
            } else {
                await followUser(id as string);
                setIsFollowing(true);
                const updatedStats = await fetchUserStats(profile.id);
                setStats(updatedStats);
            }
        } catch (err) {
            console.error('Error al seguir', err);
        }
    };

    const handleUnfollowConfirm = async () => {
        if (!profile) return;
        try {
            await unfollowUser(id as string);
            setIsFollowing(false);
            setMostrarConfirmarUnfollow(false);
            const updatedStats = await fetchUserStats(profile.id);
            setStats(updatedStats);
        } catch (err) {
            console.error('Error al dejar de seguir', err);
        }
    };

    if (!profile) return null;

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
                                await fetchProfileRoutines();
                                setRutinaEditando(null);
                            }}
                        />
                    </div>
                    <div className="w-1/4 p-4 border-l border-gray-700" />
                </div>
            ) : (
                <>
                    <div className="w-full">
                        <div className="grid grid-cols-3 items-center mb-6 p-6">
                            <h1 className="text-3xl font-bold justify-self-start">@{profile.username}</h1>
                            <div className="justify-self-center">
                                <button 
                                    className={`px-6 py-2 rounded-xl text-base font-medium transition-colors ${isFollowing ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-[#1F7D53] text-white hover:bg-[#186345]'}`}
                                    onClick={handleFollowClick}
                                >
                                    {isFollowing ? 'Dejar de seguir' : 'Seguir'}
                                </button>
                            </div>
                            <div className="justify-self-end">
                                <button
                                    onClick={() => router.back()}
                                    className=" text-white text-2xl p-2 rounded-full hover:bg-white/10 transition"
                                    aria-label="Configuración"
                                >
                                    <IoMdClose />
                                </button>
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
                            <ProfileMenu activeTab={activeTab} onTabChange={tab => setActiveTab(tab as 'Publicaciones' | 'Rutinas')} />
                        </div>
                        <div className="flex w-full min-h-screen">
                            <div className="w-1/4 border-r border-gray-700" />
                            <div className="w-2/4 px-4 py-4 space-y-4">
                                {activeTab === 'Publicaciones' ? (
                                    posts.length === 0 ? (
                                        <p className="text-center text-gray-400">El usuario no ha creado ninguna publicación todavía.</p>
                                    ) : (
                                        posts.map((post: any) => (
                                            <PostCard key={post.id} post={post} />
                                        ))
                                    )
                                ) : rutinas.length === 0 ? (
                                    <p className="text-center text-gray-400">El usuario no ha creado ninguna rutina todavía.</p>
                                ) : (
                                    rutinas.map((rutina: any) => (
                                        <RoutineCard
                                            key={rutina.id}
                                            id={rutina.id}
                                            title={rutina.title}
                                            description={rutina.description}
                                            isPublic={rutina.isPublic}
                                            updatedAt={rutina.updatedAt || rutina.createdAt}
                                            owner={rutina.owner}
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
            {mostrarConfirmarUnfollow && (
                <ConfirmarUnfollow 
                    onCancel={() => setMostrarConfirmarUnfollow(false)}
                    onConfirm={handleUnfollowConfirm}
                />
            )}
        </div>
    );
}
