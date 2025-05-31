// components/CompleteWeight.tsx
'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function CompleteWeight() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const [weight, setWeight] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [errorWeight, setErrorWeight] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setErrorMsg('')
        setErrorWeight(false)

        const token = localStorage.getItem('token')
        if (!token) {
            setErrorMsg('Usuario no autenticado')
            setErrorWeight(true)
            return
        }

        try {
            const res = await fetch(`${API_URL}/api/users/me`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ weight: Number(weight) }),
            })
            const data = await res.json()
        
            if (!res.ok) {
                if (data.message.toLowerCase().includes('peso')) {
                    setErrorWeight(true)
                }
                setErrorMsg(data.message)
                return
            }
            router.push('/inicio')
        } catch {
            setErrorMsg('No se pudo conectar con el servidor')
            setErrorWeight(true)
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="relative w-full max-w-sm flex flex-col items-center"
        >
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

            <h2 className="text-5xl font-semibold text-black mb-5 text-center">
                Un último paso
            </h2>
            <p className="text-2xl text-[#1F7D53] mb-6 text-center">
                Añadir tu peso desbloquea funciones en ejercicios y estadísticas
            </p>

            {/* Peso (kg) */}
            <div className="relative w-full mb-8">
                <input
                    id="weight"
                    type="number"
                    placeholder=" "
                    min="0"
                    step="0.1"
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                    className={`
                        peer placeholder-transparent w-full pr-10
                        border-b-2 ${errorWeight ? 'border-red-500' : 'border-gray-300'}
                        pt-6 pb-2 text-black
                        appearance-none focus:outline-none focus:border-[#1F7D53]
                    `}
                />
                <label
                    htmlFor="weight"
                    className="
                        absolute left-0 transform transition-all origin-top-left
                        top-0 text-sm text-gray-500
                        peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base
                        peer-focus:top-0 peer-focus:translate-y-0 peer-focus:text-sm
                    "
                >
                    Peso
                </label>
                <span className='absolute right-3 top-1/2 -translate-y-1 transform text-gray-500 hover:text-gray-700 transition'>
                    kg
                </span>
            </div>

            <button
                type="submit"
                className="
                    w-full py-3
                    bg-[#1F7D53] text-white rounded
                    hover:opacity-90 transition
                "
            >
                Completa tu perfil
            </button>
        </form>
    )
}
