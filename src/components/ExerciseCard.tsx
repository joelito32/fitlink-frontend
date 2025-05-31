// components/ExerciseCard.tsx
'use client'

interface Exercise {
    id: string
    name: string
    gifUrl: string
    target: string
    bodyPart: string
    equipment: string
}

export default function ExerciseCard({ exercise }: { exercise: Exercise }) {
    return (
        <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4 flex gap-4 items-center text-white w-full">
            <img src={exercise.gifUrl} alt={exercise.name} className="w-24 h-24 object-cover rounded" />
            <div className="flex flex-col">
                <h2 className="text-lg font-bold capitalize">{exercise.name}</h2>
                <p className="text-sm text-gray-400 capitalize">Objetivo: {exercise.target}</p>
                <p className="text-sm text-gray-400 capitalize">Parte del cuerpo: {exercise.bodyPart}</p>
                <p className="text-sm text-gray-400 capitalize">Equipo: {exercise.equipment}</p>
            </div>
        </div>
    )
}
