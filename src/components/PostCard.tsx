'use client'

import { IoHeartOutline, IoBookmarkOutline } from 'react-icons/io5'
import { FaRegCommentDots } from 'react-icons/fa'
import { FiTrash2 } from 'react-icons/fi'
import RoutineCard from './RoutineCard'
import { useState, useEffect } from 'react'

interface RawExercise {
  exerciseId: string
  name?: string
}

interface FullExercise {
  id: string
  name: string
  target: string
  secondaryMuscles: string[]
  equipment: string
  bodyPart: string
  instructions: string
}

interface Routine {
  id: number
  title: string
  description: string
  isPublic: boolean
  updatedAt: string
  owner: string
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
  const [fullExercises, setFullExercises] = useState<FullExercise[] | null>(null)

  useEffect(() => {
    const fetchExercises = async () => {
      if (!attachedRoutine || !attachedRoutine.exercises) return

      const token = localStorage.getItem('token')
      const API_URL = process.env.NEXT_PUBLIC_API_URL

      const detailed = await Promise.all(
        attachedRoutine.exercises.map(async (e) => {
          const res = await fetch(`${API_URL}/api/exercises/${e.exerciseId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          return await res.json()
        })
      )
      setFullExercises(detailed)
    }

    fetchExercises()
  }, [attachedRoutine])

  return (
    <div className="bg-[#27391C] p-4 rounded-lg shadow-md text-white relative mb-3">
      <button onClick={onDelete} className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
        <FiTrash2 />
      </button>
      <div className="flex items-center mb-3">
        <img src={profilePic} alt="Foto de perfil" className="w-10 h-10 rounded-full mr-3 border border-gray-600" />
        <div>
          <p className="font-semibold text-white">
            @{username}
            <span className="text-sm text-white/60 ml-2">· {name} · {createdAt}</span>
          </p>
        </div>
      </div>
      <p className="text-sm">{content}</p>
      {attachedRoutine && fullExercises && (
        <div className="mt-4">
          <RoutineCard
            id={attachedRoutine.id}
            title={attachedRoutine.title}
            description={attachedRoutine.description}
            isPublic={attachedRoutine.isPublic}
            updatedAt={attachedRoutine.updatedAt}
            owner={attachedRoutine.owner}
            exercises={fullExercises.map(e => ({ exerciseId: e.id, name: e.name }))}
          />
        </div>
      )}
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
