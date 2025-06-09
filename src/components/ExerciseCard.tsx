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
  showExpandable?: boolean;
  onRemove?: () => void;
}

const ExerciseCard: React.FC<Props> = ({
  id,
  name,
  target,
  secondaryMuscles,
  equipment,
  bodyPart,
  instructions,
  showExpandable = false,
  onRemove
}) => {
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);

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

  const parsedInstructions = instructions
    ? instructions.split(/(?<=[.!?])\s+/).map(instr => instr.trim()).filter(Boolean)
    : []

  return (
    <div className="bg-white shadow-md rounded-2xl overflow-hidden w-full p-4 border-4 border-[#1F7D53]">
      <div className="flex flex-col md:flex-row justify-between">
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

        <div className="w-32 h-32 flex-shrink-0 mt-4 md:mt-0">
          {gifUrl ? (
            <img src={gifUrl} alt={name} className="w-full h-full object-cover rounded" />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-sm text-gray-500">
              Cargando GIF...
            </div>
          )}
        </div>
      </div>

      {showExpandable && parsedInstructions.length > 0 && (
        <>
          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showMore ? 'max-h-[500px]' : 'max-h-0'}`}>
            <p className="text-sm font-semibold text-black mb-2">Instrucciones:</p>
            <ul className="list-disc text-sm text-gray-700 pl-5 pr-5 break-words mb-2">
              {parsedInstructions.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>

          <div className="flex justify-between items-center mt-1">
            <button
              onClick={() => setShowMore(prev => !prev)}
              className="flex items-center text-sm text-[#1F7D53] hover:underline"
            >
              <IoIosArrowDown className={`mr-1 transition-transform ${showMore ? 'rotate-180' : ''}`} />
              {showMore ? 'Mostrar menos' : 'Mostrar más'}
            </button>

            {onRemove && (
              <button
                onClick={onRemove}
                className="text-sm text-red-500 hover:underline"
              >
                Quitar ejercicio
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ExerciseCard;
