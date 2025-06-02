
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Home, 
  Building, 
  Users, 
  MessageCircle, 
  FileText, 
  HelpCircle, 
  Settings, 
  LogOut, 
  Menu, 
  X 
} from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarLink = {
  label: string;
  path: string;
  icon: React.ReactNode;
  allowedRoles: string[];
};

const SidebarLinks: SidebarLink[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    allowedRoles: ["admin", "manager", "captador", "Vendedor"]
  },
  {
    label: "Propiedades",
    path: "/properties",
    icon: <Building className="h-5 w-5" />,
    allowedRoles: ["admin", "manager", "captador", "Vendedor"]
  },
  {
    label: "FAQ",
    path: "/faq",
    icon: <HelpCircle className="h-5 w-5" />,
    allowedRoles: ["admin", "manager", "captador", "Vendedor"]
  },
  //{
   // label: "Configuración",
   /// path: "/settings",
   // icon: <Settings className="h-5 w-5" />,
   // allowedRoles: ["admin", "manager"]
 // }
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [userRole, setUserRole] = useState<string>("admin"); // Predeterminado
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Efecto para obtener el rol del usuario del localStorage
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setUserRole(userData.role);
    }

    // Cerrar el menú móvil al cambiar de ruta
    const handleRouteChange = () => {
      setMobileOpen(false);
    };

    // Limpiar al desmontar
    return () => {
      handleRouteChange();
    };
  }, [location.pathname]);

  const filteredLinks = SidebarLinks.filter(link => 
    link.allowedRoles.includes(userRole)
  );

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <>
      {/* Botón del menú móvil */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-4 right-4 z-50"
        onClick={toggleMobileMenu}
      >
        {mobileOpen ? <X /> : <Menu />}
      </Button>

      {/* Sidebar para escritorio */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen transition-all duration-300 bg-white border-r border-gray-200 hidden lg:block",
          collapsed ? "w-20" : "w-64"
        )}
      >
        <div className="h-full flex flex-col">
          <div className={cn(
            "flex items-center justify-between h-16 px-4 border-b",
            collapsed ? "justify-center" : "justify-between"
          )}>
            {!collapsed && (
              <Link to="/dashboard" className="flex items-center gap-2">
                <Home className="h-6 w-6 text-realestate-primary" />
                <span className="font-bold text-xl text-realestate-primary">Nicaris</span>
              </Link>
            )}
            {collapsed && (
              <Link to="/dashboard">
                <Home className="h-6 w-6 text-realestate-primary" />
              </Link>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className={collapsed ? "hidden" : ""}
              onClick={toggleCollapse}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-5">
            <nav className="space-y-1">
              {filteredLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "sidebar-link",
                    location.pathname === link.path && "active",
                    collapsed && "justify-center px-2"
                  )}
                >
                  {link.icon}
                  {!collapsed && <span>{link.label}</span>}
                </Link>
              ))}
            </nav>
          </div>

          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className={cn(
                "sidebar-link text-red-500 hover:text-red-700 hover:bg-red-50 w-full",
                collapsed && "justify-center px-2"
              )}
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              {!collapsed && <span>Cerrar Sesión</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Sidebar móvil */}
      <div className={cn(
        "fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity",
        mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        <aside className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-gray-200 transition-transform",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between h-16 px-4 border-b">
              <Link to="/dashboard" className="flex items-center gap-2">
                <Home className="h-6 w-6 text-realestate-primary" />
                <span className="font-bold text-xl text-realestate-primary">Nicaris</span>
              </Link>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={toggleMobileMenu}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-5">
              <nav className="space-y-1">
                {filteredLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "sidebar-link",
                      location.pathname === link.path && "active"
                    )}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="p-4 border-t">
              <Button
                variant="ghost"
                className="sidebar-link text-red-500 hover:text-red-700 hover:bg-red-50 w-full"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                <span>Cerrar Sesión</span>
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Sidebar;
