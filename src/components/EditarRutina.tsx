'use client'
import React, { useState } from 'react'
import MenuEjercicios from './MenuEjercicios'
import ExerciseCard from './ExerciseCard'
import { IoClose } from 'react-icons/io5'
import { FaPlus } from 'react-icons/fa'
import ConfirmarCerrar from './ConfirmarCerrar'

interface Exercise {
  id: string
  name: string
  target: string
  secondaryMuscles: string[]
  equipment: string
  bodyPart: string
  instructions: string
}

interface RoutineEditProps {
  routine: {
    id: number
    title: string
    description: string
    isPublic: boolean
    exercises: Exercise[]
  }
  onClose: () => void
  onRoutineUpdated: () => void
}

export default function EditarRutina({ routine, onClose, onRoutineUpdated }: RoutineEditProps) {
  const [menuVisible, setMenuVisible] = useState(false)
  const [title, setTitle] = useState(routine.title)
  const [description, setDescription] = useState(routine.description)
  const [isPublic, setIsPublic] = useState(routine.isPublic)
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>(routine.exercises)
  const [showConfirm, setShowConfirm] = useState(false)

  function handleSelectExercise(ex: Exercise) {
    if (!selectedExercises.some(e => e.id === ex.id))
      setSelectedExercises(prev => [...prev, ex])
  }

  const handleRemove = (id: string) =>
    setSelectedExercises(prev => prev.filter(e => e.id !== id))

  async function handleGuardar() {
    const token = localStorage.getItem('token')
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/routines/${routine.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title,
        description,
        isPublic,
        exercises: selectedExercises.map(e => ({
          exerciseId: e.id,
          sets: 3,
          reps: 10
        }))
      })
    })
    onRoutineUpdated()
    onClose()
  }

  return (
    <div className="w-full p-6">
      <div className='relative'>
        <button
          onClick={() => setShowConfirm(true)}
          className="absolute top-4 right-4 text-gray-500 hover:text-[#1F7D53] text-2xl font-bold"
        >
          <IoClose size={30} />
        </button>
        <h1 className="text-3xl font-bold mb-6 text-center text-[#1F7D53]">Editar rutina</h1>

        <form className="space-y-4">
          <input
            type="text"
            placeholder="Título de la rutina"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-4 py-2 rounded mb-4 bg-black text-[#1F7D53]"
          />
          <textarea
            placeholder="Descripción de la rutina"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-4 py-2 rounded mb-4 bg-black text-[#1F7D53] h-24"
          />
        </form>

        <h2 className="text-xl font-semibold mb-4 text-[#1F7D53]">Añadir ejercicios</h2>

        <div className="flex flex-col gap-4 mb-6">
          {selectedExercises.map((exercise, index) => (
            <div key={exercise.id}>
              <ExerciseCard
                {...exercise}
                showExpandable
                onRemove={() => handleRemove(exercise.id)}
              />
              {index === selectedExercises.length - 1 && (
                <div
                  onClick={() => setMenuVisible(true)}
                  className="w-14 h-14 flex items-center justify-center border-2 border-dashed border-[#1F7D53] rounded cursor-pointer text-[#1F7D53] hover:bg-[#27391C] mt-4"
                >
                  <FaPlus className="text-xl" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="relative w-full h-10 rounded-full border-2 border-[#1F7D53] overflow-hidden cursor-pointer mt-4" onClick={() => setIsPublic(!isPublic)}>
          <div
            className={`absolute top-0 left-0 h-full w-1/2 rounded-full bg-[#1F7D53] transition-transform duration-300 ease-in-out ${
              isPublic ? 'translate-x-0' : 'translate-x-full'
            }`}
          />
          <div className="relative z-10 flex h-full">
            <div className="flex-1 flex items-center justify-center text-sm font-medium">
              Pública
            </div>
            <div className="flex-1 flex items-center justify-center text-sm font-medium">
              Privada
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleGuardar}
            className="bg-[#1F7D53] hover:bg-[#27391C] text-white px-6 py-2 rounded-full font-semibold transition"
          >
            Guardar cambios
          </button>
        </div>

        {menuVisible && (
          <MenuEjercicios onClose={() => setMenuVisible(false)} onSelectExercise={handleSelectExercise} />
        )}
        {showConfirm && (
          <ConfirmarCerrar onCancel={() => setShowConfirm(false)} onConfirm={onClose} />
        )}
      </div>
    </div>
  )
}
