
import { useState } from 'react';
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

// Datos simulados de propiedades
const PROPERTIES_DATA = [
  {
    id: '1',
    title: 'Apartamento de lujo en centro',
    description: 'Precioso apartamento totalmente reformado en el centro de la ciudad. Materiales de primera calidad.',
    price: 180000,
    location: 'Madrid, Centro',
    type: 'apartment',
    status: 'new',
    area: 85,
    bedrooms: 2,
    bathrooms: 1,
    features: ['garage', 'elevator', 'furnished'],
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'],
    createdAt: '2023-05-19T14:30:00',
  },
  {
    id: '2',
    title: 'Chalet con piscina y jardín',
    description: 'Impresionante chalet con amplio jardín y piscina privada en urbanización tranquila.',
    price: 320000,
    location: 'Toledo, Urbanización Las Aves',
    type: 'house',
    status: 'used',
    area: 210,
    bedrooms: 4,
    bathrooms: 3,
    features: ['pool', 'garden', 'garage', 'security'],
    images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914'],
    createdAt: '2023-05-18T10:15:00',
  },
  {
    id: '3',
    title: 'Local comercial en zona empresarial',
    description: 'Local comercial bien situado en zona empresarial con gran tránsito. Perfecto para negocios.',
    price: 145000,
    location: 'Barcelona, Distrito Tecnológico',
    type: 'commercial',
    status: 'used',
    area: 120,
    features: ['security'],
    images: ['https://images.unsplash.com/photo-1497366754035-f200968a6e72'],
    createdAt: '2023-05-17T16:45:00',
  },
  {
    id: '4',
    title: 'Apartamento con vistas al mar',
    description: 'Fantástico apartamento con increíbles vistas al mar. Perfecto como inversión para alquiler vacacional.',
    price: 245000,
    location: 'Málaga, Paseo Marítimo',
    type: 'apartment',
    status: 'used',
    area: 95,
    bedrooms: 3,
    bathrooms: 2,
    features: ['terrace', 'furnished', 'elevator'],
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750'],
    createdAt: '2023-05-16T09:30:00',
  },
  {
    id: '5',
    title: 'Terreno urbanizable para construcción',
    description: 'Parcela de terreno urbanizable con todos los servicios, lista para construir vivienda unifamiliar.',
    price: 95000,
    location: 'Segovia, Urbanización El Mirador',
    type: 'land',
    status: 'new',
    area: 500,
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef'],
    createdAt: '2023-05-15T13:20:00',
  },
  {
    id: '6',
    title: 'Loft industrial reformado',
    description: 'Espectacular loft completamente reformado en antigua fábrica. Espacios amplios y mucha luz natural.',
    price: 198000,
    location: 'Valencia, Zona Ruzafa',
    type: 'apartment',
    status: 'construction',
    area: 110,
    bedrooms: 1,
    bathrooms: 1,
    features: ['storage', 'furnished'],
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2'],
    createdAt: '2023-05-14T15:10:00',
  },
];

// Tipos y mapas para filtrado y visualización
const propertyTypes = [
  { value: 'all', label: 'Todos los tipos' },
  { value: 'house', label: 'Casa' },
  { value: 'apartment', label: 'Apartamento' },
  { value: 'land', label: 'Terreno' },
  { value: 'commercial', label: 'Local Comercial' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'office', label: 'Oficina' },
];

const propertyStatus = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'new', label: 'Nuevo' },
  { value: 'used', label: 'Usado' },
  { value: 'construction', label: 'En construcción' },
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
  
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getPropertyTypeLabel = (type: string) => {
    const propertyType = propertyTypes.find(t => t.value === type);
    return propertyType ? propertyType.label : type;
  };

  const getStatusLabel = (status: string) => {
    const propertyStatus = {
      'new': 'Nuevo',
      'used': 'Usado',
      'construction': 'En construcción'
    }[status];
    
    return propertyStatus || status;
  };

  const getStatusColor = (status: string) => {
    return {
      'new': 'bg-green-100 text-green-800 hover:bg-green-200',
      'used': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      'construction': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
    }[status] || '';
  };

  // Aplicar filtros y ordenación
  let filteredProperties = [...PROPERTIES_DATA];
  
  // Filtro por término de búsqueda
  if (searchTerm) {
    filteredProperties = filteredProperties.filter(
      property => property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 property.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 property.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // Filtro por tipo de propiedad
  if (typeFilter !== 'all') {
    filteredProperties = filteredProperties.filter(property => property.type === typeFilter);
  }
  
  // Filtro por estado
  if (statusFilter !== 'all') {
    filteredProperties = filteredProperties.filter(property => property.status === statusFilter);
  }
  
  // Ordenación
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
  
  // Paginación
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProperties = filteredProperties.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:pl-64 min-h-screen">
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Propiedades</h1>
              <p className="text-gray-500">Gestiona y visualiza todas las propiedades</p>
            </div>
            <Button 
              className="bg-realestate-primary" 
              onClick={() => navigate('/properties/new')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva propiedad
            </Button>
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar propiedades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
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
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
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
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center">
                      <ArrowUpDown className="h-3.5 w-3.5 mr-2" />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Resultados */}
          {paginatedProperties.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {paginatedProperties.map((property) => (
                  <Card 
                    key={property.id}
                    className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/properties/${property.id}`)}
                  >
                    <div className="relative h-48">
                      <img 
                        src={property.images[0]} 
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className={getStatusColor(property.status)}>
                          {getStatusLabel(property.status)}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
                        <span className="font-bold text-realestate-primary">
                          {formatPrice(property.price)}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-gray-500 text-sm mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{property.location}</span>
                      </div>
                      
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {property.description}
                      </p>
                      
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex space-x-3 text-sm">
                          {property.area && (
                            <div className="flex items-center">
                              <Building className="h-4 w-4 mr-1 text-gray-500" />
                              <span>{property.area} m²</span>
                            </div>
                          )}
                          
                          {property.bedrooms && (
                            <div className="flex items-center">
                              <Bed className="h-4 w-4 mr-1 text-gray-500" />
                              <span>{property.bedrooms}</span>
                            </div>
                          )}
                          
                          {property.bathrooms && (
                            <div className="flex items-center">
                              <Bath className="h-4 w-4 mr-1 text-gray-500" />
                              <span>{property.bathrooms}</span>
                            </div>
                          )}
                        </div>
                        
                        <Badge variant="outline">
                          {getPropertyTypeLabel(property.type)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Paginación */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={currentPage === page ? "bg-realestate-primary" : ""}
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
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Building className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No se encontraron propiedades</h3>
              <p className="text-gray-500 mb-6">Prueba a cambiar los filtros o añade una nueva propiedad</p>
              <Button 
                className="bg-realestate-primary" 
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
