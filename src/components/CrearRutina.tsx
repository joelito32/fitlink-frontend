import React, { useState } from 'react';
import MenuEjercicios from '../components/MenuEjercicios';
import ExerciseCard from '../components/ExerciseCard';

interface Exercise {
  id: string;
  name: string;
  target: string;
  secondaryMuscles: string[];
  equipment: string;
  bodyPart: string;
}

const CrearRutina: React.FC = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSelectExercise = (exercise: Exercise) => {
    if (!selectedExercises.some(e => e.id === exercise.id)) {
      setSelectedExercises(prev => [...prev, exercise]);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-[#1F7D53]">Crea tu rutina</h1>
      <form className="mb-8 space-y-4">
        <input
          type="text"
          placeholder="Título de la rutina"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />
        <textarea
          placeholder="Descripción de la rutina"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-4 py-2 rounded h-24"
        />
      </form>
      <button
        onClick={() => setMenuVisible(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
      >
        + Añadir ejercicio
      </button>

      <div className="flex flex-col gap-4">
        {selectedExercises.map((exercise) => (
          <ExerciseCard key={exercise.id} {...exercise} />
        ))}
      </div>

      {menuVisible && (
        <MenuEjercicios
          onClose={() => setMenuVisible(false)}
          onSelectExercise={handleSelectExercise}
        />
      )}
    </div>
  );
};

export default CrearRutina;
