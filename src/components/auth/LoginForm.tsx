
import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Lock, LogIn, Mail } from "lucide-react";

// Lista de usuarios predefinidos
const USUARIOS_PREDEFINIDOS = [
  { email: 'admin@inmobiliaria.com', password: 'admin123', name: 'Administrador Principal', role: 'admin' },
  { email: 'gerente@inmobiliaria.com', password: 'gerente123', name: 'Gerente General', role: 'manager' },
  { email: 'captador@inmobiliaria.com', password: 'captador123', name: 'Captador Inmobiliario', role: 'captador' }
];

const formSchema = z.object({
  email: z.string().email({
    message: "Por favor ingresa un email válido",
  }),
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres",
  }),
});

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError('');
    
    // Validar las credenciales contra la lista de usuarios predefinidos
    const usuarioEncontrado = USUARIOS_PREDEFINIDOS.find(
      user => user.email === values.email && user.password === values.password
    );
    
    setTimeout(() => {
      setIsLoading(false);
      
      if (usuarioEncontrado) {
        // Guardar información del usuario en localStorage
        localStorage.setItem('user', JSON.stringify({
          id: usuarioEncontrado.email,
          name: usuarioEncontrado.name,
          email: usuarioEncontrado.email,
          role: usuarioEncontrado.role
        }));
        
        toast.success("Inicio de sesión exitoso");
        navigate('/dashboard');
      } else {
        setError('Email o contraseña incorrectos');
        toast.error("Error de autenticación");
      }
    }, 1000);
  }

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-realestate-primary">Iniciar Sesión</h2>
        <p className="mt-2 text-sm text-gray-600">
          Accede a tu cuenta para gestionar propiedades
        </p>
      </div>
      
      {error && (
        <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input 
                      placeholder="tu@email.com" 
                      className="pl-10" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input 
                      type="password" 
                      placeholder="******" 
                      className="pl-10" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="text-sm text-right">
            <a 
              href="#" 
              className="text-realestate-primary hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-realestate-primary hover:bg-realestate-primary/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Iniciando sesión...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <LogIn className="h-5 w-5" />
                Iniciar Sesión
              </span>
            )}
          </Button>
        </form>
      </Form>
      
      <div className="mt-4 text-center text-xs text-gray-500">
        <p>Cuentas de demostración:</p>
        <p className="mt-1">admin@inmobiliaria.com / admin123</p>
        <p>gerente@inmobiliaria.com / gerente123</p>
        <p>captador@inmobiliaria.com / captador123</p>
      </div>
    </div>
  );
};

export default LoginForm;
