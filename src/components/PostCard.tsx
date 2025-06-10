// components/PostCard.tsx
'use client'

import { IoHeartOutline, IoBookmarkOutline } from 'react-icons/io5'
import { FaRegCommentDots } from 'react-icons/fa'
import { FiTrash2 } from 'react-icons/fi'

interface PostCardProps {
    username: string
    name: string
    profilePic: string
    content: string
    createdAt: string
    likes: number
    comments: number
    saved: number
    onDelete?: () => void
}

export default function PostCard({ username, name, profilePic, content, createdAt, likes, comments, saved, onDelete }: PostCardProps) {
    return (
        <div className="bg-[#27391C] p-4 rounded-lg shadow-md text-white relative">
            <button onClick={onDelete} className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
                <FiTrash2 />
            </button>
            <div className="flex items-center mb-3">
                <img
                    src={profilePic}
                    alt="Foto de perfil"
                    className="w-10 h-10 rounded-full mr-3 border border-gray-600"
                />
                <div>
                    <p className="font-semibold text-white">
                        @{username}
                        <span className="text-sm text-white/60 ml-2">· {name} · {createdAt}</span>
                    </p>
                </div>
            </div>
            <p className="text-sm">{content}</p>
            <div className="flex items-center justify-between text-sm text-gray-400 pt-4">
                <div className="flex items-center gap-2">
                    <IoHeartOutline className="text-xl" />
                    <span>{likes}</span>
                </div>
                <div className="flex items-center gap-2">
                    <FaRegCommentDots className="text-xl" />
                    <span>{comments}</span>
                </div>
                <div className="flex items-center gap-2">
                    <IoBookmarkOutline className="text-xl" />
                    <span>{saved}</span>
                </div>
            </div>
        </div>
    )
}
