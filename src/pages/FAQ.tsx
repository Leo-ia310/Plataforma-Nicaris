
import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Search, HelpCircle } from "lucide-react";

// Datos simulados de FAQs
const FAQS_DATA = [
  {
    id: '1',
    question: '¿Cómo subir una nueva propiedad al sistema?',
    answer: 'Para subir una nueva propiedad, dirígete a la sección "Propiedades" y haz clic en el botón "Nueva propiedad". Complete todos los campos del formulario con la información de la propiedad, agregue imágenes y haga clic en "Enviar propiedad" cuando termine. La propiedad será revisada por un administrador antes de ser publicada.',
    category: 'properties',
  },
  {
    id: '2',
    question: '¿Cómo se asignan los roles de usuario?',
    answer: 'Los roles de usuario (Administrador, Gerente, Captador) son asignados por los administradores del sistema. Si necesitas un cambio de rol, contacta a un administrador. Cada rol tiene diferentes niveles de acceso y permisos dentro de la plataforma.',
    category: 'users',
  },
  {
    id: '3',
    question: '¿Puedo editar una propiedad después de enviarla?',
    answer: 'Sí, puedes editar una propiedad después de enviarla, pero con limitaciones. Si la propiedad aún está en revisión, puedes hacer todos los cambios que desees. Si ya está aprobada, algunos cambios requerirán una nueva revisión por parte de un administrador.',
    category: 'properties',
  },
  {
    id: '4',
    question: '¿Cómo puedo ver las estadísticas de mis propiedades?',
    answer: 'Para ver las estadísticas de tus propiedades, accede al Dashboard y desplázate hasta la sección de gráficos. También puedes ir a la sección "Propiedades", seleccionar una propiedad específica y hacer clic en la pestaña "Estadísticas" para ver datos detallados sobre esa propiedad.',
    category: 'reports',
  },
  {
    id: '5',
    question: '¿Quién puede acceder a los documentos confidenciales?',
    answer: 'Los documentos confidenciales solo pueden ser accedidos por usuarios con los roles y permisos adecuados. Los documentos están protegidos con diferentes niveles de acceso (Administradores, Gerentes o Todos los usuarios). Si necesitas acceso a un documento específico, contacta a tu superior.',
    category: 'documents',
  },
  {
    id: '6',
    question: '¿Cómo puedo cambiar mi contraseña?',
    answer: 'Para cambiar tu contraseña, ve a la sección "Configuración" en el menú lateral, luego selecciona la pestaña "Cuenta". Allí encontrarás la opción para cambiar tu contraseña. Deberás ingresar tu contraseña actual y luego la nueva contraseña dos veces para confirmarla.',
    category: 'account',
  },
  {
    id: '7',
    question: '¿Qué formatos de imagen son aceptados para las propiedades?',
    answer: 'El sistema acepta imágenes en formato JPG, PNG y WEBP. El tamaño máximo permitido es de 5MB por imagen. Para una mejor visualización, recomendamos imágenes con una resolución mínima de 1200x800 píxeles y una relación de aspecto de 3:2.',
    category: 'properties',
  },
  {
    id: '8',
    question: '¿Cómo enviar un mensaje a otro miembro del equipo?',
    answer: 'Para enviar un mensaje a otro miembro del equipo, ve a la sección "Mensajes" en el menú lateral. Allí verás la lista de todos los miembros disponibles. Selecciona el usuario al que deseas enviar un mensaje y usa el campo de texto en la parte inferior para escribir y enviar tu mensaje.',
    category: 'communication',
  },
  {
    id: '9',
    question: '¿Qué hacer si encuentro un error en el sistema?',
    answer: 'Si encuentras un error en el sistema, por favor reportalo inmediatamente. Ve a la sección "Configuración", selecciona la pestaña "Soporte" y haz clic en "Reportar un problema". Describe el error con el mayor detalle posible, incluyendo los pasos para reproducirlo y, si es posible, adjunta capturas de pantalla.',
    category: 'support',
  },
  {
    id: '10',
    question: '¿Puedo exportar datos de propiedades a Excel?',
    answer: 'Sí, puedes exportar datos de propiedades a Excel. En la sección "Propiedades", encontrarás un botón "Exportar" en la parte superior derecha. Puedes elegir exportar todas las propiedades o solo las filtradas actualmente. El archivo se descargará en formato Excel (.xlsx) con todos los datos relevantes.',
    category: 'reports',
  },
];

