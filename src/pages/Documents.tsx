
import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Search, 
  Upload, 
  MoreHorizontal, 
  Download, 
  Edit,
  Trash,
  Filter,
  File
} from "lucide-react";
import { cn } from "@/lib/utils";

// Datos simulados de documentos
const DOCUMENTS_DATA = [
  {
    id: '1',
    name: 'Contrato de arrendamiento.pdf',
    type: 'pdf',
    category: 'legal',
    size: 2.5,
    uploadedBy: 'Juan Pérez',
    uploadedDate: '2023-05-19T14:30:00',
    accessLevel: 'all',
  },
  {
    id: '2',
    name: 'Guía de captación 2023.docx',
    type: 'docx',
    category: 'guides',
    size: 1.8,
    uploadedBy: 'María García',
    uploadedDate: '2023-05-18T10:15:00',
    accessLevel: 'admin',
  },
  {
    id: '3',
    name: 'Políticas de empresa.pdf',
    type: 'pdf',
    category: 'policies',
    size: 3.2,
    uploadedBy: 'Juan Pérez',
    uploadedDate: '2023-05-17T16:45:00',
    accessLevel: 'all',
  },
  {
    id: '4',
    name: 'Formulario de tasación.xlsx',
    type: 'xlsx',
    category: 'forms',
    size: 0.9,
    uploadedBy: 'Carlos López',
    uploadedDate: '2023-05-16T09:30:00',
    accessLevel: 'captador',
  },
  {
    id: '5',
    name: 'Presentación comercial 2023.pptx',
    type: 'pptx',
    category: 'marketing',
    size: 5.7,
    uploadedBy: 'María García',
    uploadedDate: '2023-05-15T13:20:00',
    accessLevel: 'manager',
  },
  {
    id: '6',
    name: 'Informe anual 2022.pdf',
    type: 'pdf',
    category: 'reports',
    size: 4.3,
    uploadedBy: 'Juan Pérez',
    uploadedDate: '2023-05-14T15:10:00',
    accessLevel: 'admin',
  },
];

const documentCategories = [
  { value: 'all', label: 'Todas las categorías' },
  { value: 'legal', label: 'Legal' },
  { value: 'guides', label: 'Guías' },
  { value: 'policies', label: 'Políticas' },
  { value: 'forms', label: 'Formularios' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'reports', label: 'Informes' },
];

const documentAccessLevels = [
  { value: 'all', label: 'Todos los niveles' },
  { value: 'all', label: 'Todos los usuarios' },
  { value: 'admin', label: 'Solo administradores' },
  { value: 'manager', label: 'Gerentes y superiores' },
  { value: 'captador', label: 'Captadores y superiores' },
];

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [accessFilter, setAccessFilter] = useState('all');
  const [documents, setDocuments] = useState(DOCUMENTS_DATA);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <File className="h-10 w-10 text-red-500" />;
      case 'docx':
        return <File className="h-10 w-10 text-blue-500" />;
      case 'xlsx':
        return <File className="h-10 w-10 text-green-500" />;
      case 'pptx':
        return <File className="h-10 w-10 text-orange-500" />;
      default:
        return <FileText className="h-10 w-10 text-gray-500" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    const foundCategory = documentCategories.find(c => c.value === category);
    return foundCategory ? foundCategory.label : category;
  };

  const getAccessLevelLabel = (level: string) => {
    const foundLevel = documentAccessLevels.find(l => l.value === level);
    return foundLevel ? foundLevel.label : level;
  };

  const handleDeleteDocument = (documentId: string) => {
    // En una implementación real, conectarías con el backend
    setDocuments(documents.filter(doc => doc.id !== documentId));
  };

  // Aplicar filtros
  let filteredDocuments = [...documents];
  
  // Filtro por término de búsqueda
  if (searchTerm) {
    filteredDocuments = filteredDocuments.filter(
      doc => doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // Filtro por categoría
  if (categoryFilter !== 'all') {
    filteredDocuments = filteredDocuments.filter(doc => doc.category === categoryFilter);
  }
  
  // Filtro por nivel de acceso
  if (accessFilter !== 'all') {
    filteredDocuments = filteredDocuments.filter(doc => doc.accessLevel === accessFilter);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:pl-64 min-h-screen">
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Documentos</h1>
              <p className="text-gray-500">Repositorio centralizado de documentos</p>
            </div>
            <Button 
              className="bg-realestate-primary"
            >
              <Upload className="h-4 w-4 mr-2" />
              Subir documento
            </Button>
          </div>

          {/* Filtros */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar documentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="flex gap-4">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  {documentCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={accessFilter} onValueChange={setAccessFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Nivel de acceso" />
                </SelectTrigger>
                <SelectContent>
                  {documentAccessLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Documentos */}
          {filteredDocuments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((document) => (
                <Card key={document.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {getDocumentIcon(document.type)}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium truncate">{document.name}</h3>
                            <p className="text-sm text-gray-500">
                              {document.size} MB • {formatDate(document.uploadedDate)}
                            </p>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="cursor-pointer">
                                <Download className="h-4 w-4 mr-2" />
                                <span>Descargar</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                <Edit className="h-4 w-4 mr-2" />
                                <span>Renombrar</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="cursor-pointer text-red-600 focus:text-red-600" 
                                onClick={() => handleDeleteDocument(document.id)}
                              >
                                <Trash className="h-4 w-4 mr-2" />
                                <span>Eliminar</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <Badge variant="outline">
                            {getCategoryLabel(document.category)}
                          </Badge>
                          
                          <div className="text-xs text-gray-500">
                            Subido por: {document.uploadedBy}
                          </div>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full mt-3 text-realestate-primary"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          <span>Descargar</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No se encontraron documentos</h3>
              <p className="text-gray-500 mb-6">Prueba a cambiar los filtros o sube un nuevo documento</p>
              <Button className="bg-realestate-primary">
                <Upload className="h-4 w-4 mr-2" />
                Subir documento
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Documents;
