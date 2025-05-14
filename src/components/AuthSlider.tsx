'use client'
import { useState } from 'react'
import FormLogin from './LoginForm'
import FormRegister from './RegisterForm'

export default function AuthSlider() {
  const [showRegister, setShowRegister] = useState(false)
  const togglePanel = () => setShowRegister(prev => !prev)

  return (
    <div className="relative w-full h-full bg-white rounded-xl shadow-lg overflow-hidden">
      {/* 1. El slider debe tener altura completa */}
      <div
        className="absolute inset-0 flex h-full transition-transform duration-700"
        style={{
          transform: showRegister ? 'translateX(-50%)' : 'translateX(0)',
        }}
      >
        {/* 2. Cada panel también necesita full height */}
        <div className="w-1/2 h-full p-8 flex items-center justify-center bg-gray-50">
          <FormLogin />
        </div>
        <div className="w-1/2 h-full p-8 flex items-center justify-center bg-gray-100">
          <FormRegister />
        </div>
      </div>

      {/* 3. Overlay con z-index alto */}
      <div
        className="absolute top-0 left-1/2 h-full w-1/2 bg-cover bg-center z-10 transition-transform duration-700 flex flex-col items-center justify-center text-white"
        style={{
          backgroundImage: 'url(/your-image.jpg)',
          transform: showRegister ? 'translateX(-100%)' : 'translateX(0)',
        }}
      >
        <h3 className="text-2xl font-semibold mb-4 text-center px-4">
          {showRegister
            ? '¿Ya tienes cuenta?'
            : '¿Aún no te has registrado?'}
        </h3>
        <button
          onClick={togglePanel}
          className="px-6 py-3 border border-white rounded hover:bg-white hover:text-gray-800 transition-colors"
        >
          {showRegister ? 'Iniciar sesión' : 'Regístrate'}
        </button>
      </div>
    </div>
  )
}
