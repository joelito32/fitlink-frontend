// app/feed/page.tsx
'use client'
import FeedMenu from "@/components/FeedMenu"
import { useState } from "react"
import PostCard from "@/components/PostCard"
import { FaPlus } from 'react-icons/fa';
import CrearPost from "@/components/CrearPost";

export default function FeedPage() {
    const [activeTab, setActiveTab] = useState('Publicaciones')
    const [mostrarCrearPost, setMostrarCrearPost] = useState(false)

    return (
        <div className="flex min-h-screen bg-black text-white">
            <div className="w-1/4 border-r border-gray-700 p-4">
                {mostrarCrearPost ? (
                    <></>
                ) : (
                    <>
                    <FeedMenu activeTab={activeTab} onTabChange={setActiveTab} />
                    </>
                )}
                
            </div>
            <div className="w-2/4 p-4">
                {mostrarCrearPost ? (
                    <CrearPost
                        onClose={() => setMostrarCrearPost(false)}
                        onPostCreated={() => {
                        // opcionalmente refrescar posts
                        setMostrarCrearPost(false)
                        }}
                    />
                ) : (
                    <>
                        {activeTab === 'Publicaciones' && 
                            <div>
                                <PostCard
                                    username="joelito32"
                                    name="joel"
                                    profilePic="/images/profile.jpg"
                                    content="Este es un post de prueba en FitLink."
                                    createdAt="10/06/2025"
                                    likes={5}
                                    comments={2}
                                    saved={4}
                                    onDelete={() => {}}
                                />
                            </div>
                        }
                        {activeTab === 'Gustados' && <p>Contenido de publicaciones gustadas</p>}
                        {activeTab === 'Guardados' && <p>Contenido de publicaciones guardadas</p>}
                        {activeTab === 'Comentados' && <p>Contenido de publicaciones comentadas</p>}
                        {activeTab === 'Mis publicaciones' && <p>Contenido de mis publicaciones</p>}
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
