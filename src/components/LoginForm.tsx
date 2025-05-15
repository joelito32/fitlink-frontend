'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

export default function FormLogin() {
  const router = useRouter()
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ identifier?: boolean; password?: boolean }>({})
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setErrorMsg('')

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status >= 500 || data.message.toLowerCase().includes('interno')) {
          setErrorMsg(data.message || 'Error interno del servidor')
          return
        }
        const fieldErrors: typeof errors = {}
        const msg = data.message?.toString().toLowerCase() || ''
        if (msg.includes('email') || msg.includes('usuario')) {
          fieldErrors.identifier = true
        } else {
          fieldErrors.password = true
        }
        setErrors(fieldErrors)
        setErrorMsg(data.message || 'Error desconocido')
        return
      }

      localStorage.setItem('token', data.token)
      router.push('/inicio')
    } catch {
      setErrorMsg('No se pudo conectar con el servidor')
      setErrors({ identifier: true })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col items-center relative">
      {/* Ventana flotante de error */}
      {errorMsg && (
        <div className="
            fixed top-4 left-1/2 transform -translate-x-1/2
            bg-red-100 border border-red-500
            text-red-700 px-4 py-2 rounded shadow-lg
            z-50
          ">
          {errorMsg}
        </div>
      )}

      <h2 className="text-5xl font-semibold text-black mb-5 text-center">Inicia sesión</h2>
      <p className="text-2xl text-[#1F7D53] mb-6 text-center">¿Cada día más fuerte?</p>

      <div className="relative w-full mb-6">
        <input
          id="identifier"
          type="text"
          placeholder=" "
          value={identifier}
          onChange={e => {
            setIdentifier(e.target.value)
            setErrors(prev => ({ ...prev, identifier: false }))
            setErrorMsg('')
          }}
          required
          className={`
            peer placeholder-transparent w-full
            border-b-2 ${errors.identifier ? 'border-red-500' : 'border-gray-300'}
            pt-6 pb-2 text-black
            focus:outline-none focus:border-[#1F7D53]
          `}
        />
        <label htmlFor="identifier" className="
            absolute left-0 transform transition-all origin-top-left
            top-0 text-sm text-gray-500
            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base
            peer-focus:top-0 peer-focus:translate-y-0 peer-focus:text-sm
          ">
          Email/Usuario
        </label>
      </div>

      <div className="relative w-full mb-8">
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          placeholder=" "
          value={password}
          onChange={e => {
            setPassword(e.target.value)
            setErrors(prev => ({ ...prev, password: false }))
            setErrorMsg('')
          }}
          required
          className={`
            peer placeholder-transparent w-full
            border-b-2 ${errors.password ? 'border-red-500' : 'border-gray-300'}
            pt-6 pb-2 text-black
            focus:outline-none focus:border-[#1F7D53]
          `}
        />
        <label htmlFor="password" className="
            absolute left-0 transform transition-all origin-top-left
            top-0 text-sm text-gray-500
            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base
            peer-focus:top-0 peer-focus:translate-y-0 peer-focus:text-sm
          ">
          Contraseña
        </label>
        {password.length > 0 && (
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500 hover:text-gray-700 transition"
          >
            {showPassword
              ? <AiOutlineEyeInvisible size={20} />
              : <AiOutlineEye size={20} />}
          </button>
        )}
      </div>

      <button type="submit" className="w-full py-3 bg-[#1F7D53] text-white rounded hover:opacity-90 transition">
        Entrar
      </button>
    </form>
  )
}
