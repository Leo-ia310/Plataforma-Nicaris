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

const topColors = [
  'bg-yellow-600 text-black',
  'bg-gray-700 text-black',
  'bg-orange-700 text-black',
];

const emptyMedallasCount = 3;

const Ranking: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCaptador, setSelectedCaptador] = useState<Captador | null>(null);
  const [captadores, setCaptadores] = useState<Captador[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

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

  const parseDate = (dateString: string): Date | null => {
    if (!dateString) return null;
    const partes = dateString.split('/');
    if (partes.length !== 3) return null;
    const [day, month, year] = partes.map(Number);
    return new Date(year, month - 1, day);
  };

  const formatDate = (input: string | Date): string => {
    const date = typeof input === 'string' ? parseDate(input) : input;
    if (!date) return '';
    const day = date.getDate();
    const month = date.toLocaleString('es-ES', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };

useEffect(() => {
  const fetchProperties = async () => {
    try {
      const response = await fetch(
        'https://sheets.googleapis.com/v4/spreadsheets/1yDDRLL0K5SmoSKTQShqT_JGMYBxO7Bc483P9lvI2_ns/values/USER?key=AIzaSyDqkyWiU-HicT3Z5ltVxomucHt671y0Tro'
      );
      const data = await response.json();

      if (Array.isArray(data.values)) {
        // CORREGIDO: encadenar el sort al map y usar const
        const transformedData: Captador[] = data.values.slice(1)
          .map((property: any) => {
            const ultimaFecha = parseDate(property[5]);
            const fechaActual = parseDate(property[4]);
            let racha = Number(property[3]) || 0;
            const fallos = Number(property[10]) || 0;

            return {
              id: Number(property[0]),
              nombre: property[1],
              propiedades: Number(property[2]),
              racha,
              ultimaFecha: property[5],
              fechaActual: formatDate(fechaActual),
              email: property[6],
              telefono: property[7],
              notas: property[8],
              imagenUrl: property[9],
            };
          })
          // ORDENAR: primero por racha descendente, luego por propiedades descendente
          .sort((a, b) => {
            if (b.racha !== a.racha) {
              return b.racha - a.racha;
            }
            return b.propiedades - a.propiedades;
          });

        setCaptadores(transformedData);
      } else {
        console.error('La respuesta no contiene un array en data.values:', data);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };
  fetchProperties();
}, []);

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

  // Lógica para estilos y animaciones de la racha
  const getRachaClasses = (racha: number) => {
    if (racha === 0) {
      return 'racha-gris';
    } else if (racha >= 100) {
      return 'racha-morada animate-fire-morado';
    } else if (racha > 49) {
      return 'racha-naranja animate-fire-naranja';
    } else {
      return 'racha-roja animate-fire-rojo';
    }
  };

// Reemplaza la función renderFireIcon por esta versión:
const renderFireIcon = (racha: number) => {
  if (racha === 0) {
    return (
      <span className="racha-gris flex items-center">
        <FaFire className="text-gray-400" aria-label="Sin racha" />
      </span>
    );
  } else if (racha >= 100) {
    return (
      <span className="racha-morada animate-fire-morado flex items-center">
        <FaFire className="text-purple-600 drop-shadow-lg" aria-label="Racha morada" />
      </span>
    );
  } else if (racha > 49) {
    return (
      <span className="racha-naranja animate-fire-naranja flex items-center">
        <FaFire className="text-orange-600 drop-shadow" aria-label="Racha intensa" />
      </span>
    );
  } else {
    return (
      <span className="racha-roja animate-fire-rojo flex items-center">
        <FaFire className="text-red-500" aria-label="Racha activa" />
      </span>
    );
  }
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
            <p className={`text-sm flex items-center gap-1 ${getRachaClasses(captador.racha)}`}>
              {renderFireIcon(captador.racha)}
              <span className="font-semibold">{captador.racha} días</span>
              {captador.racha > 7 && (
                <FaTrophy className="text-yellow-400 ml-2" aria-label="Trofeo por racha mayor a 7 días" />
              )}
            </p>
            <p className="text-sm">Última subida:{formatDate(captador.ultimaFecha)}</p>
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
          <td className={`py-3 px-6 text-left flex items-center gap-1 ${getRachaClasses(captador.racha)}`}>
            {renderFireIcon(captador.racha)}
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
              <p className={`flex items-center my-1 gap-1 ${getRachaClasses(selectedCaptador.racha)}`}>
                <strong className="mr-1">Racha actual:</strong>
                {renderFireIcon(selectedCaptador.racha)}
                {selectedCaptador.racha} días
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
                        className="w-10 h-10 rounded-full border-2 border-gray-500 flex items-center justify-center text-gray-500 text-xl"
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
              /* Animaciones y colores para la racha */
              .racha-gris .fa-fire, .racha-gris svg {
                color: #a3a3a3 !important;
                opacity: 0.7;
                filter: grayscale(1);
              }
              .racha-roja .fa-fire, .racha-roja svg {
                color: #ef4444 !important;
                animation: fireBlink 1s infinite alternate;
                filter: drop-shadow(0 0 4px #ef4444);
              }
              .racha-naranja .fa-fire, .racha-naranja svg {
                color: #f59e42 !important;
                animation: firePulse 0.7s infinite alternate;
                filter: drop-shadow(0 0 8px #f59e42);
              }
              .racha-morada .fa-fire, .racha-morada svg {
                color: #a21caf !important;
                animation: firePulseMorado 0.6s infinite alternate;
                filter: drop-shadow(0 0 12px #a21caf);
              }
              @keyframes fireBlink {
                0% { opacity: 1; transform: scale(1); }
                100% { opacity: 0.5; transform: scale(1.15); }
              }
              @keyframes firePulse {
                0% { opacity: 1; transform: scale(1); }
                100% { opacity: 0.7; transform: scale(1.25) rotate(-8deg); }
              }
              @keyframes firePulseMorado {
                0% { opacity: 1; transform: scale(1); }
                100% { opacity: 0.8; transform: scale(1.35) rotate(8deg); }
              }
            `}
          </style>
        </>
      )}
    </div>
  );
};

export default Ranking;