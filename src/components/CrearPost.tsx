'use client'

import React, { useState, useEffect } from 'react'
import { IoClose } from 'react-icons/io5'
import ConfirmarCerrar from './ConfirmarCerrar'
import { FaPlus } from 'react-icons/fa'
import MenuRutinas from './MenuRutinas'
import RoutineCard from './RoutineCard'

interface CrearPostProps {
  onClose: () => void
  onPostCreated?: () => void
}

interface RawExercise {
  exerciseId: string
  name?: string
}

interface Routine {
  id: number
  title: string
  description: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
  owner: {
    id: number
    username: string
  }
  exercises: RawExercise[]
}

export default function CrearPost({ onClose, onPostCreated }: CrearPostProps) {
  const [content, setContent] = useState('')
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)
  const [menuVisible, setMenuVisible] = useState(false)
  const [rutinaAdjunta, setRutinaAdjunta] = useState<Routine | null>(null)
  const [myRoutines, setMyRoutines] = useState<Routine[]>([])
  const [savedRoutines, setSavedRoutines] = useState<Routine[]>([])

  const handleGuardarPost = async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          content,
          routineId: rutinaAdjunta?.id
        })
      })

      if (!res.ok) throw new Error('Error al crear post')

      onClose()
      onPostCreated?.()
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const fetchRoutines = async () => {
      const token = localStorage.getItem('token')
      if (!token) return

      const [myRes, savedRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/routines`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/routines/saved`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      const enrichRoutine = async (routine: any) => {
        const ejerciciosCompletos = await Promise.all(
          routine.exercises.map(async (e: any) => {
            const exRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exercises/${e.exerciseId}`, {
              headers: { Authorization: `Bearer ${token}` }
            })
            const exData = await exRes.json()
            return {
              id: exData.id,
              name: exData.name,
              target: exData.target,
              secondaryMuscles: exData.secondaryMuscles || [],
              equipment: exData.equipment,
              bodyPart: exData.bodyPart,
              instructions: exData.instructions || '',
              exerciseId: exData.id
            }
          })
        )

        return {
          ...routine,
          exercises: ejerciciosCompletos,
          owner: typeof routine.owner === 'string' ? { id: 0, username: routine.owner } : routine.owner
        }
      }

      if (myRes.ok) {
        const myData = await myRes.json()
        const enrichedMy = await Promise.all(myData.map(enrichRoutine))
        setMyRoutines(enrichedMy)
      }

      if (savedRes.ok) {
        const savedData = await savedRes.json()
        const enrichedSaved = await Promise.all(savedData.map(enrichRoutine))
        setSavedRoutines(enrichedSaved)
      }
    }

    fetchRoutines()
  }, [])

  return (
    <div className="w-full p-6">
      <div className="relative">
        <button
          onClick={() => setMostrarConfirmacion(true)}
          className="absolute top-4 right-4 text-gray-500 hover:text-[#1F7D53] text-2xl font-bold"
        >
          <IoClose size={30} />
        </button>
        <h1 className="text-3xl font-bold mb-6 text-center text-[#1F7D53]">Crea tu publicación</h1>
        <textarea
          placeholder="Contenido de la publicación"
          value={content}
          onChange={e => setContent(e.target.value)}
          className="w-full border px-4 py-2 rounded mb-4 bg-black text-[#1F7D53] h-24"
        />
        <h2 className="text-xl font-semibold mb-4 text-[#1F7D53]">Añadir rutina</h2>
        {rutinaAdjunta ? (
          <div className="mb-6">
            <div className="border-2 border-[#1F7D53] rounded-xl">
              <RoutineCard
                id={rutinaAdjunta.id}
                title={rutinaAdjunta.title}
                description={rutinaAdjunta.description}
                isPublic={rutinaAdjunta.isPublic}
                updatedAt={rutinaAdjunta.updatedAt}
                owner={typeof rutinaAdjunta.owner === 'object' ? rutinaAdjunta.owner.username : rutinaAdjunta.owner}
                exercises={rutinaAdjunta.exercises}
              />
            </div>
            <button
              onClick={() => setRutinaAdjunta(null)}
              className="text-sm text-[#1F7D53] hover:text-red-500 cursor-pointer text-center mt-2"
            >
              Quitar rutina
            </button>
          </div>
        ) : (
          <div
            onClick={() => setMenuVisible(true)}
            className="w-14 h-14 flex items-center justify-center border-2 border-dashed border-[#1F7D53] rounded cursor-pointer text-[#1F7D53] hover:bg-[#27391C]"
          >
            <FaPlus className="text-xl" />
          </div>
        )}
        
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleGuardarPost}
            className="bg-[#1F7D53] hover:bg-[#27391C] text-white px-6 py-2 rounded-full font-semibold transition"
          >
            Publicar
          </button>
        </div>
      </div>

      {menuVisible && (
        <MenuRutinas
          onClose={() => setMenuVisible(false)}
          myRoutines={myRoutines}
          savedRoutines={savedRoutines}
          onSelect={rutina => {
            setRutinaAdjunta(rutina)
            setMenuVisible(false)
          }}
        />
      )}

      {mostrarConfirmacion && (
        <ConfirmarCerrar
          onCancel={() => setMostrarConfirmacion(false)}
          onConfirm={onClose}
        />
      )}
    </div>
  )
}
