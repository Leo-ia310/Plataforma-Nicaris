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
          const properties = data.values.slice(1).map(row => {
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
  <div className="min-h-screen flex flex-col">
    <div className="bg-white pt-12 pb-5">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/properties" className="flex items-center gap-2 text-green-950">
          <ArrowLeft size={18} />
          Volver a propiedades
        </Link>
        <span className="bg-green-950 text-white px-4 py-1 rounded-full">{property.propertyType}</span>
      </div>
    </div>

    <section className="py-12 bg-white">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="bg-white w-full">
            {/* Galería de imágenes */}
            <div className="relative w-full h-64 rounded-lg overflow-hidden mb-3">
              {property.images.map((image, idx) => (
                <div key={idx} className={`absolute inset-0 transition-opacity duration-300 ${idx === activeImage ? 'opacity-100' : 'opacity-0'}`}>
                  <img src={image} alt={`Imagen ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {property.images.map((image, idx) => (
                <button key={idx} onClick={() => setActiveImage(idx)} className={`flex-shrink-0 w-24 h-16 rounded overflow-hidden border-2 ${idx === activeImage ? 'border-green-950' : 'border-transparent'}`}>
                  <img src={image} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Título y ubicación */}
            <h1 className="text-3xl font-bold mb-3">{property.title}</h1>
            <div className="flex items-center gap-1 text-gray-950">
              <MapPin size={18} className="text-brown-950" />
              <span>{property.address}, {property.city}, {property.state}</span>
            </div>

            {/* Detalles de la propiedad */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg">
                <Ruler size={18} className="text-green-950" />
                <p className="font-medium">{property.area} m²</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <Home size={18} className="text-green-950" />
                <p className="font-medium">{property.status}</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="font-bold text-green-950 text-xl">${property.price.toLocaleString()}</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-gray-950">Habitaciones: {property.bedrooms}</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-gray-950">Baños: {property.bathrooms}</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-gray-950">Manzanas: {property.manzanas}</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-gray-950">Precio por manzana: ${property.pricePerManzana.toLocaleString()}</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-gray-950">Muebles: {property.furniture}</p>
              </div>
            </div>

            {/* Descripción */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Descripción</h2>
              <p>{property.description}</p>
            </div>

            {/* Características del terreno */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">🏞️ Características del terreno</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="list-disc pl-5 text-green-950">
                  <li>Tipo de suelo: {property.soilType}</li>
                  <li>Uso de la tierra: {property.landUse}</li>
                  <li>Cultivos principales: {property.mainCrops}</li>
                  <li>Árboles cítricos: {property.citrusTrees}</li>
                  <li>Árboles frutales: {property.fruitTrees}</li>
                </ul>
                <ul className="list-disc pl-5 text-green-950">
                  <li>Sistema de riego: {property.irrigationSystem}</li>
                  <li>Tiene infraestructura ganadera: {property.hasCattleInfrastructure ? 'Sí' : 'No'}</li>
                  <li>Tipo de pasto: {property.pastureType}</li>
                  <li>Vista a la montaña: {property.mountainView ? 'Sí' : 'No'}</li>
                  <li>Vista al océano: {property.oceanView ? 'Sí' : 'No'}</li>
                  <li>Acceso al río: {property.riverAccess ? 'Sí' : 'No'}</li>
                  <li>Acceso al lago: {property.lakeAccess ? 'Sí' : 'No'}</li>
                  <li>Área turística: {property.touristArea ? 'Sí' : 'No'}</li>
                  <li>Restricciones: {property.restrictions}</li>
                </ul>
              </div>
            </div>

            {/* Servicios y facilidades */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">⚙️ Servicios y facilidades</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="list-disc pl-5 text-green-950">
                  <li>Agua para animales: {property.waterForAnimals ? 'Sí' : 'No'}</li>
                  <li>Tiene electricidad: {property.hasElectricity ? 'Sí' : 'No'}</li>
                  <li>Internet disponible: {property.internetAvailable ? 'Sí' : 'No'}</li>
                </ul>
                <ul className="list-disc pl-5 text-green-950">
                  <li>Tiene tanque séptico: {property.hasSepticTank ? 'Sí' : 'No'}</li>
                  <li>Comunidad cerrada: {property.gatedCommunity ? 'Sí' : 'No'}</li>
                  <li>Está en zona segura: {property.isInSafeZone ? 'Sí' : 'No'}</li>
                  <li>Tiene escritura: {property.hasDeed ? 'Sí' : 'No'}</li>
                  <li>Tiene plano: {property.hasSurvey ? 'Sí' : 'No'}</li>
                  <li>Estado del impuesto a la propiedad: {property.propertyTaxStatus}</li>
                  <li>Está disponible financiamiento bancario: {property.isBankFinancingAvailable ? 'Sí' : 'No'}</li>
                </ul>
              </div>
            </div>

            {/* Mapa de ubicación */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Ubicación</h2>
              <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                <p>Mapa de ubicación no disponible en este momento</p>
              </div>
            </div>
              {/* Botones de acción */}
              <div className="flex justify-between mt-8">
                <button  onClick={copyInformation} className="btn-primary">
                  Copiar Información
                </button>
              </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

};

export default PropertyDetails;
