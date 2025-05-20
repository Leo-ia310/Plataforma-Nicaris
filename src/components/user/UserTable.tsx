
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Search, MoreHorizontal, Edit, Trash, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

// Definición del tipo de usuario
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'captador';
  status: 'active' | 'inactive';
  lastActive: string;
}

// Datos predefinidos para usuarios
const USERS_DATA: User[] = [
  {
    id: '1',
    name: 'Administrador Principal',
    email: 'admin@inmobiliaria.com',
    role: 'admin',
    status: 'active',
    lastActive: '2023-05-20T10:30:00',
  },
  {
    id: '2',
    name: 'Gerente General',
    email: 'gerente@inmobiliaria.com',
    role: 'manager',
    status: 'active',
    lastActive: '2023-05-19T14:45:00',
  },
  {
    id: '3',
    name: 'Captador Inmobiliario',
    email: 'captador@inmobiliaria.com',
    role: 'captador',
    status: 'active',
    lastActive: '2023-05-18T09:15:00',
  }
];

const UserTable = () => {
  const [users, setUsers] = useState<User[]>(USERS_DATA);
  const [searchTerm, setSearchTerm] = useState('');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'manager':
        return 'Gerente';
      case 'captador':
        return 'Captador';
      default:
        return role;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      default:
        return '';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'inactive':
        return 'Inactivo';
      default:
        return status;
    }
  };

  const handleDeleteUser = (userId: string) => {
    // En una implementación real, conectarías con el backend
    setUsers(users.filter(user => user.id !== userId));
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getRoleName(user.role).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-[300px]"
          />
        </div>
        <Button className="bg-realestate-primary">
          <UserPlus className="h-4 w-4 mr-2" />
          Añadir usuario
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Último acceso</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        user.role === 'admin' && "border-blue-500 text-blue-700",
                        user.role === 'manager' && "border-purple-500 text-purple-700",
                        user.role === 'captador' && "border-green-500 text-green-700"
                      )}
                    >
                      {getRoleName(user.role)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getStatusColor(user.status)}>
                      {getStatusLabel(user.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(user.lastActive)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer">
                          <Edit className="h-4 w-4 mr-2" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="cursor-pointer text-red-600 focus:text-red-600" 
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          <span>Eliminar</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No se encontraron usuarios.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserTable;
