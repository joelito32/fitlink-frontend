import React, { useState } from 'react';
import MenuEjercicios from '../components/MenuEjercicios';
import ExerciseCard from '../components/ExerciseCard';

interface Exercise {
  id: string;
  name: string;
  gifUrl: string;
  target: string;
  secondaryMuscles: string[];
  equipment: string;
  bodyPart: string;
}

const CrearRutina: React.FC = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);

  const handleSelectExercise = (exercise: Exercise) => {
    if (!selectedExercises.some(e => e.id === exercise.id)) {
      setSelectedExercises(prev => [...prev, exercise]);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Crear Rutina</h1>
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
