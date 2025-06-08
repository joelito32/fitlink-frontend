import React, { useEffect, useState } from 'react';
import ExerciseCard from './ExerciseCard';
import { IoClose } from "react-icons/io5";

interface Props {
  onClose: () => void;
  onSelectExercise: (exercise: Exercise) => void;
}

interface Exercise {
  id: string;
  name: string;
  target: string;
  secondaryMuscles: string[];
  equipment: string;
  bodyPart: string;
  instructions: string;
}

const MenuEjercicios: React.FC<Props> = ({ onClose, onSelectExercise }) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [targets, setTargets] = useState<string[]>([]);
  const [target, setTarget] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

    const fetchExercises = async () => {
        const params = new URLSearchParams({ page: page.toString() });
        if (target) params.append('target', target);
        if (search) params.append('q', search);

        const endpoint = search ? '/api/exercises/search' : '/api/exercises';
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}?${params.toString()}`);
        const data = await res.json();
        setExercises(data.data);
        setTotalPages(data.totalPages);
    };

  const fetchTargets = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exercises/targets`);
    const data = await res.json();
    setTargets(data);
  };

  useEffect(() => {
    fetchTargets();
  }, []);

  useEffect(() => {
    fetchExercises();
  }, [page, target, search]);

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center text-black">
      <div className="bg-[#27391C] w-full max-w-4xl max-h-[90vh] rounded-2xl p-6 shadow-xl overflow-y-auto relative scrollbar-hide border-2 border-[#1F7D53]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-[#1F7D53] text-2xl font-bold"
        >
          <IoClose size={30}/>
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-[#1F7D53]">Escoge un ejercicio</h2>

        <input
          type="text"
          placeholder="Buscar ejercicios..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full border px-4 py-2 rounded mb-4 bg-black text-[#1F7D53]"
        />

        <select
          value={target}
          onChange={(e) => {
            setTarget(e.target.value);
            setPage(1);
          }}
          className="w-full border px-4 py-2 rounded mb-6 bg-black text-[#1F7D53]"
        >
          <option value="">Todos los objetivos</option>
          {targets.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <div className="flex flex-col gap-4">
          {exercises.map((exercise) => (
            <div key={exercise.id} className="cursor-pointer" onClick={() => {
              onSelectExercise(exercise);
              onClose();
            }}>
              <ExerciseCard {...exercise} />
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="bg-[#1F7D53] text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-[#1F7D53] font-bold">Página {page} de {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page >= totalPages}
            className="bg-[#1F7D53] text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuEjercicios;
