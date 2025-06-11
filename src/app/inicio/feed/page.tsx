// app/feed/page.tsx
'use client'
import FeedMenu from "@/components/FeedMenu"
import { useState, useEffect } from "react"
import PostCard from "@/components/PostCard"
import { FaPlus } from 'react-icons/fa';
import CrearPost from "@/components/CrearPost";

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
        owner: string // ← debe ser string para coincidir con RoutineCard
        exercises: { exerciseId: string }[]
    }
}

interface UserProfile {
    id: number
    username: string
    name?: string
    profilePic?: string
}

export default function FeedPage() {
    const [activeTab, setActiveTab] = useState('Publicaciones')
    const [mostrarCrearPost, setMostrarCrearPost] = useState(false)
    const [posts, setPosts] = useState<Post[]>([])
    const [profile, setProfile] = useState<UserProfile | null>(null)
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
        const token = localStorage.getItem('token')
        if (!token || !profile) return

        let url = '/api/posts'
        switch(activeTab) {
            case 'Gustados':
                url = '/api/interactions/liked'
                break
            case 'Guardados':
                url = '/api/interactions/saved'
                break
            case 'Comentados':
                url = '/api/posts/commented'
                break
            case 'Mis publicaciones':
                url = `/api/posts/user/${profile.id}`
                break
        }

        fetch(`${API_URL}${url}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(setPosts)
    }, [activeTab, API_URL, profile])


    return (
        <div className="flex min-h-screen bg-black text-white">
            <div className="w-1/4 border-r border-gray-700 p-4">
                {!mostrarCrearPost && (
                    <FeedMenu activeTab={activeTab} onTabChange={setActiveTab} />
                )}
                
            </div>
            <div className="w-2/4 p-4">
                {mostrarCrearPost ? (
                    <CrearPost
                        onClose={() => setMostrarCrearPost(false)}
                        onPostCreated={() => {setMostrarCrearPost(false)
                        }}
                    />
                ) : (
                    <>
                        {posts.map(post => (
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
                        <button
                            onClick={() => setMostrarCrearPost(true)}
                            className="fixed bottom-8 right-[calc(25%+2rem)] bg-[#1F7D53] text-white w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg hover:bg-[#166b45] transition"
                        >
                            <FaPlus />
                        </button>
                    </>
                )}
            </div>
            <div className="w-1/4 border-l border-gray-700 p-4"></div>

        </div>
    )
}
