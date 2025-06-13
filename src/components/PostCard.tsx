'use client'

import { IoHeartOutline, IoBookmarkOutline } from 'react-icons/io5'
import { FaRegCommentDots } from 'react-icons/fa'
import { FiTrash2 } from 'react-icons/fi'
import RoutineCard from './RoutineCard'
import { useState } from 'react'

interface RawExercise {
  id: string
  name?: string
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
  exercises: RawExercise[]
}

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
  attachedRoutine?: Routine
}

export default function PostCard({
  username,
  name,
  profilePic,
  content,
  createdAt,
  likes,
  comments,
  saved,
  onDelete,
  attachedRoutine,
}: PostCardProps) {

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
  
  return (
    <div className="bg-[#27391C] p-4 rounded-lg shadow-md text-white relative mb-3 border-2 border-[#1F7D53]">
      <button onClick={onDelete} className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
        <FiTrash2 />
      </button>
      <div className="flex items-center mb-3">
        <img src={profilePic} alt="Foto de perfil" className="w-10 h-10 rounded-full mr-3 border border-gray-600" />
        <div>
          <p className="font-semibold text-white">@{username} ·<span className="text-gray-400 text-sm"> {name}</span></p>
          <p className="text-gray-400 text-sm">{formatCreatedAt(createdAt)}</p>
        </div>
      </div>
      <p className="mb-4">{content}</p>

      {attachedRoutine && attachedRoutine.exercises && (
        <RoutineCard
          id={attachedRoutine.id}
          title={attachedRoutine.title}
          description={attachedRoutine.description}
          isPublic={attachedRoutine.isPublic}
          updatedAt={attachedRoutine.updatedAt}
          owner={typeof attachedRoutine.owner === 'object' ? attachedRoutine.owner.username : attachedRoutine.owner}
          exercises={attachedRoutine.exercises}
        />
      )}

      <div className="flex justify-between mt-4 text-gray-400 text-xl">
          <div><IoHeartOutline className="cursor-pointer" /><span className="text-gray-400 text-sm">{likes}</span></div>
          <div><FaRegCommentDots className="cursor-pointer" /><span className="text-gray-400 text-sm">{comments}</span></div>
          <div><IoBookmarkOutline className="cursor-pointer" /><span className="text-gray-400 text-sm">{saved}</span></div>
      </div>
    </div>
  )
}
