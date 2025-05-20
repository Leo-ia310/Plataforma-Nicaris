
import Sidebar from '@/components/dashboard/Sidebar';
import PropertyForm from '@/components/property/PropertyForm';

const PropertyNew = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:pl-64 min-h-screen">
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Nueva Propiedad</h1>
            <p className="text-gray-500">Completa el formulario para agregar una nueva propiedad</p>
          </div>
          
          <PropertyForm />
        </main>
      </div>
    </div>
  );
};

export default PropertyNew;
