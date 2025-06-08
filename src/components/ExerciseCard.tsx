import React, { useEffect, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

interface Props {
  id: string;
  name: string;
  target: string;
  secondaryMuscles: string[];
  equipment: string;
  bodyPart: string;
  instructions: string;
}

const ExerciseCard: React.FC<Props> = ({
  id,
  name,
  target,
  secondaryMuscles,
  equipment,
  bodyPart,
  instructions
}) => {
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);
  const parsedInstructions = instructions.split('. ').filter(i => i.trim());

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
    <div className="bg-white shadow-md rounded-2xl overflow-hidden w-full p-4 border-4 border-[#1F7D53]">
      <div className="flex items-center">
        <div className="flex-1 pr-4">
          <h3 className="text-xl font-bold mb-1 text-[#1F7D53]">{name}</h3>
          <p className="text-[#1F7D53] text-sm mb-1 font-semibold">
            <span className="text-black font-semibold">Parte del cuerpo:</span> {bodyPart}
          </p>
          <p className="text-[#1F7D53] text-sm mb-1 font-semibold">
            <span className="text-black font-semibold">Músculo primario:</span> {target}
          </p>
          {Array.isArray(secondaryMuscles) && secondaryMuscles.length > 0 && (
            <p className="text-[#1F7D53] text-sm mb-1 font-semibold">
              <span className="text-black font-semibold">Músculo secundario:</span> {secondaryMuscles.join(', ')}
            </p>
          )}
          <p className="text-[#1F7D53] text-sm mb-1 font-semibold">
            <span className="text-black font-semibold">Equipo:</span> {equipment}
          </p>
        </div>
        {gifUrl ? (
          <img src={gifUrl} alt={name} className="w-32 h-32 object-cover rounded" />
        ) : (
          <div className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center text-sm text-gray-500">
            Cargando GIF...
          </div>
        )}
      </div>

      {parsedInstructions.length > 0 && (
        <>
          <button
            onClick={() => setShowMore(prev => !prev)}
            className="flex items-center text-sm text-[#1F7D53] mt-2 hover:underline"
          >
            <IoIosArrowDown className={`mr-1 transition-transform ${showMore ? 'rotate-180' : ''}`} />
            {showMore ? 'Mostrar menos' : 'Mostrar más'}
          </button>
          <div className={`transition-all duration-300 ease-in-out ${showMore ? 'max-h-96' : 'max-h-0 overflow-hidden'}`}>
            <ul className="list-disc mt-2 text-sm text-gray-700 w-full pl-5 pr-2">
              {parsedInstructions.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default ExerciseCard;
