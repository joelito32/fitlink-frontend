// components/FormLogin.tsx
'use client'

import { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

export default function FormLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [identifier, setIdentifier] = useState('')

  return (
    <form className="w-full max-w-sm flex flex-col items-center">
      {/* Título */}
      <h2 className="text-5xl font-semibold text-black mb-5 text-center">
        Inicia sesión
      </h2>
      {/* Subtítulo */}
      <p className="text-2xl text-[#1F7D53] mb-6 text-center">
        ¿Cada día más fuerte?
      </p>

      {/* Email/Usuario */}
      <div className="relative w-full mb-6">
        <input
          id="identifier"
          type="text"
          placeholder=" "
          value={identifier}
          onChange={e => setIdentifier(e.target.value)}
          required
          className="
            peer 
            placeholder-transparent 
            w-full 
            border-b-2 border-gray-300 
            pt-6 pb-2
            text-black
            focus:outline-none focus:border-[#1F7D53]
          "
        />
        <label
          htmlFor="identifier"
          className="
            absolute left-0 
            transform transition-all origin-top-left
            top-0 text-sm text-gray-500
            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base
            peer-focus:top-0 peer-focus:translate-y-0 peer-focus:text-sm
          "
        >
          Email/Usuario
        </label>
      </div>

      {/* Contraseña con toggle */}
      <div className="relative w-full mb-8">
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          placeholder=" "
          value={password}
          onChange={e=> setPassword(e.target.value)}
          required
          className="
            peer 
            placeholder-transparent 
            w-full 
            border-b-2 border-gray-300 
            pt-6 pb-2
            text-black
            focus:outline-none focus:border-[#1F7D53]
          "
        />
        <label
          htmlFor="password"
          className="
            absolute left-0 
            transform transition-all origin-top-left
            top-0 text-sm text-gray-500
            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base
            peer-focus:top-0 peer-focus:translate-y-0 peer-focus:text-sm
          "
        >
          Contraseña
        </label>
        {password.length > 0 && (
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1 transform text-sm text-gray-500 hover:text-gray-700"
          >
            {showPassword 
              ? <AiOutlineEyeInvisible size={20} /> 
              : <AiOutlineEye size={20} />
            }
          </button>
        )}
      </div>

      {/* Botón */}
      <button
        type="submit"
        className="
          w-full py-3 
          bg-[#1F7D53] text-white rounded 
          hover:opacity-90 transition
        "
      >
        Entrar
      </button>
    </form>
  )
}
