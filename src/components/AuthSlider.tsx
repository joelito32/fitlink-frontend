'use client'

import { useState } from 'react'
import FormLogin from './LoginForm'
import FormRegister from './RegisterForm'

export default function AuthSlider() {
  const [isRegisterActive, setIsRegisterActive] = useState(false)
  const togglePanel = () => setIsRegisterActive(prev => !prev)

  return (
    <div className="relative w-full h-full bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Formularios fijos */}
      <div className="absolute inset-0 flex">
        {/* Login (izquierda) */}
        <div className="w-1/2 h-full p-8 flex items-center justify-center bg-gray-50">
          <FormLogin />
        </div>
        {/* Registro (derecha) */}
        <div className="w-1/2 h-full p-8 flex items-center justify-center bg-gray-100">
          <FormRegister />
        </div>
      </div>

      {/* Overlay negro deslizante */}
      <div
        className={`absolute top-0 left-1/2 w-1/2 h-full bg-black bg-opacity-75 z-10
                    transition-transform duration-700
                    ${isRegisterActive ? '-translate-x-full' : 'translate-x-0'}`}
      >
        <div className="h-full flex flex-col items-center justify-center">
          <button
            onClick={togglePanel}
            className="px-6 py-3 border border-white rounded hover:bg-white hover:text-gray-800 transition-colors"
          >
            {isRegisterActive ? 'Inicia sesión' : 'Regístrate'}
          </button>
        </div>
      </div>
    </div>
  )
}
