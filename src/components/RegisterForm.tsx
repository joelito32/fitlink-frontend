'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

export default function FormRegister() {
  const router = useRouter()
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState<{
    email?: boolean
    username?: boolean
    password?: boolean
    confirmPassword?: boolean
  }>({})
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setErrorMsg('')

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password, confirmPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status >= 500 || data.message.toLowerCase().includes('interno')) {
          setErrorMsg(data.message || 'Error interno del servidor')
          return
        }
        const fieldErrors: typeof errors = {}
        const msg = data.message.toLowerCase()
        if (msg.includes('email')) fieldErrors.email = true
        else if (msg.includes('usuario')) fieldErrors.username = true
        else if (msg.includes('repetir') || msg.includes('confirm')) fieldErrors.confirmPassword = true
        else fieldErrors.password = true

        setErrors(fieldErrors)
        setErrorMsg(data.message)
        return
      }

      const loginRes = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: username, password }),
      })
      const loginData = await loginRes.json()

      if (!loginRes.ok) {
        setErrorMsg(loginData.message || 'Error iniciando sesión')
        return
      }

      localStorage.setItem('token', loginData.token)
      router.push('/complete-profile')
    } catch {
      setErrorMsg('No se pudo conectar con el servidor')
      setErrors({ email: true })
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

      <h2 className="text-5xl font-semibold text-black mb-5 text-center">Regístrate</h2>
      <p className="text-2xl text-[#1F7D53] mb-6 text-center">¿Cada día más fuerte?</p>

      <div className="relative w-full mb-6">
        <input
          id="email"
          type="email"
          placeholder=" "
          value={email}
          onChange={e => {
            setEmail(e.target.value)
            setErrors(prev => ({ ...prev, email: false }))
            setErrorMsg('')
          }}
          required
          className={`
            peer placeholder-transparent w-full
            border-b-2 ${errors.email ? 'border-red-500' : 'border-gray-300'}
            pt-6 pb-2 text-black
            focus:outline-none focus:border-[#1F7D53]
          `}
        />
        <label htmlFor="email" className="
            absolute left-0 transform transition-all origin-top-left
            top-0 text-sm text-gray-500
            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base
            peer-focus:top-0 peer-focus:translate-y-0 peer-focus:text-sm
          ">
          Email
        </label>
      </div>

      <div className="relative w-full mb-6">
        <input
          id="username"
          type="text"
          placeholder=" "
          value={username}
          onChange={e => {
            setUsername(e.target.value)
            setErrors(prev => ({ ...prev, username: false }))
            setErrorMsg('')
          }}
          required
          className={`
            peer placeholder-transparent w-full
            border-b-2 ${errors.username ? 'border-red-500' : 'border-gray-300'}
            pt-6 pb-2 text-black
            focus:outline-none focus:border-[#1F7D53]
          `}
        />
        <label htmlFor="username" className="
            absolute left-0 transform transition-all origin-top-left
            top-0 text-sm text-gray-500
            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base
            peer-focus:top-0 peer-focus:translate-y-0 peer-focus:text-sm
          ">
          Nombre de usuario
        </label>
      </div>

      <div className="relative w-full mb-6">
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

      <div className="relative w-full mb-8">
        <input
          id="confirmPassword"
          type={showConfirm ? 'text' : 'password'}
          placeholder=" "
          value={confirmPassword}
          onChange={e => {
            setConfirmPassword(e.target.value)
            setErrors(prev => ({ ...prev, confirmPassword: false }))
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
        <label htmlFor="confirmPassword" className="
            absolute left-0 transform transition-all origin-top-left
            top-0 text-sm text-gray-500
            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base
            peer-focus:top-0 peer-focus:translate-y-0 peer-focus:text-sm
          ">
          Repetir contraseña
        </label>
        {confirmPassword.length > 0 && (
          <button
            type="button"
            onClick={() => setShowConfirm(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500 hover:text-gray-700 transition"
          >
            {showConfirm
              ? <AiOutlineEyeInvisible size={20} />
              : <AiOutlineEye size={20} />}
          </button>
        )}
      </div>

      <button type="submit" className="w-full py-3 bg-[#1F7D53] text-white rounded hover:opacity-90 transition">
        Crear cuenta
      </button>
    </form>
  )
}
