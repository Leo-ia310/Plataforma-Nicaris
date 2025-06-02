import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Ruler, Home, ArrowLeft } from 'lucide-react';

// Reemplaza con tu clave de API de Google
const API_KEY = 'AIzaSyBh30TBZk4lG-mAVfNe7cB8IzSaNvXZ77Q'; // Asegúrate de reemplazar esto con tu clave de API

interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  price: number;
  type: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  features: string[];
  manzanas: string;
  hasWell: boolean;
  hasFences: boolean;
  hasWater: boolean; // Nuevo campo para agua
  images: string[];
  createdAt: string;
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
        const response = await fetch('https://script.google.com/macros/s/AKfycbxZM5thiGShG3IXTx_vxBYdP7KDZXixhqKca-tnIWo5n451lYmv6IFh2ZZPwNOWdoLWeA/exec');
        const data = await response.json();
        console.log("DATA RECIBIDA:", data);

        // Verificar que los datos recibidos sean un array de objetos
        if (!Array.isArray(data)) { 
          throw new Error('Los datos no tienen el formato esperado.');
        }

        // Buscar la propiedad específica por ID
        console.log("ID de la URL:", id);
        console.log("IDs disponibles:", data.map(p => `"${String(p.id).trim()}"`));
        const foundProperty = data.find(p => String(p.id).trim() === String(id).trim());

        // Transformar los campos correctamente
        if (foundProperty) {
          const transformedProperty: Property = {
            id: foundProperty.id,
            title: foundProperty.title,
            description: foundProperty.description,
            address: foundProperty.address,
            city: foundProperty.city,
            state: foundProperty.state,
            price: parseFloat(foundProperty.price), // Asegurarse de que el precio sea un número
            type: foundProperty.propertyType,
            status: foundProperty.status,
            bedrooms: foundProperty.bedrooms,
            bathrooms: foundProperty.bathrooms,
            area: foundProperty.area,
            features: foundProperty.features || [],
            manzanas: foundProperty.manzanas || '',
            hasWell: foundProperty.hasWell === 'Sí',
            hasFences: foundProperty.hasFences === 'Sí',
            hasWater: foundProperty.hasWater === 'Sí', // Nuevo campo para agua
            images: foundProperty.images.map(imageId => 
              `https://www.googleapis.com/drive/v3/files/${imageId.trim()}?alt=media&key=${API_KEY}`
            ), // Convertir a URLs públicas
            createdAt: foundProperty.createdAt,
          };

          setProperty(transformedProperty); // Actualizar el estado con la propiedad encontrada
        } else {
          setProperty(null); // Si no se encuentra la propiedad, establecer a null
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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Back Button and Type */}
      <div className="bg-white pt-12 pb-5 text-realestate-primary">
        <div className="container">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link to="/properties" className="flex items-center gap-2 text-nicaris-green hover:underline">
              <ArrowLeft size={18} />
              Volver a propiedades
            </Link>
            <span className="bg-nicaris-green text-realestate-primary px-4 py-1 rounded-full text-sm font-medium">
              {property.type}
            </span>
          </div>
        </div>
      </div>
      
      {/* Property Content */}
      <section className="py-12 bg-white w-full">
        <div className="container">
          <div className="flex justify-center">
            {/* Property Images and Info - Left Side */}
            <div className="bg-white mx-auto text-black w-[100%]">
              {/* Image Gallery */}
              <div className="mb-8 bg-white">
                <div className="relative w-full h-[25rem] rounded-lg overflow-hidden mb-3">
                  {property.images.map((image, idx) => (
                    <div
                      key={idx}
                      className={`absolute inset-0 transition-opacity duration-300 ${idx === activeImage ? 'opacity-100' : 'opacity-0'}`}
                    >
                      <img
                        src={image}
                        alt={`${property.title} - Imagen ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {property.images.map((image, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`flex-shrink-0 w-24 h-16 rounded overflow-hidden border-2 ${idx === activeImage ? 'border-nicaris-green' : 'border-transparent'}`}
                    >
                      <img
                        src={image}
                        alt={`Error 404 ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Title and Location */}
              <div className="mb-6 bg-white">
                <h1 className="text-2xl md:text-3xl font-bold mb-3">{property.title}</h1>
                <div className="flex items-center gap-1 text-nicaris-lightText">
                  <MapPin size={18} className="text-nicaris-brown" />
                  <span>{property.address}, {property.city}, {property.state}</span>
                </div>
              </div>
              
              {/* Property Details */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 ">
                <div className="bg-nicaris-cream p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Ruler size={18} className="text-nicaris-green" />
                    <span className="text-nicaris-lightText text-sm">Área</span>
                  </div>
                  <p className="font-medium">{property.area} m²</p>
                </div>
                <div className="bg-nicaris-cream p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Home size={18} className="text-nicaris-green" />
                    <span className="text-nicaris-lightText text-sm">Uso</span>
                  </div>
                  <p className="font-medium">{property.status}</p>
                </div>
                <div className="bg-nicaris-cream p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-nicaris-lightText text-sm">Precio</span>
                  </div>
                  <p className="font-bold text-nicaris-green text-xl">
                    ${property.price.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">Descripción</h2>
                <p className="text-nicaris-darkText whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">Características</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                  {property.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-nicaris-green"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Servicios */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Servicios</h2>
                <p>Agua: {property.hasWater ? 'Sí' : 'No'}</p>
                <p>Cercado: {property.hasFences ? 'Sí' : 'No'}</p>
              </div>

              {/* Location Map - Placeholder for now */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">Ubicación</h2>
                <div className="bg-gray-200 h-[300px] rounded-lg flex items-center justify-center">
                  <p className="text-nicaris-lightText">
                    Mapa de ubicación no disponible en este momento
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PropertyDetails;
