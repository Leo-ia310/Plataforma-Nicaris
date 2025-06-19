import React from 'react';
import { motion } from 'framer-motion';

const Caveman404: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto text-center">
        <motion.img
          src="https://example.com/caveman.png" // Reemplaza con la URL de tu imagen de cavernícola
          alt="Cavernícola confundido"
          className="mx-auto mb-4"
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <h1 className="text-4xl font-extrabold text-red-600 mb-2">
          404 - Página perdida en la prehistoria
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Parece que esta página no ha evolucionado todavía…
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 text-white bg-red-600 hover:bg-red-500 rounded-lg transition duration-300"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  );
};

export default Caveman404;
