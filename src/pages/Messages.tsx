
import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import ChatBox from '@/components/chat/ChatBox';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

// Datos simulados
const contacts = [
  {
    id: '1',
    name: 'Juan Pérez',
    role: 'Administrador',
    avatar: 'https://i.pravatar.cc/150?u=juan',
    lastMessage: 'Necesito revisar los documentos de la propiedad.',
    unread: 2,
    lastMessageTime: '2023-05-19T14:30:00'
  },
  {
    id: '2',
    name: 'María García',
    role: 'Gerente',
    avatar: 'https://i.pravatar.cc/150?u=maria',
    lastMessage: 'Los datos de contacto están actualizados.',
    unread: 0,
    lastMessageTime: '2023-05-18T10:15:00'
  },
  {
    id: '3',
    name: 'Carlos López',
    role: 'Captador',
    avatar: 'https://i.pravatar.cc/150?u=carlos',
    lastMessage: '¿Ya revisaste la nueva propiedad que subí?',
    unread: 1,
    lastMessageTime: '2023-05-17T16:45:00'
  },
  {
    id: '4',
    name: 'Ana Martínez',
    role: 'Captador',
    avatar: 'https://i.pravatar.cc/150?u=ana',
    lastMessage: 'Las fotos de la propiedad están listas.',
    unread: 0,
    lastMessageTime: '2023-05-16T09:30:00'
  },
  {
    id: '5',
    name: 'Pedro Rodríguez',
    role: 'Captador',
    avatar: 'https://i.pravatar.cc/150?u=pedro',
    lastMessage: 'Acabo de visitar el apartamento del centro.',
    unread: 0,
    lastMessageTime: '2023-05-15T13:20:00'
  }
];

const Messages = () => {
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Si es hoy, muestra la hora
      return date.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffDays === 1) {
      // Si fue ayer
      return 'Ayer';
    } else if (diffDays < 7) {
      // Si fue en la última semana, muestra el día
      return date.toLocaleDateString('es-ES', { weekday: 'short' });
    } else {
      // Si fue hace más de una semana, muestra la fecha
      return date.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit'
      });
    }
  };

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:pl-64 min-h-screen">
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Mensajes</h1>
            <p className="text-gray-500">Chats internos con el equipo</p>
          </div>
          
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="flex h-[calc(100vh-200px)]">
              {/* Lista de contactos */}
              <div className="w-full sm:w-80 border-r flex flex-col">
                <div className="p-3 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar chat..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                
                <ScrollArea className="flex-1">
                  {filteredContacts.length > 0 ? (
                    <div className="divide-y">
                      {filteredContacts.map((contact) => (
                        <div
                          key={contact.id}
                          className={cn(
                            "flex items-center p-3 cursor-pointer hover:bg-gray-50",
                            selectedContact.id === contact.id && "bg-realestate-primary/10"
                          )}
                          onClick={() => setSelectedContact(contact)}
                        >
                          <div className="relative">
                            <Avatar className="h-12 w-12 mr-3">
                              <AvatarImage src={contact.avatar} alt={contact.name} />
                              <AvatarFallback>{contact.name.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            {contact.unread > 0 && (
                              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-realestate-primary text-xs text-white">
                                {contact.unread}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between">
                              <h4 className="font-medium truncate">{contact.name}</h4>
                              <span className="text-xs text-gray-500">
                                {formatMessageTime(contact.lastMessageTime)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No se encontraron resultados.
                    </div>
                  )}
                </ScrollArea>
              </div>
              
              {/* Chat */}
              <div className="hidden sm:flex flex-col flex-1">
                <ChatBox 
                  recipientId={selectedContact.id}
                  recipientName={selectedContact.name}
                  recipientAvatar={selectedContact.avatar}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Messages;
