
import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/components/ui/sonner";
import { User, Lock, Bell, Shield } from "lucide-react";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres",
  }),
  email: z.string().email({
    message: "Por favor ingresa un email válido",
  }),
  bio: z.string().max(160).optional(),
});

const securityFormSchema = z.object({
  currentPassword: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres",
  }),
  newPassword: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres",
  }),
  confirmPassword: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Las contraseñas no coinciden",
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type SecurityFormValues = z.infer<typeof securityFormSchema>;

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  
  // Valores iniciales (simulados)
  const [user, setUser] = useState({
    name: 'Admin Usuario',
    email: 'admin@ejemplo.com',
    bio: 'Administrador del sistema interno de gestión inmobiliaria.',
    role: 'admin',
    notifications: {
      email: true,
      push: true,
      propertyUpdates: true,
      teamMessages: true,
      systemAlerts: false,
    }
  });

  // Formulario de perfil
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      bio: user.bio || '',
    },
  });

  // Formulario de seguridad
  const securityForm = useForm<SecurityFormValues>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Función para manejar cambios en notificaciones
  const handleNotificationChange = (key: string, value: boolean) => {
    setUser(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
    
    toast.success(`Preferencia de notificación actualizada`);
  };

  // Guardar cambios de perfil
  function onProfileSubmit(values: ProfileFormValues) {
    // En una implementación real, conectarías con el backend
    console.log(values);
    setUser(prev => ({
      ...prev,
      name: values.name,
      email: values.email,
      bio: values.bio || '',
    }));
    
    toast.success("Perfil actualizado exitosamente");
  }

  // Cambiar contraseña
  function onSecuritySubmit(values: SecurityFormValues) {
    // En una implementación real, conectarías con el backend
    console.log(values);
    
    toast.success("Contraseña actualizada exitosamente");
    securityForm.reset({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:pl-64 min-h-screen">
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
            <p className="text-gray-500">Administra tu cuenta y preferencias</p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Perfil</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span>Seguridad</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span>Notificaciones</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Perfil */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Perfil</CardTitle>
                  <CardDescription>
                    Administra tu información de perfil
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src="https://i.pravatar.cc/150?u=admin" alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="mt-2">
                          <Button variant="outline" size="sm">
                            Cambiar imagen
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                        <FormField
                          control={profileForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bio</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  placeholder="Cuenta algo sobre ti..."
                                  className="resize-none h-20"
                                />
                              </FormControl>
                              <FormDescription>
                                Breve descripción personal. Máximo 160 caracteres.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex flex-col gap-1 border rounded-md p-4 bg-gray-50">
                          <div className="flex items-center">
                            <Shield className="h-5 w-5 text-realestate-primary mr-2" />
                            <div>
                              <p className="font-medium">Rol de usuario</p>
                              <p className="text-sm text-muted-foreground">
                                Tu nivel de acceso en el sistema
                              </p>
                            </div>
                          </div>
                          <div className="ml-7 mt-1">
                            <p className="text-sm mt-1">
                              Rol actual: <span className="font-medium">Administrador</span>
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Los cambios de rol deben ser gestionados por otro administrador.
                            </p>
                          </div>
                        </div>
                        
                        <Button type="submit" className="bg-realestate-primary">
                          Guardar cambios
                        </Button>
                      </form>
                    </Form>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Seguridad */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Seguridad</CardTitle>
                  <CardDescription>
                    Administra tu contraseña y seguridad de la cuenta
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="font-medium">Cambiar contraseña</h3>
                    <p className="text-sm text-muted-foreground">
                      Actualiza tu contraseña para mantener tu cuenta segura
                    </p>
                  </div>
                  
                  <Form {...securityForm}>
                    <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-6">
                      <FormField
                        control={securityForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contraseña actual</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={securityForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nueva contraseña</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormDescription>
                              Mínimo 6 caracteres, usa letras, números y símbolos para mayor seguridad.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={securityForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirmar nueva contraseña</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="bg-realestate-primary">
                        Actualizar contraseña
                      </Button>
                    </form>
                  </Form>
                  
                  <div className="border-t pt-6 mt-6">
                    <div className="space-y-1 mb-4">
                      <h3 className="font-medium">Sesiones activas</h3>
                      <p className="text-sm text-muted-foreground">
                        Administra los dispositivos donde has iniciado sesión
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 border rounded-md">
                        <div>
                          <p className="font-medium">Este dispositivo</p>
                          <p className="text-xs text-muted-foreground">Windows • Chrome • Madrid, España</p>
                        </div>
                        <Button variant="outline" size="sm" className="text-red-600">
                          Cerrar sesión
                        </Button>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 border rounded-md">
                        <div>
                          <p className="font-medium">iPhone 13</p>
                          <p className="text-xs text-muted-foreground">iOS • Safari • Madrid, España</p>
                        </div>
                        <Button variant="outline" size="sm" className="text-red-600">
                          Cerrar sesión
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Notificaciones */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notificaciones</CardTitle>
                  <CardDescription>
                    Configura cómo y cuándo quieres recibir notificaciones
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Canales de notificación</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p>Notificaciones por email</p>
                        <p className="text-sm text-muted-foreground">
                          Recibir notificaciones a través de correo electrónico
                        </p>
                      </div>
                      <Switch 
                        checked={user.notifications.email} 
                        onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p>Notificaciones push</p>
                        <p className="text-sm text-muted-foreground">
                          Recibir notificaciones en el navegador
                        </p>
                      </div>
                      <Switch 
                        checked={user.notifications.push} 
                        onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="border-t pt-6 space-y-4">
                    <h3 className="font-medium">Tipos de notificaciones</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p>Actualizaciones de propiedades</p>
                        <p className="text-sm text-muted-foreground">
                          Cambios de estado y actualizaciones en propiedades
                        </p>
                      </div>
                      <Switch 
                        checked={user.notifications.propertyUpdates} 
                        onCheckedChange={(checked) => handleNotificationChange('propertyUpdates', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p>Mensajes del equipo</p>
                        <p className="text-sm text-muted-foreground">
                          Nuevos mensajes de otros miembros del equipo
                        </p>
                      </div>
                      <Switch 
                        checked={user.notifications.teamMessages} 
                        onCheckedChange={(checked) => handleNotificationChange('teamMessages', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p>Alertas del sistema</p>
                        <p className="text-sm text-muted-foreground">
                          Notificaciones sobre mantenimiento y actualizaciones
                        </p>
                      </div>
                      <Switch 
                        checked={user.notifications.systemAlerts} 
                        onCheckedChange={(checked) => handleNotificationChange('systemAlerts', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Settings;
