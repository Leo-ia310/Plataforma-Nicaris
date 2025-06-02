import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/dashboard/Sidebar';
import StatCard from '@/components/dashboard/StatCard';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Building, 
  Users, 
  FileText, 
  MessageCircle, 
  TrendingUp,
  Eye,
  Plus
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Datos simulados
const propertyData = [
  { name: "Ene", value: 0},
  { name: "Feb", value: 0 },
  { name: "Mar", value: 0 },
  { name: "Abr", value: 0 },
  { name: "May", value: 0 },
  { name: "Jun", value: 0 },
  { name: "Jul", value: 0 },
];

const visitsData = [
  { name: "Ene", value: 2 },
  { name: "Feb", value: 0 },
  { name: "Mar", value: 2},
  { name: "Abr", value: 0 },
  { name: "May", value: 0 },
  { name: "Jun", value: 0 },
  { name: "Jul", value: 0 },
];

const recentProperties = [
  {
    id: '1',
    title: 'Apartamento de lujo en centro',
    price: '180.000 $',
    status: 'pending',
    createdBy: 'Carlos López',
    createdAt: '2023-05-19T14:30:00',
  },
  {
    id: '2',
    title: 'Chalet con piscina y jardín',
    price: '320.000 $',
    status: 'approved',
    createdBy: 'María García',
    createdAt: '2023-05-18T10:15:00',
  },
  {
    id: '3',
    title: 'Local comercial en zona empresarial',
    price: '145.000 $',
    status: 'pending',
    createdBy: 'Pedro Rodríguez',
    createdAt: '2023-05-17T16:45:00',
  },
];

const predefinedUsers = [
  { username: 'user1', password: 'pass1' },
  { username: 'user2', password: 'pass2' },
  { username: 'user3', password: 'pass3' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser ] = useState<any>(null);
  const [totalProperties, setTotalProperties] = useState(0);
  const [totalUsers, setTotalUsers] = useState(predefinedUsers.length); // Contar usuarios predefinidos

  useEffect(() => {
    // Comprobar si el usuario está autenticado
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser (JSON.parse(userData));
    } else {
      navigate('/'); // Redirigir al login si no hay usuario
    }
  }, [navigate]);

  useEffect(() => {
    // Obtener el total de propiedades desde la hoja de cálculo
    const fetchPropertiesCount = async () => {
      try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbztO2NQTdQAJ56OrI-i8XeoBLbqNFXHU1DD0zyPcwqiDgVlb0K04upvPGLsYuvuc4-wEw/exec");
        const data = await response.json();
        // Suponiendo que 'data' es un arreglo de propiedades
        setTotalProperties(data.length); // Contar el número de filas
      } catch (error) {
        console.error("Error al obtener el conteo de propiedades:", error);
      }
    };

    fetchPropertiesCount();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  if (!user) {
    return null; // O un componente de carga
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:pl-64 min-h-screen">
        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
            <p className="text-gray-500">Bienvenido de nuevo, {user.name}</p>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              title="Propiedades Totales" 
              value={totalProperties.toString()} // Mostrar el total de propiedades
              description="Propiedades activas en el sistema"
              icon={<Building className="h-5 w-5" />}
              trend="up"
              trendValue=""
            />
            <StatCard 
              title="Usuarios" 
              value={4} // Mostrar el total de usuarios predefinidos
              description="Miembros del equipo activos"
              icon={<Users className="h-5 w-5" />}
              trend="up"
              trendValue="+2 en la última semana"
            />
            <StatCard 
              title="Documentos" 
              value="0" 
              description="Archivos en el repositorio"
              icon={<FileText className="h-5 w-5" />}
              trend="up"
              trendValue="+15% este mes"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Gráficos */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="dashboard-card">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Nuevas propiedades</h3>
                    <p className="text-sm text-muted-foreground">Propiedades añadidas por mes</p>
                  </div>
                  <div className="h-8 w-8 rounded-md bg-realestate-primary/10 p-1.5 text-realestate-primary">
                    <TrendingUp className="h-full w-full" />
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={propertyData}
                      margin={{
                        top: 5,
                        right: 10,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis 
                        dataKey="name" 
                        tickLine={false} 
                        axisLine={false} 
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis 
                        tickLine={false} 
                        axisLine={false} 
                        style={{ fontSize: '12px' }}
                      />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#0F52BA"
                        strokeWidth={2}
                        dot={{ r: 4, strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="dashboard-card">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Visitas a propiedades</h3>
                    <p className="text-sm text-muted-foreground">Visitas registradas por mes</p>
                  </div>
                  <div className="h-8 w-8 rounded-md bg-realestate-primary/10 p-1.5 text-realestate-primary">
                    <Eye className="h-full w-full" />
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={visitsData}
                      margin={{
                        top: 5,
                        right: 10,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis 
                        dataKey="name" 
                        tickLine={false} 
                        axisLine={false} 
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis 
                        tickLine={false} 
                        axisLine={false} 
                        style={{ fontSize: '12px' }}
                      />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#FF9800"
                        strokeWidth={2}
                        dot={{ r: 4, strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
