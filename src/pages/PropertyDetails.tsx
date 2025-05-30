import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Ruler, Home, ArrowLeft } from 'lucide-react';


const API_KEY = 'TU_API_KEY'; // Asegúrate de reemplazar esto con tu clave de API

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0); // Agregar estado para la imagen activa

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbxZM5thiGShG3IXTx_vxBYdP7KDZXixhqKca-tnIWo5n451lYmv6IFh2ZZPwNOWdoLWeA/exec');
        const data = await response.json();

        // Transformar los datos, omitiendo la primera fila (encabezados)
        const properties = data.values.slice(1).map(row => ({
          id: row[0],
          title: row[1],
          description: row[2],
          address: row[3],
          city: row[4],
          state: row[5],
          price: row[6].replace(/[$,]/g, ''), // Eliminar símbolos $ y comas
          propertyType: row[7],
          status: row[8],
          bedrooms: row[9],
          bathrooms: row[10],
          area: row[11],
          features: row[12].split(','),
          manzanas: row[13],
          hasWell: row[14] === 'Sí',
          hasFences: row[15] === 'Sí',
          images: row[17] ? row[17].split('\n').map(id => `https://www.googleapis.com/drive/v3/files/${id}?alt=media&key=${API_KEY}`) : [],
        }));

        // Buscar la propiedad específica por ID
        const foundProperty = properties.find(prop => prop.id === id);
        setProperty(foundProperty || null);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Manejar el caso cuando la propiedad no se encuentra
  if (loading) {
    return <div className="min-h-screen flex flex-col">Cargando...</div>;
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
      <div className="bg-white pt-24 pb-6">
        <div className="container">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link to="/properties" className="flex items-center gap-2 text-nicaris-green hover:underline">
              <ArrowLeft size={18} />
              Volver a propiedades
            </Link>
            <span className="bg-nicaris-green text-white px-4 py-1 rounded-full text-sm font-medium">
              {property.propertyType}
            </span>
          </div>
        </div>
      </div>
      
      {/* Property Content */}
      <section className="py-8">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Property Images and Info - Left Side */}
            <div className="lg:col-span-2">
              {/* Image Gallery */}
              <div className="mb-8">
                <div className="relative w-full h-[400px] rounded-lg overflow-hidden mb-3">
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
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold mb-3">{property.title}</h1>
                <div className="flex items-center gap-1 text-nicaris-lightText">
                  <MapPin size={18} className="text-nicaris-brown" />
                  <span>{property.address}, {property.city}, {property.state}</span>
                </div>
              </div>
              
              {/* Property Details */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
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
                    ${parseFloat(property.price).toLocaleString()}
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
