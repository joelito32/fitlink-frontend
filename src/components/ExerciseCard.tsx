import React, { useEffect, useState } from 'react';

interface Exercise {
  id: string;
  name: string;
  gifUrl: string;
  target: string;
  secondaryMuscles: string[];
  equipment: string;
  bodyPart: string;
}

interface Props {
  id: string;
}

const ExerciseCard: React.FC<Props> = ({ id }) => {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const res = await fetch(`/api/exercises/${id}`);
        const data = await res.json();
        setExercise(data);
      } catch (error) {
        console.error('Error al obtener el ejercicio:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [id]);

  if (loading) return <div className="text-sm text-gray-500">Cargando ejercicio...</div>;
  if (!exercise) return <div className="text-sm text-red-500">No se pudo cargar el ejercicio</div>;

  const { name, gifUrl, target, secondaryMuscles, equipment, bodyPart } = exercise;

  return (
    <div className="flex bg-white shadow-md rounded-2xl overflow-hidden w-full p-4 gap-4">
      <div className="flex-1 flex flex-col justify-between">
        <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
        <p className="text-sm text-gray-600 mt-2">Parte del cuerpo: <span className="font-medium">{bodyPart}</span></p>
        <p className="text-sm text-gray-600">Objetivo: <span className="font-medium">{target}</span></p>
        <p className="text-sm text-gray-600">Equipo: <span className="font-medium">{equipment}</span></p>
        <div className="flex flex-wrap gap-2 mt-2">
          {(secondaryMuscles || []).map((muscle) => (
            <span key={muscle} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
              {muscle}
            </span>
          ))}
        </div>
      </div>
      <img
        src={gifUrl}
        alt={name}
        className="w-40 h-40 object-cover rounded-lg self-center"
      />
    </div>
  );
};

export default ExerciseCard;
