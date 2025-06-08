import React, { useState } from 'react';
import MenuEjercicios from '../components/MenuEjercicios';
import ExerciseCard from '../components/ExerciseCard';
import { IoClose } from 'react-icons/io5';
import { FaPlus } from 'react-icons/fa';
import { FaInfoCircle } from 'react-icons/fa';
import ConfirmarCerrar from './ConfirmarCerrar';

interface Exercise {
  id: string;
  name: string;
  target: string;
  secondaryMuscles: string[];
  equipment: string;
  bodyPart: string;
}

interface Props {
  onClose: () => void;
}

const CrearRutina: React.FC<Props> = ({onClose}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const handleSelectExercise = (exercise: Exercise) => {
    if (!selectedExercises.some(e => e.id === exercise.id)) {
      setSelectedExercises(prev => [...prev, exercise]);
    }
  };

  const handleGuardarRutina = () => {
    // Aquí agregas lógica para guardar título, descripción, visibilidad y ejercicios
    console.log({ title, description, isPublic, ejercicios: selectedExercises });
  };

  return (
    <div className="relative p-4">
      <button
        onClick={() => setMostrarConfirmacion(true)}
        className="absolute top-4 right-4 text-gray-500 hover:text-[#1F7D53] text-2xl font-bold"
      >
        <IoClose size={30}/>
      </button>
      <h1 className="text-3xl font-bold mb-6 text-center text-[#1F7D53]">Crea tu rutina</h1>
      <form className="space-y-4">
        <input
          type="text"
          placeholder="Título de la rutina"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-4 py-2 rounded mb-4 bg-black text-[#1F7D53]"
        />
        <textarea
          placeholder="Descripción de la rutina"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-4 py-2 rounded mb-4 bg-black text-[#1F7D53] h-24"
        />
      </form>
      <h2 className="text-xl font-semibold mb-4 text-[#1F7D53]">Añadir ejercicios</h2>

      <div className="flex flex-col gap-4 mb-6">
        {selectedExercises.length === 0 && (
          <div
            onClick={() => setMenuVisible(true)}
            className="w-14 h-14 flex items-center justify-center border-2 border-dashed border-[#1F7D53] rounded cursor-pointer text-[#1F7D53] hover:bg-[#27391C]"
          >
            <FaPlus className="text-xl" />
          </div>
        )}

        {selectedExercises.map((exercise, index) => (
          <div key={exercise.id}>
            <ExerciseCard {...exercise} />

            {index === selectedExercises.length - 1 && (
              <div
                onClick={() => setMenuVisible(true)}
                className="w-14 h-14 flex items-center justify-center border-2 border-dashed border-[#1F7D53] rounded cursor-pointer text-[#1F7D53] hover:bg-[#27391C] mt-4"
              >
                <FaPlus className="text-xl" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="relative w-full h-10 rounded-full border-2 border-[#1F7D53] overflow-hidden cursor-pointer mt-4" onClick={() => setIsPublic(!isPublic)}>
        {/* Fondo deslizante */}
        <div
          className={`absolute top-0 left-0 h-full w-1/2 rounded-full bg-[#1F7D53] transition-transform duration-300 ease-in-out ${
            isPublic ? 'translate-x-0' : 'translate-x-full'
          }`}   
        />

        {/* Contenido */}
        <div className="relative z-10 flex h-full">
          <div className="flex-1 flex items-center justify-center text-sm font-medium">
            Pública
          </div>
          <div className="flex-1 flex items-center justify-center text-sm font-medium">
            Privada
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={handleGuardarRutina} // <- define esta función
          className="bg-[#1F7D53] hover:bg-[#27391C] text-white px-6 py-2 rounded-full font-semibold transition"
        >
          Guardar rutina
        </button>
      </div>

      {menuVisible && (
        <MenuEjercicios
          onClose={() => setMenuVisible(false)}
          onSelectExercise={handleSelectExercise}
        />
      )}

      {mostrarConfirmacion && (
        <ConfirmarCerrar
          onCancel={() => setMostrarConfirmacion(false)}
          onConfirm={() => {
            setMostrarConfirmacion(false);
            onClose(); // Lógica para cerrar CrearRutina
          }}
        />
      )}
    </div>
  );
};

export default CrearRutina;
