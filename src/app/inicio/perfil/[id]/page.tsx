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
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [rutinas, setRutinas] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'Publicaciones' | 'Rutinas'>('Publicaciones');
    const [rutinaEditando, setRutinaEditando] = useState<any>(null);
    const [borrarRutina, setBorrarRutina] = useState<any>(null);
    const [stats, setStats] = useState({ publicaciones: 0, rutinas: 0, seguidores: 0, seguidos: 0 });
    const [isFollowing, setIsFollowing] = useState(false)
    const [mostrarConfirmarUnfollow, setMostrarConfirmarUnfollow] = useState(false)

    const fetchStats = async (userId: number, token: string) => {
        const [followers, following, posts, routines] = await Promise.all([
            fetch(`${API_URL}/api/followers/followers/count/${userId}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
            fetch(`${API_URL}/api/followers/following/count/${userId}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
            fetch(`${API_URL}/api/posts/user/${userId}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
            fetch(`${API_URL}/api/routines/user/${userId}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json())
        ]);
        setStats({ publicaciones: posts.length, rutinas: routines.length, seguidores: followers.followers, seguidos: following.following });
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        fetch(`${API_URL}/api/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.ok ? res.json() : Promise.reject(res))
            .then(async data => {
                const profilePic = data.profilePic?.startsWith('http') ? data.profilePic : `${API_URL}${data.profilePic}`;
                setProfile({ ...data, profilePic });

                await fetchStats(data.id, token);

                const routinesRes = await fetch(`${API_URL}/api/routines/user/${data.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const routines = await routinesRes.json();

                const rutinasConDatosCompletos = await Promise.all(
                    routines.map(async (rutina: any) => {
                        const ejerciciosCompletos = await Promise.all(
                            rutina.exercises.map(async (e: any) => {
                                const exRes = await fetch(`${API_URL}/api/exercises/${e.id}`, {
                                    headers: { Authorization: `Bearer ${token}` }
                                });
                                return await exRes.json();
                            })
                        );
                        return { ...rutina, exercises: ejerciciosCompletos };
                    })
                );
                setRutinas(rutinasConDatosCompletos);

                const postsRes = await fetch(`${API_URL}/api/posts/user/${data.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const rawPosts = await postsRes.json();

                const enriched = await Promise.all(
                    rawPosts.map(async (post: any) => {
                        if (post.routine?.exercises) {
                            post.routine.exercises = await Promise.all(
                                post.routine.exercises.map(async (ex: { id: string }) => {
                                    const r = await fetch(`${API_URL}/api/exercises/${ex.id}`, {
                                        headers: { Authorization: `Bearer ${token}` }
                                    });
                                    return await r.json();
                                })
                            );
                        }
                        return post;
                    })
                );
                setPosts(enriched);
            })
            .catch(console.error);
    }, [id, API_URL]);

    const handleEditClick = (rutina: any) => {
        setRutinaEditando(rutina);
    };

    const handleDeleteRoutine = async (id: number) => {
        const token = localStorage.getItem('token');
        if (!token) return;
        await fetch(`${API_URL}/api/routines/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        setRutinas(prev => prev.filter(r => r.id !== id));
        setBorrarRutina(null);
    };

    const fetchProfileRoutines = async () => {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/routines/user/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setRutinas(data);
    };

    useEffect(() => {

        const token = localStorage.getItem('token');
        if (!token) return;

        fetch(`${API_URL}/api/followers/is-following/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.ok ? res.json() : Promise.reject(res))
            .then(data => setIsFollowing(data.isFollowing))
            .catch(() => setIsFollowing(false));
    }, [id, API_URL]);

    const handleFollowClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const token = localStorage.getItem('token');
        if (!token || !profile) return;

        if (isFollowing) {
            setMostrarConfirmarUnfollow(true)
        }  else {
            try {
                const res = await fetch(`${API_URL}/api/followers/follow/${id}`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    setIsFollowing(true);
                    await fetchStats(profile.id, token)
                }
            } catch (err) {
                console.error('Error al seguir', err);
            }
        }
    };

    const handleUnfollowConfirm = async () => {
        const token = localStorage.getItem('token');
        if (!token || !profile) return;

        try {
            const res = await fetch(`${API_URL}/api/followers/unfollow/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setIsFollowing(false);
                setMostrarConfirmarUnfollow(false);
                await fetchStats(profile.id, token);
            }
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
                                            <PostCard
                                                key={post.id}
                                                authorId={post.authorId}
                                                username={post.author.username}
                                                name={post.author.name || ''}
                                                profilePic={post.author.profilePic || ''}
                                                content={post.content}
                                                createdAt={post.createdAt}
                                                likes={post.likesCount}
                                                comments={post.commentsCount}
                                                saved={post.savedCount}
                                                onDelete={() => {}}
                                                attachedRoutine={post.routine}
                                            />
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
