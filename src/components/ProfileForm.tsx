// components/ProfileForm.tsx
'use client'

import { useState, FormEvent, useEffect } from 'react'
import { FaTrashAlt, FaPlus } from 'react-icons/fa'

interface ProfileFormProps {
  onComplete: () => void
  title?: string
  subtitle?: string
  initialData?: {
    name?: string
    birthdate?: string
    bio?: string
    profilePic?: string
  }
}

export default function ProfileForm({ 
  onComplete,
  title = 'Completa tu perfil',
  subtitle = 'Ya casi estás!',
  initialData = {}
}: ProfileFormProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const [name, setName] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [bio, setBio] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [deletePhoto, setDeletePhoto] = useState(false)
  const [errors, setErrors] = useState<{ name?: boolean; birthdate?: boolean; bio?: boolean; profilePic?: boolean }>({})
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    setName(initialData?.name || '')
    setBirthdate(initialData?.birthdate || '')
    setBio(initialData?.bio || '')
  }, [initialData])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrors({})
    setErrorMsg('')

    const token = localStorage.getItem('token')
    if (!token) {
      setErrorMsg('Usuario no autenticado')
      return
    }

    const formData = new FormData()
    formData.append('name', name)
    formData.append('birthdate', birthdate)
    formData.append('bio', bio)
    if (file) formData.append('profilePic', file)
    if (deletePhoto) formData.append('deletePhoto', 'true')

    try {
      const res = await fetch(`${API_URL}/api/users/me`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) {
        const fieldErrors: typeof errors = {}
        const msg = data.message.toLowerCase()
        if (msg.includes('nombre')) fieldErrors.name = true
        else if (msg.includes('biografía') || msg.includes('biografia')) fieldErrors.bio = true
        else if (msg.includes('años')) fieldErrors.birthdate = true
        else if (msg.includes('imagen')) fieldErrors.profilePic = true
        setErrors(fieldErrors)
        setErrorMsg(data.message)
        return
      }
      onComplete()
    } catch {
      setErrorMsg('No se pudo conectar con el servidor')
    }
  }

  const profilePicURL = file
    ? URL.createObjectURL(file)
    : deletePhoto || !initialData.profilePic
    ? 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
    : initialData.profilePic?.startsWith('http')
    ? initialData.profilePic
    : `${API_URL}${initialData.profilePic}`;

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-sm flex flex-col items-center">
      {errorMsg && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-500 text-red-700 px-4 py-2 rounded shadow-lg z-50">
          {errorMsg}
        </div>
      )}

      <h2 className="text-5xl font-semibold text-black mb-5 text-center">{title}</h2>
      <p className="text-2xl text-[#1F7D53] mb-6 text-center">{subtitle}</p>

      {/* Foto de perfil */}
      <div className="w-full mb-6 flex flex-col items-center">
        <label className={`mb-2 ${errors.profilePic ? 'text-red-500' : 'text-[#1F7D53]'}`}>
          Foto de perfil
        </label>
          <div className="relative w-24 h-24 rounded-full overflow-hidden group">
            <img
              key={profilePicURL}
              src={profilePicURL}
              alt="Perfil"
              className="w-full h-full object-cover"
              crossOrigin='anonymous'
            />

            {(file || (!deletePhoto && initialData.profilePic)) ? (
              <div
                className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                onClick={() => {
                  setDeletePhoto(true)
                  setFile(null)
                }}
              >
                <FaTrashAlt className="text-red-600 text-xl" />
              </div>
            ) : (
              <>
                <label
                  htmlFor="profile-pic-upload"
                  className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                >
                  <FaPlus className="text-[#1F7D53] text-xl" />
                </label>
                <input
                  id="profile-pic-upload"
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    if (e.target.files?.[0]) {
                      setFile(e.target.files[0])
                      setDeletePhoto(false)
                    }
                  }}
                  className="hidden"
                />
              </>
            )}
          </div>
      </div>

      <div className="relative w-full mb-6">
        <input
          id="name"
          type="text"
          placeholder=" "
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className={`
            peer placeholder-transparent w-full
            border-b-2 ${errors.name ? 'border-red-500' : 'border-gray-300'}
            pt-6 pb-2 text-black
            focus:outline-none focus:border-[#1F7D53]
          `}
        />
        <label
          htmlFor="name"
          className="
            absolute left-0 transform transition-all origin-top-left
            top-0 text-sm text-gray-500
            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base
            peer-focus:top-0 peer-focus:translate-y-0 peer-focus:text-sm
          "
        >
          Nombre
        </label>
      </div>
          
      {/* Fecha de nacimiento */}
      <div className="relative w-full mb-6">
        <input
          id="birthdate"
          type="date"
          placeholder=" "
          value={birthdate}
          onChange={e => setBirthdate(e.target.value)}
          className={`
            peer placeholder-transparent w-full
            border-b-2 ${errors.birthdate ? 'border-red-500' : 'border-gray-300'}
            pt-6 pb-2 text-black
            focus:outline-none focus:border-[#1F7D53]
          `}
        />
        <label
          htmlFor="birthdate"
          className="
            absolute left-0 transform transition-all origin-top-left
            top-0 text-sm text-gray-500
            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base
            peer-focus:top-0 peer-focus:translate-y-0 peer-focus:text-sm
          "
        >
          Fecha de nacimiento
        </label>
      </div>
          
      {/* Biografía */}
      <div className="relative w-full mb-8">
        <textarea
          id="bio"
          placeholder=" "
          value={bio}
          onChange={e => setBio(e.target.value)}
          className={`
            peer placeholder-transparent w-full
            border-b-2 ${errors.bio ? 'border-red-500' : 'border-gray-300'}
            pt-6 pb-2 text-black
            focus:outline-none focus:border-[#1F7D53] resize-none
            h-24
          `}
        />
        <label
          htmlFor="bio"
          className="
            absolute left-0 transform transition-all origin-top-left
            top-0 text-sm text-gray-500
            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base
            peer-focus:top-0 peer-focus:translate-y-0 peer-focus:text-sm
          "
        >
          Biografía
        </label>
      </div>

      <button type="submit" className="w-full py-3 bg-[#1F7D53] text-white rounded hover:opacity-90 transition">
        Completar perfil
      </button>
    </form>
  )
}
