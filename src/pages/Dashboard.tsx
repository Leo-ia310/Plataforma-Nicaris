
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
  { name: "Ene", value: 12 },
  { name: "Feb", value: 18 },
  { name: "Mar", value: 16 },
  { name: "Abr", value: 20 },
  { name: "May", value: 24 },
  { name: "Jun", value: 28 },
  { name: "Jul", value: 30 },
];

const visitsData = [
  { name: "Ene", value: 56 },
  { name: "Feb", value: 68 },
  { name: "Mar", value: 75 },
  { name: "Abr", value: 84 },
  { name: "May", value: 98 },
  { name: "Jun", value: 116 },
  { name: "Jul", value: 124 },
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

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    // Comprobar si el usuario está autenticado
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/'); // Redirigir al login si no hay usuario
    }
  }, [navigate]);

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
              value="152" 
              description="Propiedades activas en el sistema"
              icon={<Building className="h-5 w-5" />}
              trend="up"
              trendValue="+6% este mes"
            />
            <StatCard 
              title="Usuarios" 
              value="24" 
              description="Miembros del equipo activos"
              icon={<Users className="h-5 w-5" />}
              trend="up"
              trendValue="+2 en la última semana"
            />
            <StatCard 
              title="Documentos" 
              value="357" 
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

            {/* Propiedades recientes */}
            <div>
              <Card className="dashboard-card h-full">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-medium">Propiedades recientes</h3>
                  <Button className="bg-realestate-primary" size="sm" onClick={() => navigate('/properties/new')}>
                    <Plus className="h-4 w-4 mr-1" />
                    Nueva
                  </Button>
                </div>
                <div className="space-y-4">
                  {recentProperties.map((property) => (
                    <div 
                      key={property.id}
                      className="flex flex-col p-3 border rounded-md hover:shadow-sm transition-shadow cursor-pointer"
                      onClick={() => navigate(`/properties/${property.id}`)}
                    >
                      <div className="flex justify-between">
                        <h4 className="font-medium text-sm">{property.title}</h4>
                        <span className="font-bold text-realestate-primary text-sm">
                          {property.price}
                        </span>
                      </div>
                      <div className="mt-2 flex justify-between text-xs text-gray-500">
                        <span>{property.createdBy}</span>
                        <span>{formatDate(property.createdAt)}</span>
                      </div>
                      <div className="mt-2">
                        {property.status === 'pending' ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                            Pendiente de revisión
                          </span>
                        ) : property.status === 'approved' ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            Aprobada
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                            Rechazada
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="ghost" 
                    className="w-full text-realestate-primary font-medium"
                    onClick={() => navigate('/properties')}
                  >
                    Ver todas las propiedades
                  </Button>
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
