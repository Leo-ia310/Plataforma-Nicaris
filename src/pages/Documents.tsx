import { useState, ChangeEvent } from 'react';
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
  File
} from "lucide-react";

// Tipos
interface DocumentItem {
  id: string;
  name: string;
  type: string;
  category: string;
  size: number; // en MB
  uploadedBy: string;
  uploadedDate: string;
  accessLevel: string;
  publicUrl?: string; // url público de descarga
}

// Datos simulados iniciales
const DOCUMENTS_DATA: DocumentItem[] = [
  {
    id: '1',
    name: 'Contrato de arrendamiento.pdf',
    type: 'pdf',
    category: 'legal',
    size: 2.5,
    uploadedBy: 'Juan Pérez',
    uploadedDate: '2023-05-19T14:30:00',
    accessLevel: 'all',
    publicUrl: '',
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
    publicUrl: '',
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
    publicUrl: '',
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
    publicUrl: '',
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
    publicUrl: '',
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
    publicUrl: '',
  },
];

// Categorías y niveles
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
  { value: 'allusers', label: 'Todos los usuarios' }, // evitando duplicado 'all'
  { value: 'admin', label: 'Solo administradores' },
  { value: 'manager', label: 'Gerentes y superiores' },
  { value: 'captador', label: 'Captadores y superiores' },
];

const Documents = () => {
  // Estados y filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [accessFilter, setAccessFilter] = useState('all');
  const [documents, setDocuments] = useState<DocumentItem[]>(DOCUMENTS_DATA);

  // Modal subir
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDocument, setNewDocument] = useState<{
    name: string;
    type: string;
    uploadedBy: string;
    file: File | null;
  }>({
    name: '',
    type: 'pdf',
    uploadedBy: '',
    file: null,
  });

  // Convertir base64 y hacer petición
  const handleUpload = () => {
    if (!newDocument.file) {
      alert('Por favor selecciona un archivo.');
      return;
    }
    if (!newDocument.name.trim()) {
      alert('Por favor ingresa el nombre del documento.');
      return;
    }
    if (!newDocument.uploadedBy.trim()) {
      alert('Por favor ingresa el nombre de quien sube el documento.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64data = reader.result as string;
        const mimeType = newDocument.file!.type;

        // POST a Google Apps Script
        const response = await fetch('https://script.google.com/macros/s/AKfycbwSTlgcKyAJT5O8xQqBgd-AUxaAx8gLjJKC_Qkz42IaS0mpXsrP7mLKClCCj27AFxD3/exec', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            file: base64data.split(',')[1], // sin prefix base64: "data:*/*;base64,"
            mimeType,
            name: newDocument.name,
            type: newDocument.type,
            uploadedBy: newDocument.uploadedBy,
            date: new Date().toISOString(),
          }),
        });

        if (!response.ok) throw new Error('Error en subida de archivo');

        const result = await response.json();

        if (result.status === 'success') {
          // Agregar documento nuevo con info de respuesta
          const newDoc: DocumentItem = {
            id: result.id || Math.random().toString(36).substr(2,9),
            name: newDocument.name,
            type: newDocument.type,
            category: 'all', // no se define categoría en formulario, se puede extender
            size: +(newDocument.file!.size / (1024*1024)).toFixed(2), // MB
            uploadedBy: newDocument.uploadedBy,
            uploadedDate: new Date().toISOString(),
            accessLevel: 'all',
            publicUrl: result.url || '',
          };
          setDocuments(prev => [newDoc, ...prev]);
          setIsModalOpen(false);
          // Reset nuevo documento
          setNewDocument({
            name: '',
            type: 'pdf',
            uploadedBy: '',
            file: null,
          });
        } else {
          alert('Error: No se pudo subir el documento.');
        }
      } catch (error) {
        alert('Error en la subida: ' + (error as Error).message);
      }
    };
    reader.readAsDataURL(newDocument.file);
  };

  // Formatear fecha en español
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  // Iconos según tipo
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

  // Etiqueta categoría
  const getCategoryLabel = (category: string) => {
    const foundCategory = documentCategories.find(c => c.value === category);
    return foundCategory ? foundCategory.label : category;
  };

  // Etiqueta nivel acceso
  const getAccessLevelLabel = (level: string) => {
    const foundLevel = documentAccessLevels.find(l => l.value === level);
    return foundLevel ? foundLevel.label : level;
  };

  // Borrar documento
  const handleDeleteDocument = (documentId: string) => {
    setDocuments(docs => docs.filter(doc => doc.id !== documentId));
  };

  // Filtrar documentos según filtros y búsqueda
  let filteredDocuments = [...documents];

  if (searchTerm.trim())
    filteredDocuments = filteredDocuments.filter(
      doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (categoryFilter !== 'all')
    filteredDocuments = filteredDocuments.filter(doc => doc.category === categoryFilter);

  if (accessFilter !== 'all')
    filteredDocuments = filteredDocuments.filter(doc => doc.accessLevel === accessFilter);

  // Descargar archivo desde URL pública
  const handleDownload = (url: string | undefined, name: string) => {
    if (!url) {
      alert('Enlace de descarga no disponible.');
      return;
    }
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
              onClick={() => setIsModalOpen(true)}
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
                  {documentCategories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={accessFilter} onValueChange={setAccessFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Nivel de acceso" />
                </SelectTrigger>
                <SelectContent>
                  {documentAccessLevels.map(level => (
                    <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Documentos */}
          {filteredDocuments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map(document => (
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
                              <DropdownMenuItem 
                                className="cursor-pointer"
                                onClick={() => handleDownload(document.publicUrl, document.name)}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Descargar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer" disabled>
                                <Edit className="h-4 w-4 mr-2" />
                                Renombrar
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="cursor-pointer text-red-600 focus:text-red-600"
                                onClick={() => handleDeleteDocument(document.id)}
                              >
                                <Trash className="h-4 w-4 mr-2" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <Badge variant="outline">{getCategoryLabel(document.category)}</Badge>
                          <div className="text-xs text-gray-500">Subido por: {document.uploadedBy}</div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full mt-3 text-realestate-primary"
                          onClick={() => handleDownload(document.publicUrl, document.name)}
                          disabled={!document.publicUrl}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Descargar
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
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="bg-realestate-primary"
              >
                <Upload className="h-4 w-4 mr-2" />
                Subir documento
              </Button>
            </div>
          )}

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-full">
                <h2 className="text-lg font-bold mb-4">Subir Documento</h2>
                <Input
                  placeholder="Nombre del documento"
                  value={newDocument.name}
                  onChange={(e) => setNewDocument(prev => ({ ...prev, name: e.target.value }))}
                  className="mb-4"
                />
                <Select 
                  value={newDocument.type} 
                  onValueChange={(value) => setNewDocument(prev => ({ ...prev, type: value }))}
                  
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de documento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="docx">DOCX</SelectItem>
                    <SelectItem value="xlsx">XLSX</SelectItem>
                    <SelectItem value="pptx">PPTX</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="text"
                  placeholder="Subido por"
                  value={newDocument.uploadedBy}
                  onChange={(e) => setNewDocument(prev => ({ ...prev, uploadedBy: e.target.value }))}
                  className="mb-4"
                />
                <Input
                  type="file"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files && e.target.files[0]) {
                      setNewDocument(prev => ({ ...prev, file: e.target.files![0] }));
                    }
                  }}
                  className="mb-4"
                />
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsModalOpen(false)} 
                    className="mr-2"
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleUpload}>Subir</Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Documents;

