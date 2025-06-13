'use client'
import React, { useEffect, useState } from 'react'
import SemanaRutinas from '@/components/SemanaRutinas'
import RoutineCard from '@/components/RoutineCard'
import RoutineMenu from '@/components/RoutineMenu'
import CrearRutina from '@/components/CrearRutina'
import EditarRutina from '@/components/EditarRutina'
import ConfirmarBorrar from '@/components/ConfirmarBorrar'

interface RawExercise {
  id: string
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
  createdAt: string
  updatedAt: string
  owner: {
    id: number
    username: string
  }
  exercises: RawExercise[]
}

interface RoutineForEdit {
  id: number
  title: string
  description: string
  isPublic: boolean
  exercises: FullExercise[]
}

export default function RutinasPage() {
  const [rutinas, setRutinas] = useState<Routine[]>([])
  const [rutinasGuardadas, setRutinasGuardadas] = useState<Routine[]>([])
  const [modoCreacion, setModoCreacion] = useState(false)
  const [rutinaEditando, setRutinaEditando] = useState<RoutineForEdit | null>(null)
  const [borrarRutina, setBorrarRutina] = useState<Routine | null>(null)
  const [activeTab, setActiveTab] = useState('Mis rutinas')
  const [userId, setUserId] = useState<number | null>(null)

  const fetchUserId = async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) return
    const data = await res.json()
    setUserId(data.id)
  }

  const fetchRutinas = async (id: number) => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/routines/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Error al obtener rutinas')
      const rutinasCrudas = await res.json()
      const rutinasConDatosCompletos = await Promise.all(
        rutinasCrudas.map(async (rutina: any) => {
          const ejerciciosCompletos = await Promise.all(
            rutina.exercises.map(async (e: any) => {
              const exRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exercises/${e.id}`, {
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
                instructions: exData.instructions || ''
              }
            })
          )
          return {
            ...rutina,
            exercises: ejerciciosCompletos
          }
        })
      )
      setRutinas(rutinasConDatosCompletos)
    } catch (error) {
      console.error("Error al cargar rutinas:", error)
    }
  }

  const fetchRutinasGuardadas = async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/saved-routines`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Error al obtener rutinas guardadas')
      const rutinasGuardadasCrudas = await res.json()
      const rutinasCompletas = await Promise.all(
        rutinasGuardadasCrudas.map(async (rutina: any) => {
          const ejerciciosCompletos = await Promise.all(
            rutina.exercises.map(async (e: any) => {
              const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exercises/${e.exerciseId || e.id}`, {
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
          return {
            ...rutina,
            exercises: ejerciciosCompletos
          }
        })
      )
      setRutinasGuardadas(rutinasCompletas)
    } catch (error) {
      console.error("Error al cargar rutinas guardadas:", error)
    }
  }

  useEffect(() => {
    const init = async () => {
      await fetchUserId()
    }
    init()
  }, [])

  useEffect(() => {
    if (userId !== null) {
      fetchRutinas(userId)
      fetchRutinasGuardadas()
    }
  }, [userId])

  const handleEditClick = async (rutina: Routine) => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const ejerciciosCompletos = await Promise.all(
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
    const token = localStorage.getItem('token')
    if (!token || userId === null) return

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/routines/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchRutinas(userId)
      setBorrarRutina(null)
    } catch (error) {
      console.error("Error al borrar rutina:", error)
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
              if (userId !== null) fetchRutinas(userId)
              setModoCreacion(false)
            }}
          />
        ) : rutinaEditando ? (
          <EditarRutina
            routine={rutinaEditando}
            onClose={() => setRutinaEditando(null)}
            onRoutineUpdated={() => {
              if (userId !== null) fetchRutinas(userId)
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
                    updatedAt={rutina.updatedAt || rutina.createdAt}
                    owner={rutina.owner}
                    exercises={rutina.exercises}
                    onEditClick={() => handleEditClick(rutina)}
                    onDeleteClick={() => setBorrarRutina(rutina)}
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
