'use client'

import { useState, useEffect } from 'react'
import { FaLock, FaLockOpen } from 'react-icons/fa'
import { FiTrash } from 'react-icons/fi'
import { GrEdit } from 'react-icons/gr'
import { IoIosArrowDown } from 'react-icons/io'
import ExerciseCard from './ExerciseCard'

interface Exercise {
  exerciseId: string
  name?: string
  target?: string
  secondaryMuscles?: string[]
  equipment?: string
  bodyPart?: string
  instructions?: string
}

interface RoutineCardProps {
  id: number
  title: string
  description: string
  isPublic: boolean
  updatedAt: string
  owner: string
  exercises: Exercise[]
  onEditClick?: () => void
  onDeleteClick?: () => void
}

export default function RoutineCard({
  id,
  title,
  description,
  isPublic,
  updatedAt,
  owner,
  exercises,
  onEditClick,
  onDeleteClick
}: RoutineCardProps) {
  const [gifUrls, setGifUrls] = useState<string[]>([])
  const [mostrarDetalles, setMostrarDetalles] = useState(false)

  useEffect(() => {
    const fetchGifs = async () => {
      try {
        const gifs: string[] = []
        for (let i = 0; i < exercises.length; i++) {
          const id = exercises[i].exerciseId
          const res = await fetch(`https://exercisedb.p.rapidapi.com/exercises/exercise/${id}`, {
            headers: {
              'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
              'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
            },
          })
          const data = await res.json()
          gifs.push(data?.gifUrl || '')
        }
        setGifUrls(gifs)
      } catch (error) {
        console.error('Error al cargar los gifs:', error)
      }
    }

    fetchGifs()
  }, [exercises])

  return (
    <div className="relative bg-[#27391C] rounded-lg p-4 hover:shadow-lg transition-shadow  border-2 border-[#1F7D53] ">
      <div className="absolute top-3 right-3 flex items-center gap-3 text-white text-lg">
        {onDeleteClick && (
          <button onClick={onDeleteClick} className="hover:text-red-400">
            <FiTrash />
          </button>
        )}
        {isPublic ? <FaLockOpen /> : <FaLock />}
      </div>

      <div className="flex items-center gap-2 mb-2  ">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>
            @{owner} · {new Date(updatedAt).toLocaleDateString('es-ES')}
          </span>
          {onEditClick && (
            <button
              onClick={onEditClick}
              className="flex items-center gap-1 text-[#1F7D53] hover:underline"
            >
              <GrEdit />
              Editar rutina
            </button>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-300 mb-4">{description}</p>

      {!mostrarDetalles ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {exercises.map((ex, i) => (
            <div
              key={ex.exerciseId}
              className="w-full aspect-square bg-gray-700 rounded overflow-hidden flex items-center justify-center"
            >
              {gifUrls[i] ? (
                <img
                  src={gifUrls[i]}
                  alt={`Ejercicio ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-gray-500">Cargando...</span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4 mt-4">
          {exercises.map((ex) => (
            <ExerciseCard
              key={ex.exerciseId}
              id={ex.exerciseId}
              name={ex.name || ''}
              target={ex.target || ''}
              secondaryMuscles={ex.secondaryMuscles || []}
              equipment={ex.equipment || ''}
              bodyPart={ex.bodyPart || ''}
              instructions={ex.instructions || ''}
              showExpandable
            />
          ))}
        </div>
      )}

      <div className="mt-2">
        <button
          onClick={() => setMostrarDetalles(prev => !prev)}
          className="flex items-center text-sm text-[#1F7D53] hover:underline"
        >
          <IoIosArrowDown className={`mr-1 transition-transform ${mostrarDetalles ? 'rotate-180' : ''}`} />
          {mostrarDetalles ? 'Mostrar menos' : 'Mostrar más'}
        </button>
      </div>
    </div>
  )
}
