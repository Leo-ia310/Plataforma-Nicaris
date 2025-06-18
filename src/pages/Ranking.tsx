import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { FaFire, FaTrophy, FaMedal } from 'react-icons/fa';

interface Captador {
  id: number;
  nombre: string;
  propiedades: number;
  racha: number;
  ultimaFecha: string;
  email?: string;
  telefono?: string;
  notas?: string;
  imagenUrl?: string;
}

const captadoresEjemplo: Captador[] = [
  {
    id: 1,
    nombre: 'María López',
    propiedades: 30,
    racha: 10,
    ultimaFecha: '2023-10-02',
    email: 'maria.lopez@email.com',
    telefono: '555-1234',
    notas: 'nota que tiene que poner el usuario xd',
    imagenUrl: 'https://ncbutzitffasxngkguzn.supabase.co/storage/v1/object/public/nicarismultimedia23//487036214_122102163248823069_3254347845318073507_n%20(2).jpg',
  },
  {
    id: 2,
    nombre: 'Juan Pérez',
    propiedades: 25,
    racha: 8,
    ultimaFecha: '2023-10-01',
    email: 'juan.perez@email.com',
    telefono: '555-5678',
    notas: 'nota que tiene que poner el usuario xd',
    imagenUrl: 'https://ncbutzitffasxngkguzn.supabase.co/storage/v1/object/public/nicarismultimedia23//487036214_122102163248823069_3254347845318073507_n%20(2).jpg',
  },
  {
    id: 3,
    nombre: 'Ana García',
    propiedades: 20,
    racha: 7,
    ultimaFecha: '2023-09-30',
    email: 'ana.garcia@email.com',
    telefono: '555-8765',
    notas: 'nota que tiene que poner el usuario xd',
    imagenUrl: 'https://ncbutzitffasxngkguzn.supabase.co/storage/v1/object/public/nicarismultimedia23//487036214_122102163248823069_3254347845318073507_n%20(2).jpg',
  },
  {
    id: 4,
    nombre: 'Luis Gómez',
    propiedades: 18,
    racha: 5,
    ultimaFecha: '2023-10-01',
    email: 'luis.gomez@email.com',
    telefono: '555-4321',
    notas: 'nota que tiene que poner el usuario xd',
    imagenUrl: 'https://ncbutzitffasxngkguzn.supabase.co/storage/v1/object/public/nicarismultimedia23//487036214_122102163248823069_3254347845318073507_n%20(2).jpg',
  },
  {
    id: 5,
    nombre: 'Sofía Martínez',
    propiedades: 16,
    racha: 3,
    ultimaFecha: '2023-09-29',
    email: 'sofia.martinez@email.com',
    telefono: '555-9876',
    notas: 'nota que tiene que poner el usuario xd',
    imagenUrl: 'https://ncbutzitffasxngkguzn.supabase.co/storage/v1/object/public/nicarismultimedia23//487036214_122102163248823069_3254347845318073507_n%20(2).jpg',
  },
];

const topColors = [
  'bg-yellow-400 text-black',
  'bg-gray-400 text-black',
  'bg-yellow-700 text-black',
];

const formatDate = (fechaStr: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  const d = new Date(fechaStr);
  if (Number.isNaN(d.getTime())) return fechaStr;
  return d.toLocaleDateString(undefined, options);
};

const emptyMedallasCount = 3;

