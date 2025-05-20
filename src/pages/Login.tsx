
import LoginForm from "@/components/auth/LoginForm";
import { Building } from "lucide-react";

const Login = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
        <div className="flex justify-center">
          <Building className="h-12 w-12 text-realestate-primary" />
        </div>
        <h2 className="mt-3 text-center text-3xl font-extrabold text-gray-900">
          Nicaris Bienes Raices
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Plataforma de gestión de Nicaris
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
