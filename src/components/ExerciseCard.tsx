type Props = {
  exercise: {
    id: string;
    name: string;
    bodyPart: string;
    target: string;
    equipment: string;
    gifUrl: string;
  };
};

export default function ExerciseCard({ exercise }: Props) {
  return (
    <div className="flex justify-between items-center bg-gray-800 rounded-lg p-4 shadow-md">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-white capitalize">{exercise.name}</h3>
        <p className="text-sm text-gray-300 mt-1">
          Grupo: {exercise.bodyPart} <br />
          Músculo: {exercise.target} <br />
          Equipo: {exercise.equipment}
        </p>
      </div>
      <img
        src={exercise.gifUrl}
        alt={exercise.name}
        className="w-24 h-24 object-contain ml-4 rounded"
      />
    </div>
  );
}