const Ranking: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCaptador, setSelectedCaptador] = useState<Captador | null>(null);

  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setSelectedCaptador(null);
      }
    }
    if (selectedCaptador) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedCaptador]);

  const captadores = [...captadoresEjemplo].sort((a, b) => b.racha - a.racha);

  const getIniciales = (nombreCompleto: string): string =>
    nombreCompleto
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

  const handleSelect = (captador: Captador) => {
    setSelectedCaptador(captador);
  };

  const renderItem = (captador: Captador, index: number) => {
    const topStyle = topColors[index] || 'bg-white text-gray-900';

    if (isMobile) {
      return (
        <div
          key={captador.id}
          onClick={() => handleSelect(captador)}
          className={`cursor-pointer flex items-center p-4 mb-4 rounded-lg shadow-md ${topStyle} hover:scale-105 transform transition duration-300`}
          role="button"
          tabIndex={0}
          aria-label={`Ver detalles de posición ${index + 1}: ${captador.nombre}, propiedades: ${captador.propiedades}, racha: ${captador.racha} días`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleSelect(captador);
          }}
        >
          <div className="flex-shrink-0 mr-4 w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-gray-800">
            {getIniciales(captador.nombre)}
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">{captador.nombre}</h3>
              <span className="font-mono text-sm">#{index + 1}</span>
            </div>
            <p className="text-sm">
              Propiedades: <strong>{captador.propiedades}</strong>
            </p>
            <p className="text-sm flex items-center">
              <FaFire className="text-red-500 ml-1 mr-1" aria-hidden="true" />
              <span className="font-semibold">{captador.racha} días</span>
              {captador.racha > 7 && (
                <FaTrophy className="text-yellow-400 ml-2" aria-label="Trofeo por racha mayor a 7 días" />
              )}
            </p>
            <p className="text-sm">Última subida: {formatDate(captador.ultimaFecha)}</p>
          </div>
        </div>
      );
    } else {
      return (
        <tr
          key={captador.id}
          onClick={() => handleSelect(captador)}
          className={`cursor-pointer border-b border-gray-200 hover:bg-gray-100 transition duration-300 ${topStyle}`}
          aria-rowindex={index + 2}
          tabIndex={0}
          role="button"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleSelect(captador);
          }}
        >
          <td className="py-3 px-6 text-left font-mono text-base">{index + 1}</td>
          <td className="py-3 px-6 text-left flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-800 select-none"
              aria-hidden="true"
            >
              {getIniciales(captador.nombre)}
            </div>
            <span>{captador.nombre}</span>
          </td>
          <td className="py-3 px-6 text-left">{captador.propiedades}</td>
          <td className="py-3 px-6 text-left flex items-center">
            <FaFire className="text-red-500 mr-2" aria-label="Icono de racha" />
            <span className="font-semibold">{captador.racha} días</span>
            {captador.racha > 7 && (
              <FaTrophy
                className="text-yellow-400 ml-2"
                aria-label="Trofeo por racha mayor a 7 días"
              />
            )}
          </td>
          <td className="py-3 px-6 text-left">{formatDate(captador.ultimaFecha)}</td>
        </tr>
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* Sidebar */}
      <aside className="hidden md:block w-64 border-r border-gray-200">
        <Sidebar />
      </aside>

      {/* Contenido principal */}
      <main className="flex-grow p-6">
        <section className="max-w-6xl mx-auto" aria-label="Ranking de captadores">
          <h1 className="text-3xl font-extrabold mb-6 text-gray-900 select-none">
            Ranking de Captadores
          </h1>
          {isMobile ? (
            <div role="list">{captadores.map(renderItem)}</div>
          ) : (
            <table className="min-w-full border-collapse shadow-lg rounded-lg overflow-hidden">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="p-3 text-left font-bold text-gray-700">Posición</th>
                  <th className="p-3 text-left font-bold text-gray-700">Nombre</th>
                  <th className="p-3 text-left font-bold text-gray-700">Total Propiedades</th>
                  <th className="p-3 text-left font-bold text-gray-700">Racha Actual</th>
                  <th className="p-3 text-left font-bold text-gray-700">Última Subida</th>
                </tr>
              </thead>
              <tbody>{captadores.map(renderItem)}</tbody>
            </table>
          )}
        </section>
      </main>

      {/* Panel lateral info captador */}
      {selectedCaptador && (
        <>
          {/* Fondo semitransparente para cerrar al clicar fuera */}
          <div
            className="fixed inset-0 bg-black bg-opacity-20 z-40"
            onClick={() => setSelectedCaptador(null)}
            aria-hidden="true"
          />
          <aside
            className="fixed top-20 right-4 z-50 w-80 bg-white rounded-lg shadow-xl border border-gray-300 flex flex-col overflow-hidden animate-slideInFromRight max-h-[80vh]"
            ref={panelRef}
            role="region"
            aria-label={`Información detallada de ${selectedCaptador.nombre}`}
            tabIndex={-1}
          >
            {/* Header con cerrar */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold">{selectedCaptador.nombre}</h2>
              <button
                onClick={() => setSelectedCaptador(null)}
                aria-label="Cerrar panel"
                className="text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              >
                ✕
              </button>
            </div>
            {/* Contenido panel */}
            <div className="p-4 overflow-y-auto flex-grow">
              <img
                src={selectedCaptador.imagenUrl ?? 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/a4ca8d65-e187-43e4-9c20-45e0210906f4.png'}
                alt={`Foto de ${selectedCaptador.nombre}`}
                className="w-24 h-24 rounded-full mb-4 object-cover mx-auto"
                onError={(e) => (e.currentTarget.src = 'https://placehold.co/100x100?text=Sin+imagen')}
              />
              <p>
                <strong>Propiedades totales:</strong> {selectedCaptador.propiedades}
              </p>
              <p className="flex items-center my-1">
                <strong className="mr-1">Racha actual:</strong> {selectedCaptador.racha} días{' '}
                <FaFire className="text-red-500 ml-1" />
                {selectedCaptador.racha > 7 && (
                  <FaTrophy className="text-yellow-400 ml-2" aria-label="Trofeo por racha" />
                )}
              </p>
              <p>
                <strong>Última subida:</strong> {formatDate(selectedCaptador.ultimaFecha)}
              </p>
              {selectedCaptador.email && (
                <p>
                  <strong>Email:</strong> {selectedCaptador.email}
                </p>
              )}
              {selectedCaptador.telefono && (
                <p>
                  <strong>Teléfono:</strong> {selectedCaptador.telefono}
                </p>
              )}
              {selectedCaptador.notas && (
                <p>
                  <strong>Notas:</strong> {selectedCaptador.notas}
                </p>
              )}

              {/* Sección Medallas */}
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Medallas</h3>
                <div className="flex gap-3">
                  {Array(emptyMedallasCount)
                    .fill(null)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-300 text-xl"
                        title="Medalla vacía"
                      >
                        <FaMedal />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </aside>
          <style>
            {`
              @keyframes slideInFromRight {
                from { transform: translateX(100%); opacity: 0;}
                to { transform: translateX(0); opacity: 1;}
              }
              .animate-slideInFromRight {
                animation: slideInFromRight 0.3s ease forwards;
              }
            `}
          </style>
        </>
      )}
    </div>
  );
};

export default Ranking;