const faqCategories = [
  { value: 'all', label: 'Todas las categorías' },
  { value: 'properties', label: 'Propiedades' },
  { value: 'users', label: 'Usuarios' },
  { value: 'reports', label: 'Informes' },
  { value: 'documents', label: 'Documentos' },
  { value: 'account', label: 'Cuenta' },
  { value: 'communication', label: 'Comunicación' },
  { value: 'support', label: 'Soporte' },
];

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');

  // Aplicar filtros
  let filteredFaqs = [...FAQS_DATA];
  
  // Filtro por término de búsqueda
  if (searchTerm) {
    filteredFaqs = filteredFaqs.filter(
      faq => faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
             faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // Filtro por categoría
  if (category !== 'all') {
    filteredFaqs = filteredFaqs.filter(faq => faq.category === category);
  }

  // Agrupar FAQs por categoría
  const groupedFaqs = filteredFaqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, typeof FAQS_DATA>);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:pl-64 min-h-screen">
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Preguntas Frecuentes</h1>
            <p className="text-gray-500">Encuentra respuestas a las preguntas más comunes</p>
          </div>
          
          {/* Buscador */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Buscar preguntas o palabras clave..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 text-base"
              />
            </div>
          </div>
          
          {/* Pestañas de categorías */}
          <Tabs 
            value={category} 
            onValueChange={setCategory}
            className="max-w-3xl mx-auto"
          >
            <TabsList className="w-full justify-start overflow-x-auto py-2 mb-6">
              {faqCategories.map((cat) => (
                <TabsTrigger key={cat.value} value={cat.value}>
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {/* Contenido de FAQs */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              {filteredFaqs.length > 0 ? (
                <>
                  {category === 'all' ? (
                    // Mostrar FAQs agrupadas por categoría
                    Object.entries(groupedFaqs).map(([categoryKey, faqs]) => {
                      const categoryLabel = faqCategories.find(c => c.value === categoryKey)?.label || categoryKey;
                      
                      return (
                        <div key={categoryKey} className="mb-8 last:mb-0">
                          <h3 className="text-lg font-semibold mb-4">{categoryLabel}</h3>
                          <Accordion type="single" collapsible className="space-y-4">
                            {faqs.map((faq) => (
                              <AccordionItem key={faq.id} value={faq.id} className="border rounded-md px-4">
                                <AccordionTrigger className="text-left font-medium py-4">
                                  {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600 pb-4">
                                  {faq.answer}
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        </div>
                      );
                    })
                  ) : (
                    // Mostrar FAQs de categoría específica
                    <Accordion type="single" collapsible className="space-y-4">
                      {filteredFaqs.map((faq) => (
                        <AccordionItem key={faq.id} value={faq.id} className="border rounded-md px-4">
                          <AccordionTrigger className="text-left font-medium py-4">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-gray-600 pb-4">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <HelpCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No se encontraron resultados</h3>
                  <p className="text-gray-500">
                    Intenta con otras palabras clave o navega por las categorías
                  </p>
                </div>
              )}
            </div>
            
            {/* Contacto para más ayuda */}
            <div className="bg-realestate-primary/10 rounded-lg p-6 text-center">
              <h3 className="text-lg font-medium text-realestate-primary mb-2">
                ¿No encuentras lo que buscas?
              </h3>
              <p className="text-gray-600 mb-4">
                Si tienes alguna pregunta que no está respondida aquí, por favor contacta con soporte.
              </p>
              <div className="flex justify-center gap-4">
                <a 
                  href="/messages"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-realestate-primary hover:bg-realestate-primary/90"
                >
                  Contactar soporte
                </a>
              </div>
            </div>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default FAQ;
