// components/CrearPost.tsx
'use client'

import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import ConfirmarCerrar from './ConfirmarCerrar'

interface CrearPostProps {
  onClose: () => void
  onPostCreated?: () => void
}

export default function CrearPost({ onClose, onPostCreated }: CrearPostProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)

  const handleGuardarPost = async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      })

      if (!res.ok) throw new Error('Error al crear post')

      onClose()
      onPostCreated?.()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="w-full p-6">
        <div className='relative'>
            <button
                onClick={() => setMostrarConfirmacion(true)}
                className="absolute top-4 right-4 text-gray-500 hover:text-[#1F7D53] text-2xl font-bold"
            >
                <IoClose size={30}/>
            </button>
            <h1 className="text-3xl font-bold mb-6 text-center text-[#1F7D53]">Crea tu publicación</h1>
            <form className="space-y-4">
                <textarea
                    placeholder="Contenido de la publicación"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    className="w-full border px-4 py-2 rounded mb-4 bg-black text-[#1F7D53] h-24"
                />
            </form>
            <h2 className="text-xl font-semibold mb-4 text-[#1F7D53]">Añadir rutina</h2>

            <div className="mt-6 flex justify-center">
              <button
                onClick={handleGuardarPost}
                className="bg-[#1F7D53] hover:bg-[#27391C] text-white px-6 py-2 rounded-full font-semibold transition"
              >
                Publicar
              </button>
            </div>
        </div>

      {mostrarConfirmacion && (
        <ConfirmarCerrar
          onCancel={() => setMostrarConfirmacion(false)}
          onConfirm={() => onClose()}
        />
      )}
    </div>
  )
}
