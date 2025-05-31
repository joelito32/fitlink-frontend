// components/ProfileSlider.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaDumbbell } from 'react-icons/fa'
import ProfileForm from './ProfileForm'
import CompleteWeight from './CompleteWeight'

type ProfileSliderProps = {
  mode: 'initial' | 'edit'
  profile: {
    name?: string
    birthdate?: string
    bio?: string
    profilePic?: string
    weight?: number
  }
}

export default function ProfileSlider({ mode, profile }: ProfileSliderProps) {
  const router = useRouter()
  const [isCompleteActive, setIsCompleteActive] = useState(false)

  const title = mode === 'initial' ? 'Completa tu perfil' : 'Editar perfil'
  const subtitle = mode === 'initial' ? 'Ya casi estás!' : 'Actualiza tus datos'
  
  const handleComplete = () => setIsCompleteActive(true)
  const handleSkip = () => router.push('/inicio')

  return (
    <div className="relative w-full h-full bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Mancuernas fijas */}
      <div className="absolute top-4 left-4 text-[#1F7D53] text-4xl z-20">
        <FaDumbbell />
      </div>
      <div className="absolute top-4 right-4 text-[#1F7D53] text-4xl z-20">
        <FaDumbbell />
      </div>

      {/* Paneles estáticos */}
      <div className="absolute inset-0 flex">
        {/* Izquierda: ProfileForm */}
        <div className="relative w-1/2 h-full p-8 flex items-center justify-center bg-gray-50">
          {!isCompleteActive && (
            <button
              onClick={handleComplete}
              className="absolute top-4 right-4 z-10 text-base text-[#1F7D53] hover:underline"
            >
              Omitir
            </button>
          )}
          <ProfileForm 
            onComplete={handleComplete} 
            title={title}
            subtitle={subtitle}
            initialData={profile}
          />
        </div>

        {/* Derecha: contenido tras completar */}
        <div className="relative w-1/2 h-full p-8 flex items-center justify-center bg-gray-100">
          {isCompleteActive && (
            <>
              <button
                onClick={handleSkip}
                className="absolute top-4 left-4 z-10 text-base text-[#1F7D53] hover:underline"
              >
                Omitir
              </button>
              <CompleteWeight />
            </>
          )}
        </div>
      </div>

      {/* Overlay negro deslizante */}
      <div
        className={`
          absolute top-0 left-1/2 w-1/2 h-full bg-black bg-opacity-75 z-30
          transition-transform duration-700
          ${isCompleteActive ? '-translate-x-full' : 'translate-x-0'}
        `}
      />
    </div>
  )
}
