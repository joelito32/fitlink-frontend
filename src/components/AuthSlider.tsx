'use client'

import { useState } from 'react'
import { FaDumbbell } from 'react-icons/fa'
import FormLogin from './LoginForm'
import FormRegister from './RegisterForm'

export default function AuthSlider() {
  const [isRegisterActive, setIsRegisterActive] = useState(false)
  const togglePanel = () => setIsRegisterActive(prev => !prev)

  return (
    <div className="relative w-[80%] h-[80%] bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Mancuernas fijas */}
      <div className="absolute top-4 left-4 text-[#1F7D53] text-4xl z-10"><FaDumbbell /></div>
      <div className="absolute top-4 right-4 text-[#1F7D53] text-4xl z-10"><FaDumbbell /></div>

      {/* Paneles estáticos */}
      <div className="absolute inset-0 flex">
        {/* Izquierda: Login */}
        <div className="relative w-1/2 h-full p-8 flex items-center justify-center bg-gray-50">
          {/* Botón Regístrate en top-right de este panel */}
          {!isRegisterActive && (
            <div className='absolute top-4 right-4 z-10 text-base text-black'>
              ¿No tienes cuenta?{' '}
              <button
                onClick={togglePanel}
                className="text-[#1F7D53] hover:underline"
              >
                Regístrate
              </button>
            </div>
          )}
          <FormLogin key={isRegisterActive ? 'login-reset' : 'login'} />
        </div>

        {/* Derecha: Registro */}
        <div className="relative w-1/2 h-full p-8 flex items-center justify-center bg-gray-100">
          {/* Botón Inicia sesión en top-left de este panel */}
          {isRegisterActive && (
            <div className='absolute top-4 left-4 z-10 text-base text-black'>
              ¿Ya tienes cuenta?{' '}
              <button
                onClick={togglePanel}
                className="text-[#1F7D53] hover:underline"
              >
                Inicia sesión
              </button>
            </div>
          )}
          <FormRegister key={!isRegisterActive ? 'register-reset' : 'register'} />
        </div>
      </div>

      {/* Overlay negro deslizante */}
      <div
        className={`
          absolute top-0 left-1/2 w-1/2 h-full bg-black bg-opacity-75 z-10
          transition-transform duration-700
          ${isRegisterActive ? '-translate-x-full' : 'translate-x-0'}
        `}
      />
    </div>
  )
}
