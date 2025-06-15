'use client'
import React, { useEffect, useState } from 'react'
import SemanaRutinas from '@/components/SemanaRutinas'
import RoutineCard from '@/components/RoutineCard'
import RoutineMenu from '@/components/RoutineMenu'
import CrearRutina from '@/components/CrearRutina'
import EditarRutina from '@/components/EditarRutina'
import ConfirmarBorrar from '@/components/ConfirmarBorrar'
import {
  fetchCurrentUserId,
  fetchUserRoutines,
  fetchSavedRoutines,
  deleteRoutine
} from '@/lib/api/api'
import { 
  Routine,
  RoutineForEdit,
  FullExercise
} from '@/lib/api/types'



export default function RutinasPage() {
  const [rutinas, setRutinas] = useState<Routine[]>([])
  const [rutinasGuardadas, setRutinasGuardadas] = useState<Routine[]>([])
  const [modoCreacion, setModoCreacion] = useState(false)
  const [rutinaEditando, setRutinaEditando] = useState<RoutineForEdit | null>(null)
  const [borrarRutina, setBorrarRutina] = useState<Routine | null>(null)
  const [activeTab, setActiveTab] = useState('Mis rutinas')
  const [userId, setUserId] = useState<number | null>(null)
  const [reloadTrigger, setReloadTrigger] = useState(0)

  useEffect(() => {
    const init = async () => {
      try {
        const id = await fetchCurrentUserId()
        setUserId(id)
      } catch (err) {
        console.error(err)
      }
    }
    init()
  }, [])

  const cargarRutinas = async (id: number) => {
    try {
      const data = await fetchUserRoutines(id)
      setRutinas(data)
    } catch (err) {
      console.error(err)
    }
  }

  const cargarRutinasGuardadas = async () => {
    try {
      const data = await fetchSavedRoutines()
      setRutinasGuardadas(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (userId !== null) {
      cargarRutinas(userId)
      cargarRutinasGuardadas()
    }
  }, [userId, reloadTrigger])

  const handleEditClick = async (rutina: Routine) => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const ejerciciosCompletos: FullExercise[] = await Promise.all(
        rutina.exercises.map(async (e) => {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exercises/${e.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          const data = await res.json()
          return {
            id: data.id,
            name: data.name,
            target: data.target,
            secondaryMuscles: data.secondaryMuscles || [],
            equipment: data.equipment,
            bodyPart: data.bodyPart,
            instructions: data.instructions || ''
          }
        })
      )

      setRutinaEditando({
        id: rutina.id,
        title: rutina.title,
        description: rutina.description,
        isPublic: rutina.isPublic,
        exercises: ejerciciosCompletos
      })
    } catch (error) {
      console.error('Error al cargar ejercicios desde el backend:', error)
    }
  }

  const handleDeleteRoutine = async (id: number) => {
    if (!userId) return
    try {
      await deleteRoutine(id)
      await cargarRutinas(userId)
      setBorrarRutina(null)
    } catch (err) {
      console.error('Error al borrar rutina:', err)
    }
  }

  const rutinasAMostrar = activeTab === 'Mis rutinas'
    ? rutinas.filter(r => r.owner.id === userId)
    : rutinasGuardadas

  return (
    <div className="flex w-full min-h-screen bg-black text-white">
      <div className="w-1/4 p-4 border-r border-gray-700" />

      <div className="w-2/4 px-4 py-4">
        {modoCreacion ? (
          <CrearRutina
            onClose={() => setModoCreacion(false)}
            onRoutineCreated={() => {
              if (userId !== null) cargarRutinas(userId)
              setModoCreacion(false)
            }}
          />
        ) : rutinaEditando ? (
          <EditarRutina
            routine={rutinaEditando}
            onClose={() => setRutinaEditando(null)}
            onRoutineUpdated={() => {
              if (userId !== null) cargarRutinas(userId)
              setRutinaEditando(null)
            }}
          />
        ) : (
          <>
            <SemanaRutinas />
            <div className="flex justify-center my-4">
              <button
                onClick={() => setModoCreacion(true)}
                className="bg-[#27391C] hover:bg-[#1F7D53] text-white font-semibold py-2 px-4 rounded"
              >
                Crear nueva rutina
              </button>
            </div>
            <RoutineMenu activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="mt-6 space-y-4">
              {rutinasAMostrar.length === 0 ? (
                <p className="text-center text-gray-400">
                  {activeTab === 'Mis rutinas'
                    ? 'Aún no has creado ninguna rutina.'
                    : 'Aún no has guardado ninguna rutina.'}
                </p>
              ) : (
                rutinasAMostrar.map((rutina: Routine) => (
                  <RoutineCard
                    key={rutina.id}
                    id={rutina.id}
                    title={rutina.title}
                    description={rutina.description}
                    isPublic={rutina.isPublic}
                    updatedAt={rutina.updatedAt}
                    owner={rutina.owner}
                    exercises={rutina.exercises}
                    isOwnRoutine={rutina.owner.id === userId}
                    onEditClick={() => handleEditClick(rutina)}
                    onDeleteClick={() => setBorrarRutina(rutina)}
                    onInteraction={() => setReloadTrigger(prev => prev + 1)}
                  />
                ))
              )}
            </div>
            {borrarRutina && (
              <ConfirmarBorrar
                onCancel={() => setBorrarRutina(null)}
                onConfirm={() => handleDeleteRoutine(borrarRutina.id)}
              />
            )}
          </>
        )}
      </div>

      <div className="w-1/4 p-4 border-l border-gray-700" />
    </div>
  )
}
