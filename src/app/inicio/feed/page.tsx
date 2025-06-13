// Feed Page Updated
'use client'

import FeedMenu from "@/components/FeedMenu"
import { useState, useEffect } from "react"
import PostCard from "@/components/PostCard"
import { FaPlus } from 'react-icons/fa';
import CrearPost from "@/components/CrearPost";
import InicioMenu from "@/components/InicioMenu";
import RoutineCard from "@/components/RoutineCard";
import { IoMdClose } from 'react-icons/io';
import { FaSearch } from "react-icons/fa";
import UserCard from "@/components/UserCard";

interface Post {
    id: number
    author: {
        id: number
        username: string
        name?: string
        profilePic?: string
    }
    content: string
    createdAt: string
    likesCount: number
    commentsCount: number
    savedCount: number
    routine?: {
        id: number
        title: string
        description: string
        isPublic: boolean
        updatedAt: string
        owner: {
            id: number
            username: string
        }
        exercises: { id: string, name?: string }[]
    }
}

interface Routine {
    id: number
    title: string
    description: string
    isPublic: boolean
    updatedAt: string
    owner: {
        id: number
        username: string
    }
    exercises: { id: string, name?: string }[]
}

interface UserProfile {
    id: number
    username: string
    name?: string
    profilePic?: string
}

