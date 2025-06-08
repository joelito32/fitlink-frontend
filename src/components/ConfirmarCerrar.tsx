import React from 'react';

interface ConfirmarCerrarProps {
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmarCerrar: React.FC<ConfirmarCerrarProps> = ({ onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-start justify-center">
      <div className="bg-[#27391C] p-6 rounded-xl shadow-xl text-center max-w-sm w-full mt-10 border-2 border-[#1F7D53]">
        <h2 className="text-lg font-semibold mb-4">¿Estás seguro de que deseas cerrar?</h2>
        <p>Los datos no guardados se perderán</p>
        <div className="flex justify-around mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-[#1F7D53] hover:bg-[#195C3F]"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-400 text-white hover:bg-red-600"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmarCerrar;
