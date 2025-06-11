import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/dashboard/Sidebar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  Search, 
  Plus, 
  MapPin, 
  Bed, 
  Bath, 
  ArrowUpDown,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

// Tipos y mapas para filtrado y visualización, 'value' en español
const propertyTypes = [
  { value: 'todos', label: 'Todos los tipos' },
  { value: 'casa', label: 'Casa' },
  { value: 'apartamento', label: 'Apartamento' },
  { value: 'terreno', label: 'Terreno' },
  { value: 'local comercial', label: 'Local Comercial' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'oficina', label: 'Oficina' },
  { value: 'finca', label: 'Finca' }
];

const propertyStatus = [
  { value: 'todos', label: 'Todos los estados' },
  { value: 'nuevo', label: 'Nuevo' },
  { value: 'usado', label: 'Usado' },
  { value: 'en construcción', label: 'En construcción' },
];

const sortOptions = [
  { value: 'date-desc', label: 'Más recientes' },
  { value: 'date-asc', label: 'Más antiguos' },
  { value: 'price-desc', label: 'Mayor precio' },
  { value: 'price-asc', label: 'Menor precio' },
  { value: 'area-desc', label: 'Mayor superficie' },
  { value: 'area-asc', label: 'Menor superficie' },
];

const Properties = () => {
  const navigate = useNavigate();
  
  const [propertiesData, setPropertiesData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('todos');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [sortBy, setSortBy] = useState('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchProperties = async () => { 
      try {
        const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets/1z535l_nlwJ-G3AnE16cqGossy4yBe0Wx4sNkpJ6ecxE/values/Backend2?key=AIzaSyDqkyWiU-HicT3Z5ltVxomucHt671y0Tro');
        const data = await response.json();

        if (Array.isArray(data.values)) {
          const transformedData = data.values.slice(1).map(property => ({
            id: property[0],
            title: property[1],
            description: property[2],
            location: `${property[3]}, ${property[4]}, ${property[5]}`,
            price: parseFloat(property[6].replace(/[$,]/g, '')) || 0,
            type: property[7].toLowerCase(),      // Normalizamos a minúsculas para el filtro
            status: property[8].toLowerCase(),    // Normalizamos a minúsculas para el filtro
            bedrooms: Number.isNaN(parseInt(property[9], 10)) ? null : parseInt(property[9], 10),
            bathrooms: Number.isNaN(parseInt(property[10], 10)) ? null : parseInt(property[10], 10),
            area: Number.isNaN(parseInt(property[11], 10)) ? null : parseInt(property[11], 10),
            features: property[12] ? property[12].split(',').map(f => f.trim()) : [],
            images: property[19] 
            ? [property[19].trim()]  // solo un link único, dentro de un array
            : [],
            createdAt: new Date().toISOString(),
          }));

          setPropertiesData(transformedData);
        } else {
          console.error('La respuesta no contiene un array en data.values:', data);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getPropertyTypeLabel = (type) => {
    const propertyType = propertyTypes.find(t => t.value === type);
    return propertyType ? propertyType.label : type;
  };

  const getStatusLabel = (status) => {
    const propertyStatusMap = {
      'nuevo': 'Nuevo',
      'usado': 'Usado',
      'en construcción': 'En construcción'
    };
    
    return propertyStatusMap[status] || status;
  };

  const getStatusColor = (status) => {
    return {
      'nuevo': 'bg-green-100 text-green-800 hover:bg-green-200',
      'usado': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      'en construcción': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
    }[status] || '';
  };

  // Aplicar filtros y ordenación
  let filteredProperties = [...propertiesData];
  
  if (searchTerm) {
    filteredProperties = filteredProperties.filter(
      property => 
        (property.title && property.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (property.description && property.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (property.location && property.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }
  
  if (typeFilter !== 'todos') {
    filteredProperties = filteredProperties.filter(property => property.type === typeFilter);
  }
  
  if (statusFilter !== 'todos') {
    filteredProperties = filteredProperties.filter(property => property.status === statusFilter);
  }
  
  filteredProperties.sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'date-asc':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'price-desc':
        return b.price - a.price;
      case 'price-asc':
        return a.price - b.price;
      case 'area-desc':
        return (b.area || 0) - (a.area || 0);
      case 'area-asc':
        return (a.area || 0) - (b.area || 0);
      default:
        return 0;
    }
  });
  
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProperties = filteredProperties.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <div className="lg:pl-64 min-h-screen max-w-7xl mx-auto px-6">
        <main className="py-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
                Propiedades
              </h1>
              <p className="text-gray-600 mt-2 max-w-xl">
                Gestiona y visualiza todas las propiedades
              </p>
            </div>
            <Button 
              className="bg-black text-white hover:bg-gray-900 focus:ring-4 focus:ring-gray-300"
              onClick={() => navigate('/properties/new')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva propiedad
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
              <Input
                placeholder="Buscar propiedades..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-11 py-3 text-gray-700"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={(val) => { setTypeFilter(val); setCurrentPage(1); }}>
              <SelectTrigger className="py-3">
                <SelectValue placeholder="Tipo de propiedad" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}>
              <SelectTrigger className="py-3">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                {propertyStatus.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={(val) => { setSortBy(val); setCurrentPage(1); }}>
              <SelectTrigger className="py-3">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center">
                      <ArrowUpDown className="h-4 w-4 mr-2 text-gray-600" />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {paginatedProperties.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {paginatedProperties.map((property) => (
                  <Card 
                    key={property.id}
                    className="overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-transform transform hover:scale-[1.02] cursor-pointer bg-white"
                    onClick={() => navigate(`/properties/${property.id}`)}
                  >
                    <div className="relative h-48 overflow-hidden rounded-t-xl">
                      {property.images.length > 0 ? (
                        <img 
                          src={property.images[0]} 
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm select-none">
                          No hay imagen disponible
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <Badge className={`${getStatusColor(property.status)} px-3 py-1 rounded-full text-xs font-semibold`}>
                          {getStatusLabel(property.status)}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-3 ">
                        <h3 className="font-semibold text-xl text-gray-900 truncate">{property.title}</h3>
                        <span className="font-bold text-black">
                          {formatPrice(property.price)}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-gray-600 text-sm mb-3">
                        <MapPin className="h-5 w-5 mr-2" />
                        <span className="truncate">{property.location}</span>
                      </div>
                      
                      <p className="text-gray-700 text-sm mb-5 line-clamp-3" title={property.description}>
                        {property.description}
                      </p>
                      
                      <div className="flex items-center justify-between border-t pt-3">
                        <div className="flex space-x-6 text-sm text-gray-600">
                          {property.area && property.area > 0 && (
                            <div className="flex items-center" title="Area">
                              <Building className="h-5 w-5 mr-1" />
                              <span>{property.area} m²</span>
                            </div>
                          )}
                          
                          {Number.isInteger(property.bedrooms) && property.bedrooms >= 0 && (
                            <div className="flex items-center" title="Habitaciones">
                              <Bed className="h-5 w-5 mr-1" />
                              <span>{property.bedrooms}</span>
                            </div>
                          )}
                          
                          {Number.isInteger(property.bathrooms) && property.bathrooms >= 0 && (
                            <div className="flex items-center" title="Baños">
                              <Bath className="h-5 w-5 mr-1" />
                              <span>{property.bathrooms}</span>
                            </div>
                          )}
                        </div>
                        
                        <Badge variant="outline" className="text-sm font-medium px-3 py-1 rounded">
                          {getPropertyTypeLabel(property.type)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex items-center space-x-3 select-none">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      aria-label="Página anterior"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    
                    <div className="flex items-center space-x-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          aria-current={currentPage === page ? "page" : undefined}
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      aria-label="Página siguiente"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <Building className="h-16 w-16 mx-auto text-gray-300 mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">No se encontraron propiedades</h3>
              <p className="text-gray-600 mb-8 max-w-sm mx-auto">
                Prueba a cambiar los filtros o añade una nueva propiedad.
              </p>
              <Button 
                className="bg-black text-white hover:bg-gray-900"
                onClick={() => navigate('/properties/new')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Añadir propiedad
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Properties;
