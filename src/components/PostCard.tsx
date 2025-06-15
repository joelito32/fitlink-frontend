'use client'

import { IoHeartOutline, IoHeartSharp, IoBookmark, IoBookmarkOutline } from 'react-icons/io5'
import { FaRegCommentDots } from 'react-icons/fa'
import { FiTrash2 } from 'react-icons/fi'
import RoutineCard from './RoutineCard'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  isPostLiked,
  isPostSaved,
  getPostLikesCount,
  getPostSavesCount,
  toggleLikePost,
  toggleSavePost
} from '@/lib/api/api';
import { Post, PostCardProps } from '@/lib/api/types'

export default function PostCard({
  post,
  onDelete,
  onInteraction,
  onCommentClick
}: PostCardProps) {
  const router = useRouter()
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [savedCount, setSavedCount] = useState(0);

  const formatCreatedAt = (createdAt: string): string => {
    const createdDate = new Date(createdAt)
    const now = new Date()
    const diffInMs = now.getTime() - createdDate.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))

    if (diffInHours < 24) {
      return diffInHours === 0
        ? 'Hace menos de una hora'
        : `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`
    } else {
      return createdDate.toLocaleDateString('es-ES')
    }
  }

  useEffect(() => {
    const fetchPostInteractionData = async () => {
      try {
        const [liked, saved, likesRes, savesRes] = await Promise.all([
          isPostLiked(post.id),
          isPostSaved(post.id),
          getPostLikesCount(post.id),
          getPostSavesCount(post.id)
        ]);

        setLiked(liked);
        setSaved(saved);
        setLikesCount(likesRes);
        setSavedCount(savesRes);

      } catch (error) {
        console.error('Error al obtener datos del post:', error);
      }
    };

    fetchPostInteractionData();
  }, [post.id]);

  const handleToggleLike = async () => {
    try {
      await toggleLikePost(post.id, liked);
      const updatedLikes = await getPostLikesCount(post.id);
      setLiked(!liked);
      setLikesCount(updatedLikes);
      onInteraction?.();
    } catch (err) {
      console.error('Error al dar like:', err);
    }
  };

  const handleToggleSave = async () => {
    try {
      await toggleSavePost(post.id, saved);
      const updatedSaves = await getPostSavesCount(post.id);
      setSaved(!saved);
      setSavedCount(updatedSaves);
      onInteraction?.();
    } catch (err) {
      console.error('Error al guardar post:', err);
    }
  };
  
  return (
    <div className="bg-[#27391C] p-4 rounded-lg shadow-md text-white relative mb-3 border-2 border-[#1F7D53]">
      <button onClick={onDelete} className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
        <FiTrash2 />
      </button>
      <div className="flex items-center mb-3">
        <img src={post.author.profilePic || ''} alt="Foto de perfil" className="w-10 h-10 rounded-full mr-3 border border-gray-600" />
        <div>
          <div className="flex justify-center items-center gap-3">
            <p 
              className="font-semibold text-white hover:underline cursor-pointer"
              onClick={() => router.push(`/inicio/perfil/${post.author.id}`)}
            >
              @{post.author.username}
            </p>
            <p className="text-gray-400 text-sm"> {post.author.name}</p>
          </div>
          
          <p className="text-gray-400 text-sm">{formatCreatedAt(post.createdAt)}</p>
        </div>
      </div>
      <p className="mb-4">{post.content}</p>

      {post.routine && post.routine.exercises && (
        <RoutineCard {...post.routine} />
      )}

      <div className="flex justify-between mt-4 text-gray-400 text-xl">
          <div
            className="cursor-pointer flex items-center gap-1"
            onClick={handleToggleLike}
          >
            {liked ? <IoHeartSharp className="text-red-500"/> : <IoHeartOutline />}
            <span className="text-gray-400 text-sm">{likesCount}</span>
          </div>
          <div
            className="cursor-pointer flex items-center gap-1"
            onClick={() => onCommentClick?.()}
          >
            <FaRegCommentDots className="cursor-pointer" />
            <span className="text-gray-400 text-sm">{post.commentsCount}</span>
          </div>
          <div
            className="cursor-pointer flex items-center gap-1"
            onClick={handleToggleSave}
          >
            {saved ? <IoBookmark className="text-yellow-400"/> : <IoBookmarkOutline />}
            <span className="text-gray-400 text-sm">{savedCount}</span>
          </div>
      </div>
    </div>
  )
}
