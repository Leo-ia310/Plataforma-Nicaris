
import Sidebar from '@/components/dashboard/Sidebar';
import UserTable from '@/components/user/UserTable';

const Users = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:pl-64 min-h-screen">
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
            <p className="text-gray-500">Gestión de usuarios y roles</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <UserTable />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Users;
