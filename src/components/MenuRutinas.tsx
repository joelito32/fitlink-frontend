'use client'

import { useEffect, useState } from 'react'
import RoutineCard from './RoutineCard'
import RoutineMenu from './RoutineMenu'
import { IoClose } from 'react-icons/io5'

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

interface MenuRutinasProps {
  onClose: () => void
  onSelect: (rutina: Routine) => void
  myRoutines: Routine[]
  savedRoutines: Routine[]
}

export default function MenuRutinas({ onClose, onSelect, myRoutines, savedRoutines }: MenuRutinasProps) {
  const [activeTab, setActiveTab] = useState('Mis rutinas')
  const rutinasAMostrar = activeTab === 'Mis rutinas' ? myRoutines.filter(r => r.isPublic) : savedRoutines

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center text-black">
      <div className="bg-[#27391C] w-full max-w-4xl max-h-[90vh] rounded-2xl p-6 shadow-xl overflow-y-auto relative scrollbar-hide border-2 border-[#1F7D53]">
        <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-[#1F7D53] text-2xl font-bold"
        >
            <IoClose size={30}/>
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-[#1F7D53]">Escoge una rutina</h2>
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
              <div key={rutina.id} onClick={() => onSelect(rutina)} className="cursor-pointer border-2 border-[#1F7D53] rounded-xl">
                <RoutineCard
                  id={rutina.id}
                  title={rutina.title}
                  description={rutina.description}
                  isPublic={rutina.isPublic}
                  updatedAt={rutina.updatedAt || rutina.createdAt}
                  owner={typeof rutina.owner === 'object' ? rutina.owner.username : rutina.owner}
                  exercises={rutina.exercises}
                />
              </div>
            ))
          )}
        </div>
        
      </div>
    </div>
  )
}
