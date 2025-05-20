
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, File } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  attachment?: {
    name: string;
    url: string;
    type: string;
  };
}

interface ChatBoxProps {
  recipientId: string;
  recipientName: string;
  recipientAvatar?: string;
}

const ChatBox = ({ recipientId, recipientName, recipientAvatar }: ChatBoxProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Simular cargar mensajes
  useEffect(() => {
    // En una implementación real, cargarías mensajes desde el backend
    const demoMessages: Message[] = [
      {
        id: '1',
        senderId: 'recipient',
        senderName: recipientName,
        senderAvatar: recipientAvatar,
        content: '¡Hola! ¿Cómo puedo ayudarte con la propiedad?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // Ayer
      },
      {
        id: '2',
        senderId: 'currentUser',
        senderName: 'Tú',
        content: 'Hola, tengo una consulta sobre los documentos necesarios para la propiedad',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // Hace 2 horas
      },
      {
        id: '3',
        senderId: 'recipient',
        senderName: recipientName,
        senderAvatar: recipientAvatar,
        content: 'Claro, necesitarás el contrato, el certificado energético y el informe de tasación. ¿Los tienes?',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // Hace 30 minutos
      },
      {
        id: '4',
        senderId: 'currentUser',
        senderName: 'Tú',
        content: 'Tengo el contrato y el certificado, pero no el informe de tasación. ¿Dónde puedo conseguirlo?',
        timestamp: new Date(Date.now() - 1000 * 60 * 25), // Hace 25 minutos
      },
      {
        id: '5',
        senderId: 'recipient',
        senderName: recipientName,
        senderAvatar: recipientAvatar,
        content: 'Te envío el formulario para solicitar la tasación. Solo necesitas completarlo y enviarlo al departamento de valoraciones.',
        timestamp: new Date(Date.now() - 1000 * 60 * 20), // Hace 20 minutos
      },
      {
        id: '6',
        senderId: 'recipient',
        senderName: recipientName,
        senderAvatar: recipientAvatar,
        content: 'Aquí tienes el formulario:',
        timestamp: new Date(Date.now() - 1000 * 60 * 19), // Hace 19 minutos
        attachment: {
          name: 'Formulario_Tasacion.pdf',
          url: '#',
          type: 'application/pdf',
        },
      },
    ];
    
    setMessages(demoMessages);
  }, [recipientId, recipientName, recipientAvatar]);

  // Scroll al último mensaje cuando se actualiza la lista
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '' && !attachment) return;
    
    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: 'currentUser',
      senderName: 'Tú',
      content: newMessage,
      timestamp: new Date(),
      ...(attachment && {
        attachment: {
          name: attachment.name,
          url: URL.createObjectURL(attachment),
          type: attachment.type,
        },
      }),
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    setAttachment(null);
    
    // Simular respuesta automática (sólo para demo)
    if (messages.length % 3 === 0) {
      setTimeout(() => {
        const autoReply: Message = {
          id: Date.now().toString(),
          senderId: 'recipient',
          senderName: recipientName,
          senderAvatar: recipientAvatar,
          content: '¡Gracias por tu mensaje! Te responderé lo antes posible.',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, autoReply]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setAttachment(files[0]);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const formatMessageDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 1) {
      return 'Ahora';
    } else if (diffMins < 60) {
      return `Hace ${diffMins} min`;
    } else if (diffHours < 24) {
      return `Hace ${diffHours} h`;
    } else if (diffDays === 1) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-white">
      {/* Header */}
      <div className="flex items-center p-4 border-b bg-realestate-primary/10">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={recipientAvatar} alt={recipientName} />
          <AvatarFallback>{recipientName.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{recipientName}</h3>
          <p className="text-xs text-muted-foreground">En línea</p>
        </div>
      </div>
      
      {/* Messages area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={cn(
                "flex max-w-[75%]",
                message.senderId === 'currentUser' ? "ml-auto" : ""
              )}
            >
              {message.senderId !== 'currentUser' && (
                <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                  <AvatarImage src={message.senderAvatar} alt={message.senderName} />
                  <AvatarFallback>{message.senderName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              )}
              
              <div>
                <div 
                  className={cn(
                    "rounded-lg p-3",
                    message.senderId === 'currentUser' 
                      ? "bg-realestate-primary text-white rounded-br-none" 
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  )}
                >
                  {message.content}
                  
                  {message.attachment && (
                    <div className="mt-2 p-2 bg-white bg-opacity-20 rounded flex items-center">
                      <File className="h-4 w-4 mr-2" />
                      <a 
                        href={message.attachment.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm underline"
                      >
                        {message.attachment.name}
                      </a>
                    </div>
                  )}
                </div>
                
                <div className={cn(
                  "text-xs mt-1 text-gray-500",
                  message.senderId === 'currentUser' ? "text-right" : ""
                )}>
                  {formatMessageDate(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      {/* Attachment preview */}
      {attachment && (
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-t">
          <File className="h-4 w-4 text-gray-500" />
          <span className="text-sm truncate">{attachment.name}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-5 w-5 p-0 rounded-full"
            onClick={() => setAttachment(null)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
      
      {/* Input area */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Escribe un mensaje..."
            className="flex-1"
          />
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAttachment}
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          
          <Button 
            type="button" 
            variant="outline" 
            size="icon" 
            onClick={triggerFileInput}
          >
            <File className="h-4 w-4" />
          </Button>
          
          <Button 
            type="button" 
            size="icon" 
            onClick={handleSendMessage}
            disabled={newMessage.trim() === '' && !attachment}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
