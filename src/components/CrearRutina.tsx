'use client'

import { useState, useEffect } from "react"
import { IoClose, IoAdd } from "react-icons/io5";
import ExerciseCard from "./ExerciseCard";
import { fetchExercises } from "../../lib/api";
import MenuEjercicios from "./MenuEjercicios";

interface CrearRutinaProps {
    onClose: () => void
}

export default function CrearRutina({ onClose }: CrearRutinaProps) {
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)
    const [titulo, setTitulo] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [mostrarEjercicios, setMostrarEjercicios] = useState(false)
    const [ejercicios, setEjercicios] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedExercises, setSelectedExercises] = useState<any[]>([])

    useEffect(() => {
        fetchExercises()
            .then(data => {
                console.log("Total ejercicios cargados:", data.length); // debería decir 1300+
                setEjercicios(data);
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const confirmarCerrar = () => {
        setMostrarConfirmacion(false)
        onClose()
    }

    const agregarEjercicio = (ejercicio: any) => {
        if (!selectedExercises.find(e => e.id === ejercicio.id)) {
            setSelectedExercises(prev => [...prev, ejercicio]);
        }
        setMostrarEjercicios(false);
    }

    const eliminarEjercicio = (id: string) => {
        setSelectedExercises(prev => prev.filter(e => e.id !== id));
    }

    if (loading) return <p>Cargando ejercicios...</p>;

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
                    <div className="flex flex-col gap-3">
                        {selectedExercises.map((exercise) => (
                            <div key={exercise.id} className="px-3 py-1 rounded bg-[#1F7D53] text-white text-sm relative">
                                <ExerciseCard exercise={exercise} />
                                <button
                                    onClick={() => eliminarEjercicio(exercise.id)}
                                    className="absolute top-1 right-1 text-red-300 hover:text-red-500 text-xs"
                                    type="button"
                                >
                                    Quitar
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={() => setMostrarEjercicios(!mostrarEjercicios)}
                            className="w-10 h-10 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded text-white text-xl"
                        >
                            <IoAdd />
                        </button>

                        {mostrarEjercicios && (
                            <MenuEjercicios 
                                ejercicios={ejercicios}
                                onSeleccionar={agregarEjercicio}
                                onCerrar={() => setMostrarEjercicios(false)}
                            />
                        )}
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
        </div>
    )
}
