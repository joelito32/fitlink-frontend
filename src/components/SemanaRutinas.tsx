'use client'

import { useState } from "react"
import { BsChevronLeft, BsChevronRight, BsCheck2Circle } from "react-icons/bs"

const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

const getDiasSemana = (offset: number): Date[] => {
    const hoy = new Date()
    const diaSemana = hoy.getDay() === 0 ? 6 : hoy.getDay() - 1
    const lunes = new Date(hoy)
    lunes.setDate(hoy.getDate() - diaSemana + offset * 7)

    return Array.from({ length: 7 }, (_, i) => {
        const fecha = new Date(lunes)
        fecha.setDate(lunes.getDate() + i)
        return fecha
    })
}

const diasConBloque: Record<string, boolean> = {
    'Lunes': true,
    'Martes': false,
    'Miércoles': true,
    'Jueves': false,
    'Viernes': true,
    'Sábado': false,
    'Domingo': false
}

export default function SemanaRutinas() {
    const [semanaOffset, setSemanaOffset] = useState(0)
    const [diaActivo, setDiaActivo] = useState<string | null>(null)

    const fechasSemana = getDiasSemana(semanaOffset)
    const nombreMes = fechasSemana[0].toLocaleDateString('es-ES', {
        month: 'long',
        year: 'numeric'
    }).replace(' de ', ' ')

    const toggleDia = (dia: string) => {
        setDiaActivo(prev => (prev === dia ? null : dia))
    }

    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-full px-4">
                <div className="bg-[#27391C] rounded-xl pt-2 pb-8 text-sm font-medium w-full flex flex-col items-center">
                    <div className="text-white text-center text-sm font-semibold mb-2 capitalize">
                        {nombreMes}
                    </div>
                    <div className="flex items-center justify-between w-full">
                        <BsChevronLeft
                            className="text-white text-xl cursor-pointer"
                            onClick={() => setSemanaOffset(prev => prev - 1)}
                        />
                        <div className="flex gap-2">
                            {dias.map((dia, i) => (
                                <div key={dia} className="flex flex-col items-center relative">
                                    <button
                                        onClick={() => toggleDia(dia)}
                                        className={`h-20 w-20 rounded-lg transition flex flex-col items-center justify-start pt-1 text-sm bg-white ${
                                            diaActivo === dia ? 'bg-[#1F7D53] text-[#1F7D53]' : 'hover:bg-gray-300 text-[#1F7D53]'
                                        }`}
                                    >
                                        <span className="text-xs leading-none mt-3">{fechasSemana[i].getDate()}</span>
                                        <span className="leading-none mt-1 font-bold">{dia}</span>
                                    </button>
                                    <div className={`w-10 h-10 rounded-full absolute -bottom-5 flex items-center justify-center ${
                                        diasConBloque[dia] ? 'bg-[#1F7D53]' : 'bg-gray-500'
                                    }`}>
                                        {diasConBloque[dia] && <BsCheck2Circle className="text-white text-[34px]" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <BsChevronRight
                            className="text-white text-xl cursor-pointer"
                            onClick={() => setSemanaOffset(prev => prev + 1)}
                        />
                    </div>
                </div>
            </div>

            {diaActivo && (
                <div className="mt-6 w-full max-w-md">
                    <div className="bg-gray-900 border border-gray-700 rounded-lg shadow p-4 text-white w-full">
                        <h3 className="font-semibold mb-2">Rutinas para {diaActivo}</h3>
                        <ul className="space-y-2">
                            <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">Mis rutinas</li>
                            <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">Rutinas guardadas</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    )
}
