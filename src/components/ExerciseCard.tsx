import React, { useEffect, useState } from 'react';

interface Props {
  id: string;
  name: string;
  target: string;
  secondaryMuscles: string[];
  equipment: string;
  bodyPart: string;
}

const ExerciseCard: React.FC<Props> = ({
  id,
  name,
  target,
  secondaryMuscles,
  equipment,
  bodyPart,
}) => {
  const [gifUrl, setGifUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchGif = async () => {
      try {
        const res = await fetch(`https://exercisedb.p.rapidapi.com/exercises/exercise/${id}`, {
          headers: {
            'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
          },
        });
        const data = await res.json();
        if (data?.gifUrl) setGifUrl(data.gifUrl);
      } catch (error) {
        console.error('Error al cargar el gif del ejercicio:', error);
      }
    };

    fetchGif();
  }, [id]);

  return (
    <div className="flex bg-white shadow-md rounded-2xl overflow-hidden w-full p-4 gap-4 items-center">
      <div className="flex-1">
        <h3 className="text-xl font-bold mb-1">{name}</h3>
        <p className="text-gray-600 text-sm mb-1">Parte del cuerpo: {bodyPart}</p>
        <p className="text-gray-600 text-sm mb-1">Objetivo: {target}</p>
        <p className="text-gray-600 text-sm mb-1">Equipo: {equipment}</p>
        {Array.isArray(secondaryMuscles) && secondaryMuscles.length > 0 && (
          <p className="text-gray-500 text-sm">
            Secundarios: {secondaryMuscles.join(', ')}
          </p>
        )}
      </div>
      {gifUrl ? (
        <img src={gifUrl} alt={name} className="w-32 h-32 object-cover rounded" />
      ) : (
        <div className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center text-sm text-gray-500">
          Cargando GIF...
        </div>
      )}
    </div>
  );
};

export default ExerciseCard;
