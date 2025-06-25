import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Ruler, Home, ArrowLeft } from 'lucide-react';
import { toast } from "@/components/ui/sonner";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Reemplaza con tu clave de API de Google
const API_KEY = 'AIzaSyDqkyWiU-HicT3Z5ltVxomucHt671y0Tro'; // Asegúrate de reemplazar esto con tu clave de API

interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  price: number;
  propertyType: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  features: string[];
  manzanas: string;
  pricePerManzana: number;
  hasWell: boolean;
  hasFences: boolean;
  IDAP: string;
  images: string[];
  photo: string;
  furniture: string;
  hasCaretakerHouse: boolean;
  hasStorageRoom: boolean;
  terrainType: string;
  topography: string;
  soilType: string;
  landUse: string;
  mainCrops: string;
  citrusTrees: string;
  fruitTrees: string;
  irrigationSystem: string;
  hasCattleInfrastructure: boolean;
  pastureType: string;
  waterForAnimals: boolean;
  hasElectricity: boolean;
  internetAvailable: boolean;
  hasSepticTank: boolean;
  mountainView: boolean;
  oceanView: boolean;
  riverAccess: boolean;
  lakeAccess: boolean;
  gatedCommunity: boolean;
  isInSafeZone: boolean;
  touristArea: boolean;
  hasDeed: boolean;
  hasSurvey: boolean;
  propertyTaxStatus: string;
  isBankFinancingAvailable: boolean;
  restrictions: string;
  videoUrls: string[];
  floorPlanUrl: string;
  captador: string;
  numberproperty: string;
}

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0); // Estado para la imagen activa

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Iniciar el estado de carga
      try {
        const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets/1z535l_nlwJ-G3AnE16cqGossy4yBe0Wx4sNkpJ6ecxE/values/Backend2?key=AIzaSyDqkyWiU-HicT3Z5ltVxomucHt671y0Tro');
        const data = await response.json();

        if (data.values && Array.isArray(data.values)) {
          // Transformar los datos
          const headers = data.values[0]; // Obtener los encabezados
          const properties = data.values.slice(1)
            .filter(row => row[0] && row[6]) // id y price existen
            .map(row => {
          const property: Property = {
              id: row[0],
              title: row[1],
              description: row[2],
              address: row[3],
              city: row[4],
              state: row[5],
              price: parseFloat(row[6].replace(/[$,]/g, '')) || 0,
              propertyType: row[7],
              status: row[8],
              bedrooms: Number.isNaN(parseInt(row[9], 10)) ? null : parseInt(row[9], 10),
              bathrooms: Number.isNaN(parseInt(row[10], 10)) ? null : parseInt(row[10], 10),
              area: Number.isNaN(parseInt(row[11], 10)) ? null : parseInt(row[11], 10),
              features: row[12] ? row[12].split(',').map(f => f.trim()) : [],
              manzanas: row[13] || '',
              pricePerManzana: parseFloat(row[14]) || 0,
              hasWell: row[15] === 'Sí',
              hasFences: row[16] === 'Sí',
              IDAP: row[17] || '',
              images: row[18]
              ? row[18]
              .split(/\s+/)                // separar por coma
              .map(link => link.trim())  // limpiar espacios
             .filter(link => link)      // quitar strings vacíos, si hay
              : [],
              photo: row[19] || '',
              furniture: row[20] || '',
              hasCaretakerHouse: row[21] === 'Sí',
              hasStorageRoom: row[22] === 'Sí',
              terrainType: row[23] || '',
              topography: row[24] || '',
              soilType: row[25] || '',
              landUse: row[26] || '',
              mainCrops: row[27] || '',
              citrusTrees: row[28] || '',
              fruitTrees: row[29] || '',
              irrigationSystem: row[30] || '',
              hasCattleInfrastructure: row[31] === 'Sí',
              pastureType: row[32] || '',
              waterForAnimals: row[33] === 'Sí',
              hasElectricity: row[34] === 'Sí',
              internetAvailable: row[35] === 'Sí',
              hasSepticTank: row[36] === 'Sí',
              mountainView: row[37] === 'Sí',
              oceanView: row[38] === 'Sí',
              riverAccess: row[39] === 'Sí',
              lakeAccess: row[40] === 'Sí',
              gatedCommunity: row[41] === 'Sí',
              isInSafeZone: row[42] === 'Sí',
              touristArea: row[43] === 'Sí',
              hasDeed: row[44] === 'Sí',
              hasSurvey: row[45] === 'Sí',
              propertyTaxStatus: row[46] || '',
              isBankFinancingAvailable: row[47] === 'Sí',
              restrictions: row[48] || '',
              videoUrls: row[49] ? row[49].split('\n') : [],
              floorPlanUrl: row[50] || '',
              captador: row[51] || '',
              numberproperty: row[52] || '',
            };
            return property;
          });

          // Buscar la propiedad específica por ID
          const foundProperty = properties.find(p => String(p.id).trim() === String(id).trim());

          if (foundProperty) {
            setProperty(foundProperty); // Actualizar el estado con la propiedad encontrada
          } else {
            setProperty(null); // Si no se encuentra la propiedad, establecer a null
          }
        } else {
          throw new Error('Los datos no tienen el formato esperado.');
        }

      } catch (error) {
        console.error('Error fetching data:', error); // Mostrar errores en consola
        setProperty(null); // Establecer a null si hay un error
      } finally {
        setLoading(false); // Finalizar el estado de carga
      }
    };

    fetchData();
  }, [id]);

  // Manejar el caso cuando la propiedad no se encuentra
  if (loading) {
    return <div className="min-h-screen flex flex-col items-center justify-center text-center">Cargando...</div>;
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="container mx-auto py-32 text-center">
          <h1 className="text-3xl font-bold mb-4">Propiedad no encontrada</h1>
          <p className="mb-6">La propiedad que buscas no existe o ha sido eliminada.</p>
          <Link to="/properties" className="btn-primary">
            Ver todas las propiedades
          </Link>
        </div>
      </div>
    );
  }

  // Función para copiar información
  const copyInformation = () => {
    const info = `
      Título: ${property.title}
      Descripción: ${property.description}
      Dirección: ${property.address}, ${property.city}, ${property.state}
      Precio: $${property.price.toLocaleString()}
      Tipo de propiedad: ${property.propertyType}
      Estado: ${property.status}
      Habitaciones: ${property.bedrooms}
      Baños: ${property.bathrooms}
      Área: ${property.area} m²
      Manzanas: ${property.manzanas}
      Precio por manzana: $${property.pricePerManzana.toLocaleString()}
      Muebles: ${property.furniture}
      Infraestructura ganadera: ${property.hasCattleInfrastructure ? 'Sí' : 'No'}
      Vista a la montaña: ${property.mountainView ? 'Sí' : 'No'}
      Vista al océano: ${property.oceanView ? 'Sí' : 'No'}
      Acceso al río: ${property.riverAccess ? 'Sí' : 'No'}
      Acceso al lago: ${property.lakeAccess ? 'Sí' : 'No'}
      Área turística: ${property.touristArea ? 'Sí' : 'No'}
      Restricciones: ${property.restrictions}
    `;
    navigator.clipboard.writeText(info).then(() => {
      toast.success('Información copiada al portapapeles!');
    }).catch(err => {
      console.error('Error al copiar la información: ', err);
    });
  };


  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Encabezado */}
      <header className="bg-green-700 py-4 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link 
              to="/properties" 
              className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="font-medium">Volver a propiedades</span>
            </Link>
            <span className="bg-green-800 text-white px-4 py-1 rounded-full text-sm font-medium">
              {property.propertyType}
            </span>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          {/* Contenedor de la propiedad */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Galería de imágenes */}
            <div className="relative">
              <div className="relative h-80 w-full overflow-hidden">
                {property.images.map((image, idx) => (
                  <div 
                    key={idx} 
                    className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${idx === activeImage ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <img 
                      src={image} 
                      alt={`Imagen ${idx + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              
              {/* Miniaturas */}
              <div className="flex gap-2 p-4 overflow-x-auto scrollbar-hide">
                {property.images.map((image, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(idx)}
                    className={`flex-shrink-0 w-20 h-16 rounded-md overflow-hidden border-2 transition-all ${idx === activeImage ? 'border-green-700 scale-105' : 'border-transparent'}`}
                  >
                    <img 
                      src={image} 
                      alt={`Miniatura ${idx + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Información principal */}
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
              
              <div className="flex items-center gap-2 text-gray-600 mb-6">
                <MapPin size={18} className="text-green-700" />
                <span>{property.address}, {property.city}, {property.state}</span>
              </div>

              {/* Precio */}
              <div className="mb-8">
                <p className="text-2xl font-bold text-green-700">${property.price.toLocaleString()}</p>
                {property.pricePerManzana && (
                  <p className="text-sm text-gray-500">${property.pricePerManzana.toLocaleString()} por manzana</p>
                )}
              </div>
            {/* Características principales */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
  <div className="bg-gray-50 p-3 rounded-lg">
    <div className="flex items-center gap-2 text-gray-700">
      <Ruler size={16} className="text-green-700" />
      <span className="font-medium">{property.area} m²</span>
    </div>
  </div>
  
  <div className="bg-gray-50 p-3 rounded-lg">
    <div className="flex items-center gap-2 text-gray-700">
      <Home size={16} className="text-green-700" />
      <span className="font-medium">{property.status}</span>
    </div>
  </div>
  
  {property.bedrooms && (
    <div className="bg-gray-50 p-3 rounded-lg">
      <p className="text-gray-700">
        <span className="font-medium">Habitaciones:</span> {property.bedrooms}
      </p>
    </div>
  )}
  
  {property.bathrooms && (
    <div className="bg-gray-50 p-3 rounded-lg">
      <p className="text-gray-700">
        <span className="font-medium">Baños:</span> {property.bathrooms}
      </p>
    </div>
  )}
  
  {property.manzanas && (
    <div className="bg-gray-50 p-3 rounded-lg">
      <p className="text-gray-700">
        <span className="font-medium">Manzanas:</span> {property.manzanas}
      </p>
    </div>
  )}
  
  {property.furniture && (
    <div className="bg-gray-50 p-3 rounded-lg">
      <p className="text-gray-700">
        <span className="font-medium">Muebles:</span> {property.furniture}
      </p>
    </div>
  )}
</div>

{/* Descripción */}
<div className="mb-8">
  <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Descripción</h2>
  <p className="text-gray-700 leading-relaxed">{property.description}</p>
</div>

{/* Características del terreno */}
<div className="mb-8">
  <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">🏞️ Características del terreno</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <ul className="space-y-2">
      <li className="flex items-start">
        <span className="inline-block w-2 h-2 bg-green-700 rounded-full mt-2 mr-2"></span>
        <span className="text-gray-700"><strong>Tipo de suelo:</strong> {property.soilType}</span>
      </li>
      <li className="flex items-start">
        <span className="inline-block w-2 h-2 bg-green-700 rounded-full mt-2 mr-2"></span>
        <span className="text-gray-700"><strong>Uso de la tierra:</strong> {property.landUse}</span>
      </li>
      <li className="flex items-start">
        <span className="inline-block w-2 h-2 bg-green-700 rounded-full mt-2 mr-2"></span>
        <span className="text-gray-700"><strong>Cultivos principales:</strong> {property.mainCrops}</span>
      </li>
      <li className="flex items-start">
        <span className="inline-block w-2 h-2 bg-green-700 rounded-full mt-2 mr-2"></span>
        <span className="text-gray-700"><strong>Árboles cítricos:</strong> {property.citrusTrees}</span>
      </li>
      <li className="flex items-start">
        <span className="inline-block w-2 h-2 bg-green-700 rounded-full mt-2 mr-2"></span>
        <span className="text-gray-700"><strong>Árboles frutales:</strong> {property.fruitTrees}</span>
      </li>
    </ul>
    
    <ul className="space-y-2">
      <li className="flex items-start">
        <span className="inline-block w-2 h-2 bg-green-700 rounded-full mt-2 mr-2"></span>
        <span className="text-gray-700"><strong>Sistema de riego:</strong> {property.irrigationSystem}</span>
      </li>
      <li className="flex items-start">
        <span className="inline-block w-2 h-2 bg-green-700 rounded-full mt-2 mr-2"></span>
        <span className="text-gray-700"><strong>Infraestructura ganadera:</strong> {property.hasCattleInfrastructure ? 'Sí' : 'No'}</span>
      </li>
      <li className="flex items-start">
        <span className="inline-block w-2 h-2 bg-green-700 rounded-full mt-2 mr-2"></span>
        <span className="text-gray-700"><strong>Tipo de pasto:</strong> {property.pastureType}</span>
      </li>
      <li className="flex items-start">
        <span className="inline-block w-2 h-2 bg-green-700 rounded-full mt-2 mr-2"></span>
        <span className="text-gray-700"><strong>Vista a la montaña:</strong> {property.mountainView ? 'Sí' : 'No'}</span>
      </li>
      <li className="flex items-start">
        <span className="inline-block w-2 h-2 bg-green-700 rounded-full mt-2 mr-2"></span>
        <span className="text-gray-700"><strong>Vista al océano:</strong> {property.oceanView ? 'Sí' : 'No'}</span>
      </li>
    </ul>
  </div>
</div>

{/* Servicios y facilidades */}
<div className="mb-8">
  <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">⚙️ Servicios y facilidades</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <ul className="space-y-2">
      <li className="flex items-start">
        <span className="inline-block w-2 h-2 bg-green-700 rounded-full mt-2 mr-2"></span>
        <span className="text-gray-700"><strong>Agua para animales:</strong> {property.waterForAnimals ? 'Sí' : 'No'}</span>
      </li>
      <li className="flex items-start">
        <span className="inline-block w-2 h-2 bg-green-700 rounded-full mt-2 mr-2"></span>
        <span className="text-gray-700"><strong>Electricidad:</strong> {property.hasElectricity ? 'Sí' : 'No'}</span>
      </li>
      <li className="flex items-start">
        <span className="inline-block w-2 h-2 bg-green-700 rounded-full mt-2 mr-2"></span>
        <span className="text-gray-700"><strong>Internet:</strong> {property.internetAvailable ? 'Sí' : 'No'}</span>
      </li>
      <li className="flex items-start">
        <span className="inline-block w-2 h-2 bg-green-700 rounded-full mt-2 mr-2"></span>
        <span className="text-gray-700"><strong>Tanque séptico:</strong> {property.hasSepticTank ? 'Sí' : 'No'}</span>
      </li>
    </ul>
    
    <ul className="space-y-2">
      <li className="flex items-start">
        <span className="inline-block w-2 h-2 bg-green-700 rounded-full mt-2 mr-2"></span>
        <span className="text-gray-700"><strong>Comunidad cerrada:</strong> {property.gatedCommunity ? 'Sí' : 'No'}</span>
      </li>
      <li className="flex items-start">
        <span className="inline-block w-2 h-2 bg-green-700 rounded-full mt-2 mr-2"></span>
        <span className="text-gray-700"><strong>Zona segura:</strong> {property.isInSafeZone ? 'Sí' : 'No'}</span>
      </li>
      <li className="flex items-start">
        <span className="inline-block w-2 h-2 bg-green-700 rounded-full mt-2 mr-2"></span>
        <span className="text-gray-700"><strong>Escritura:</strong> {property.hasDeed ? 'Sí' : 'No'}</span>
      </li>
      <li className="flex items-start">
        <span className="inline-block w-2 h-2 bg-green-700 rounded-full mt-2 mr-2"></span>
        <span className="text-gray-700"><strong>Plano:</strong> {property.hasSurvey ? 'Sí' : 'No'}</span>
      </li>
      <li className="flex items-start">
        <span className="inline-block w-2 h-2 bg-green-700 rounded-full mt-2 mr-2"></span>
        <span className="text-gray-700"><strong>Financiamiento bancario:</strong> {property.isBankFinancingAvailable ? 'Sí' : 'No'}</span>
      </li>
    </ul>
  </div>
</div>


              {/* Mapa de ubicación */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">📍 Ubicación</h2>
                <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Mapa de ubicación no disponible en este momento</p>
                </div>
              </div>

              {/* Botón de acción */}
              <div className="flex justify-center mt-8">
                <button 
                  onClick={copyInformation}
                  className="bg-green-700 hover:bg-green-800 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md"
                >
                  Copiar Información
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Pie de página */}
      <footer className="bg-green-800 py-6 text-white">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Nicaris Bienes Raíces - Todos los derechos reservados</p>
        </div>
      </footer>
    </div>
  );
};

export default PropertyDetails;
