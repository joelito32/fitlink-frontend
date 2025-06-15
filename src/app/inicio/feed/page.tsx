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
import {
    fetchCurrentUserProfileBasic,
    fetchPostsByType,
    fetchMyPostsWithExercises,
    fetchRoutinesByType,
    searchGlobalContent,
} from '@/lib/api/api'
import { Post, Routine, UserProfile } from '@/lib/api/types'
import FullPost from "@/components/FullPost";


export default function FeedPage() {
    const [activeTab, setActiveTab] = useState<'Publicaciones' | 'Rutinas' | 'Explorar'>('Publicaciones')
    const [activeSubTab, setActiveSubTab] = useState('Publicaciones')
    const [mostrarCrearPost, setMostrarCrearPost] = useState(false)
    const [posts, setPosts] = useState<Post[]>([])
    const [routines, setRoutines] = useState<Routine[]>([])
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [savedRoutineIds, setSavedRoutineIds] = useState<number[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<{ users?: UserProfile[], posts?: Post[], routines?: Routine[] }>({});
    const [reloadTrigger, setReloadTrigger] = useState(0)
    const [selectedPost, setSelectedPost] = useState<Post | null>(null)

    useEffect(() => {
    fetchCurrentUserProfileBasic()
        .then(setProfile)
        .catch(console.error)
    }, [])

    useEffect(() => {
        if (!profile) return

        const loadData = async () => {
            try {
                if (activeTab === 'Publicaciones') {
                    if (activeSubTab === 'Mis publicaciones') {
                        const data = await fetchMyPostsWithExercises(profile.id)
                        setPosts(data)
                    } else {
                        const data = await fetchPostsByType(activeSubTab)
                        setPosts(data)
                    }
                } else if (activeTab === 'Rutinas') {
                        const result = await fetchRoutinesByType(
                            activeSubTab as 'Rutinas' | 'Rutinas guardadas' | 'Mis rutinas',
                            profile.id
                        )
                        setRoutines(result.routines)
                        if (result.savedIds) setSavedRoutineIds(result.savedIds)
                }
            } catch (err) {
                console.error(err)
            }
        }

        loadData()
    }, [activeTab, activeSubTab, profile, reloadTrigger])
    
    useEffect(() => {
        if (activeTab !== 'Explorar' || !searchQuery.trim()) {
            setSearchResults({})
            return
        }
    
        const controller = new AbortController();
        const typeMap: Record<string, string> = {
            Todo: '',
            Publicaciones: 'post',
            Rutinas: 'routine',
            Usuarios: 'user',
        };
    
        const type = typeMap[activeSubTab] || '';
    
        searchGlobalContent(searchQuery, type)
            .then(results => {
                const posts = results.posts as Post[] | undefined
                const enrichedPosts = posts?.map(post => {
                    if (post.routine && !post.routine.owner) {
                        return {
                            ...post,
                            routine: {
                                ...post.routine,
                                owner: {
                                    id: post.author.id,
                                    username: post.author.username
                                }
                            }
                        };
                    }
                    return post;
                });
                setSearchResults({
                    ...results,
                    posts: enrichedPosts
                });
            })
            .catch(console.error);
    
        return () => controller.abort();
    }, [searchQuery, activeTab, activeSubTab]);

    return (
        <div className="flex min-h-screen bg-black text-white">
            <div className="w-1/4 border-r border-gray-700 p-4">
                {!mostrarCrearPost && !selectedPost && (
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
                {selectedPost
                    ? (
                        <FullPost
                            post={selectedPost}
                            onClose={() => setSelectedPost(null)}
                        />
                    ) : mostrarCrearPost ? (
                        <CrearPost
                            onClose={() => setMostrarCrearPost(false)}
                            onPostCreated={() => {
                                setMostrarCrearPost(false)
                                setReloadTrigger(prev => prev + 1);
                            }}
                        />
                    ) : (
                        <>
                            {activeTab === 'Publicaciones' && posts.map(post => (
                                <PostCard 
                                    key={post.id} post={post} 
                                    onInteraction={() => 
                                    setReloadTrigger(prev => prev + 1)} 
                                    onCommentClick={() => setSelectedPost(post)}
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
                                    owner={routine.owner}
                                    exercises={routine.exercises || []}
                                    isOwnRoutine={routine.owner.id === profile?.id}
                                    onInteraction={() => setReloadTrigger(prev => prev + 1)}
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
                                            {searchResults.users?.filter(user => user.id !== profile?.id).map(user => (
                                                <UserCard key={user.id} {...user} />
                                            ))}
                                            {searchResults.posts?.map(post => (
                                                post.author ? (
                                                    <PostCard 
                                                        key={post.id} 
                                                        post={post} 
                                                        onInteraction={() => setReloadTrigger(prev => prev + 1)}
                                                        onCommentClick={() => setSelectedPost(post)}
                                                    />
                                                ) : null
                                            ))}
                                            {searchResults.routines?.map(routine => {
                                                if (!routine.owner) {
                                                    console.warn('Routine sin owner:', routine);
                                                    return null;
                                                }
                                                return (
                                                    <RoutineCard
                                                        key={routine.id}
                                                        id={routine.id}
                                                        title={routine.title}
                                                        description={routine.description}
                                                        isPublic={routine.isPublic}
                                                        updatedAt={routine.updatedAt}
                                                        owner={routine.owner}
                                                        exercises={routine.exercises || []}
                                                        isOwnRoutine={routine.owner.id === profile?.id}
                                                        onInteraction={() => setReloadTrigger(prev => prev + 1)}
                                                    />
                                                )
                                            })}
                                        </>
                                    )}
                                    {activeSubTab === 'Publicaciones' && searchResults.posts?.map(post => (
                                        post.author ? (
                                            <PostCard 
                                                key={post.id} 
                                                post={post} 
                                                onInteraction={() => setReloadTrigger(prev => prev + 1)}
                                                onCommentClick={() => setSelectedPost(post)}
                                            />
                                        ) : null
                                    ))}
                                    {activeSubTab === 'Rutinas' && searchResults.routines?.map(routine => {
                                        if (!routine.owner) {
                                            console.warn('Routine sin owner:', routine);
                                            return null;
                                        }
                                        return (
                                            <RoutineCard
                                                key={routine.id}
                                                id={routine.id}
                                                title={routine.title}
                                                description={routine.description}
                                                isPublic={routine.isPublic}
                                                updatedAt={routine.updatedAt}
                                                owner={routine.owner}
                                                exercises={routine.exercises || []}
                                                isOwnRoutine={routine.owner.id === profile?.id}
                                                onInteraction={() => setReloadTrigger(prev => prev + 1)}
                                            />
                                        )
                                    })}
                                    {activeSubTab === 'Usuarios' && searchResults.users
                                        ?.filter(user => user.id !== profile?.id)
                                        .map(user => (
                                            <UserCard key={user.id} {...user} />
                                        ))
                                    }
                                </div>
                            )}
                        </>
                    )}
                {!mostrarCrearPost && !selectedPost && activeTab === 'Publicaciones' && (
                    <button
                        onClick={() => setMostrarCrearPost(true)}
                        className="fixed bottom-5 right-[calc(25%+1.25rem)] bg-[#1F7D53] hover:bg-green-900 text-white p-5 rounded-full shadow-lg z-50 cursor-pointer"
                        aria-label="Crear publicación"
                    >
                        <FaPlus />
                    </button>
                )}
            </div>
            <div className="w-1/4 border-l border-gray-700 p-4">
                {!mostrarCrearPost && !selectedPost && (
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