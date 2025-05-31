'use client'

import { useState } from "react"
import { IoClose, IoAdd } from "react-icons/io5";
import ExerciseCard from "./ExerciseCard";

interface CrearRutinaProps {
    onClose: () => void
}

const ejerciciosMock = ['Sentadillas', 'Press banca', 'Peso muerto', 'Dominadas', 'Remo con barra', 'Fondos']

export default function CrearRutina({ onClose }: CrearRutinaProps) {
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)
    const [titulo, setTitulo] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [mostrarEjercicios, setMostrarEjercicios] = useState(false)
    const [ejercicios, setEjercicios] = useState<string[]>([])

    const confirmarCerrar = () => {
        setMostrarConfirmacion(false)
        onClose()
    }

    const toggleEjercicio = (ejercicio: string) => {
        setEjercicios(prev =>
            prev.includes(ejercicio) ? prev.filter(e => e !== ejercicio) : [...prev, ejercicio]
        )
    }

    return (
        <div className="text-white">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Crear nueva rutina</h2>
                <button
                    onClick={() => setMostrarConfirmacion(true)}
                    className="text-xl text-white hover:text-[#1F7D53]"
                    aria-label="Cerrar"
                >
                    <IoClose size={30} />
                </button>
            </div>
            <form className="space-y-4">
                <div>
                    <label className="block mb-1 text-sm font-medium text-white">Título</label>
                    <input
                        type="text"
                        value={titulo}
                        onChange={e => setTitulo(e.target.value)}
                        className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
                    />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium text-white">Descripción</label>
                    <textarea
                        value={descripcion}
                        onChange={e => setDescripcion(e.target.value)}
                        className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
                        rows={4}
                    ></textarea>
                </div>
                <div>
                    <h3 className="text-white font-semibold mb-2">Añadir ejercicios</h3>
                    <div className="flex gap-2 flex-col">
                        {ejercicios.map((ejercicio, i) => (
                            <div key={i} className="px-3 py-1 rounded bg-[#1F7D53] text-white text-sm">
                                <ExerciseCard />
                            </div>
                        ))}

                        {/* Botón cuadrado con "+" */}
                        <button
                            type="button"
                            onClick={() => setMostrarEjercicios(true)}
                            className="w-10 h-10 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded text-white text-xl"
                        >
                            <IoAdd />
                        </button>
                    </div>
                </div>
            </form>

            {mostrarConfirmacion && (
                <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-start z-50">
                    <div className="bg-[#27391C] border border-[#1F7D53] rounded-lg p-6 w-80 text-center mt-12">
                        <p className="mb-4">¿Quieres dejar de crear tu rutina? <br />Los datos no guardados se perderán.</p>
                        <div className="flex justify-between">
                            <button
                                onClick={() => setMostrarConfirmacion(false)}
                                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmarCerrar}
                                className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded"
                            >
                                Salir
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {mostrarEjercicios && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex justify-center items-center z-50">
                    <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 w-96 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between mb-4">
                        <h3 className="text-lg font-bold text-white ">Selecciona ejercicios</h3>
                        <button
                            onClick={() => setMostrarEjercicios(false)}
                            className="text-xl text-white hover:text-[#1F7D53]"
                            aria-label="Cerrar"
                        >
                            <IoClose size={30} />
                        </button>
                        </div>
                        <ul className="space-y-2">
                            {ejerciciosMock.map(ejercicio => (
                                <li
                                    key={ejercicio}
                                    className={`p-2 rounded cursor-pointer ${ejercicios.includes(ejercicio) ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                                    onClick={() => toggleEjercicio(ejercicio)}
                                >
                                    {ejercicio}
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setMostrarEjercicios(false)}
                                className="bg-[#1F7D53] hover:bg-green-700 text-white px-4 py-2 rounded"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