export default function FeedPage() {
    const [activeTab, setActiveTab] = useState<'Publicaciones' | 'Rutinas' | 'Explorar'>('Publicaciones')
    const [activeSubTab, setActiveSubTab] = useState('Publicaciones')
    const [mostrarCrearPost, setMostrarCrearPost] = useState(false)
    const [posts, setPosts] = useState<Post[]>([])
    const [routines, setRoutines] = useState<Routine[]>([])
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [savedRoutineIds, setSavedRoutineIds] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<{ users?: any[], posts?: any[], routines?: any[] }>({});
    const API_URL = process.env.NEXT_PUBLIC_API_URL

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) return

        fetch(`${API_URL}/api/users/me`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setProfile({ id: data.id, username: data.username, name: data.name, profilePic: data.profilePic })
            })
    }, [API_URL])

    useEffect(() => {
        if (!profile) return;
        const token = localStorage.getItem('token');
        if (!token) return;

        const fetchData = async () => {
            let url = '';

            if (activeTab === 'Publicaciones') {
                switch (activeSubTab) {
                    case 'Publicaciones': url = `${API_URL}/api/posts`; break;
                    case 'Gustados': url = `${API_URL}/api/interactions/liked`; break;
                    case 'Guardados': url = `${API_URL}/api/interactions/saved`; break;
                    case 'Comentados': url = `${API_URL}/api/posts/commented`; break;
                    case 'Mis publicaciones': {
                        const res = await fetch(`${API_URL}/api/posts/user/${profile.id}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        const rawPosts: Post[] = await res.json();
                        const enriched = await Promise.all(
                            rawPosts.map(async (post: Post) => {
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
                        return setPosts(enriched);
                    }
                    default: return;
                }
            } else if (activeTab === 'Rutinas') {
                switch (activeSubTab) {
                    case 'Rutinas': url = `${API_URL}/api/routines/following/public`; break;
                    case 'Mis rutinas': {
                        const res = await fetch(`${API_URL}/api/routines/`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        const rawRoutines: Routine[] = await res.json();
                        const enrichedRoutines = await Promise.all(
                            rawRoutines.map(async (routine: Routine) => {
                                if (routine.exercises) {
                                    routine.exercises = await Promise.all(
                                        routine.exercises.map(async (ex: { id: string }) => {
                                            const r = await fetch(`${API_URL}/api/exercises/${ex.id}`, {
                                                headers: { Authorization: `Bearer ${token}` }
                                            });
                                            return await r.json();
                                        })
                                    );
                                }
                                return routine;
                            })
                        );
                        return setRoutines(enrichedRoutines);
                    }
                    case 'Rutinas guardadas': {
                        const res = await fetch(`${API_URL}/api/saved-routines`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        const rawRoutines: Routine[] = await res.json();
                        const enrichedRoutines = await Promise.all(
                            rawRoutines.map(async (routine: Routine) => {
                                routine.exercises = await Promise.all(
                                    (routine.exercises || []).map(async (ex: { id: string }) => {
                                        const r = await fetch(`${API_URL}/api/exercises/${ex.id}`, {
                                            headers: { Authorization: `Bearer ${token}` }
                                        });
                                        return await r.json();
                                    })
                                );
                                return routine;
                            })
                        );
                        setSavedRoutineIds(rawRoutines.map(r => r.id));
                        return setRoutines(enrichedRoutines);
                    }
                    default: return;
                }
            }

            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            activeTab === 'Publicaciones' ? setPosts(data) : setRoutines(data);
        };

        fetchData();
    }, [activeTab, activeSubTab, API_URL, profile]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        if (activeTab !== 'Explorar' || !searchQuery.trim()) {
            setSearchResults({})
            return
        }

        const controller = new AbortController()
        const typeMap: Record<string, string> = {
            Todo: '',
            Publicaciones: 'post',
            Rutinas: 'routine',
            Usuarios: 'user',
        }

        const fetchResults = async () => {
            const typeParam = typeMap[activeSubTab] || ''
            const res = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(searchQuery)}${typeParam ? `&type=${typeParam}` : ''}`, {
                headers: { Authorization: `Bearer ${token}` },
                signal: controller.signal
            })
            const data = await res.json()
            setSearchResults(data)
        }

        fetchResults()
        return () => controller.abort()
    }, [searchQuery, activeTab, activeSubTab, API_URL])

    const toggleSaveRoutine = async (routineId: number, isCurrentlySaved: boolean) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        if (isCurrentlySaved) {
            await fetch(`${API_URL}/api/saved-routines/${routineId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            setSavedRoutineIds(prev => prev.filter(id => id !== routineId));
        } else {
            await fetch(`${API_URL}/api/saved-routines/${routineId}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
            setSavedRoutineIds(prev => [...prev, routineId]);
        }
    };

    return (
        <div className="flex min-h-screen bg-black text-white">
            <div className="w-1/4 border-r border-gray-700 p-4">
                {!mostrarCrearPost && (
                    <div className="fixed left-0 top-1/2 transform -translate-y-1/2 w-1/4 px-4">
                        <InicioMenu 
                            activeTab={activeTab} 
                            onTabChange={(tab) => {
                                setActiveTab(tab as 'Publicaciones' | 'Rutinas' | 'Explorar')
                                if (tab === 'Publicaciones') setActiveSubTab('Publicaciones')
                                else if (tab === 'Rutinas') setActiveSubTab('Rutinas')
                                else if (tab === 'Explorar') setActiveSubTab('Todo')
                            }} 
                        />
                    </div>
                )}
            </div>
            <div className="w-2/4 p-4">
                {mostrarCrearPost ? (
                    <CrearPost
                        onClose={() => setMostrarCrearPost(false)}
                        onPostCreated={() => setMostrarCrearPost(false)}
                    />
                ) : (
                    <>
                        {activeTab === 'Publicaciones' && posts.map(post => (
                            <PostCard
                                key={post.id}
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
                        ))}
                        {activeTab === 'Rutinas' && routines.map(routine => (
                            <RoutineCard
                                key={routine.id}
                                id={routine.id}
                                title={routine.title}
                                description={routine.description}
                                isPublic={routine.isPublic}
                                updatedAt={routine.updatedAt}
                                owner={routine.owner.username}
                                exercises={routine.exercises || []}
                                isSaved={savedRoutineIds.includes(routine.id)}
                                onToggleSave={() => toggleSaveRoutine(routine.id, savedRoutineIds.includes(routine.id))}
                                isOwnRoutine={routine.owner.id === profile?.id}
                            />
                        ))}
                        {activeTab === 'Explorar' && (
                            <div className="mb-4 relative">
                                <div className="flex items-center bg-gray-800 border border-gray-600 rounded px-3 py-2 mb-3">
                                    <FaSearch className="text-gray-400 mr-2" />
                                    <input
                                        type="text"
                                        placeholder="Buscar..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none"
                                    />
                                    {searchQuery && (
                                        <button onClick={() => setSearchQuery('')} className="text-gray-400 ml-2">
                                            <IoMdClose />
                                        </button>
                                    )}
                                </div>
                                

                                {activeSubTab === 'Todo' && (
                                    <>
                                        {searchResults.users?.map(user => (
                                            <UserCard
                                                key={user.id}
                                                id={user.id}
                                                username={user.username}
                                                name={user.name}
                                                profilePic={user.profilePic}
                                            />
                                        ))}
                                        {searchResults.posts?.map(post => (
                                            <PostCard key={post.id} {...{
                                                username: post.author.username,
                                                name: post.author.name || '',
                                                profilePic: post.author.profilePic || '',
                                                content: post.content,
                                                createdAt: post.createdAt,
                                                likes: post.likesCount,
                                                comments: post.commentsCount,
                                                saved: post.savedCount,
                                                onDelete: () => {},
                                                attachedRoutine: post.routine
                                            }} />
                                        ))}
                                        {searchResults.routines?.map(routine => (
                                            <RoutineCard
                                                key={routine.id}
                                                id={routine.id}
                                                title={routine.title}
                                                description={routine.description}
                                                isPublic={routine.isPublic}
                                                updatedAt={routine.updatedAt}
                                                owner={routine.owner.username}
                                                exercises={routine.exercises || []}
                                                isSaved={savedRoutineIds.includes(routine.id)}
                                                onToggleSave={() => toggleSaveRoutine(routine.id, savedRoutineIds.includes(routine.id))}
                                                isOwnRoutine={routine.owner.id === profile?.id}
                                            />
                                        ))}
                                    </>
                                )}
                                {activeSubTab === 'Publicaciones' && searchResults.posts?.map(post => (
                                    <PostCard key={post.id} {...{
                                        username: post.author.username,
                                        name: post.author.name || '',
                                        profilePic: post.author.profilePic || '',
                                        content: post.content,
                                        createdAt: post.createdAt,
                                        likes: post.likesCount,
                                        comments: post.commentsCount,
                                        saved: post.savedCount,
                                        onDelete: () => {},
                                        attachedRoutine: post.routine
                                    }} />
                                ))}
                                {activeSubTab === 'Rutinas' && searchResults.routines?.map(routine => (
                                    <RoutineCard
                                        key={routine.id}
                                        id={routine.id}
                                        title={routine.title}
                                        description={routine.description}
                                        isPublic={routine.isPublic}
                                        updatedAt={routine.updatedAt}
                                        owner={routine.owner.username}
                                        exercises={routine.exercises || []}
                                        isSaved={savedRoutineIds.includes(routine.id)}
                                        onToggleSave={() => toggleSaveRoutine(routine.id, savedRoutineIds.includes(routine.id))}
                                        isOwnRoutine={routine.owner.id === profile?.id}
                                    />
                                ))}
                                {activeSubTab === 'Usuarios' && searchResults.users?.map(user => (
                                    <UserCard
                                        key={user.id}
                                        id={user.id}
                                        username={user.username}
                                        name={user.name}
                                        profilePic={user.profilePic}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
            <div className="w-1/4 border-l border-gray-700 p-4">
                {!mostrarCrearPost && (
                    <div className="fixed right-0 top-1/2 transform -translate-y-1/2 w-1/4 px-4">
                        <FeedMenu 
                            activeTab={activeSubTab} 
                            onTabChange={setActiveSubTab} 
                            parentTab={activeTab} 
                        />
                    </div>
                )}
            </div>
        </div>
    )
}