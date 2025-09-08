import { useServiceStatus } from '../services/apiService';
import { CheckCircle, XCircle, Loader, AlertTriangle } from 'lucide-react';

export default function ServiceStatus() {
  const { isAvailable, isLoading, error } = useServiceStatus();

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-blue-600">
        <Loader className="w-4 h-4 animate-spin" />
        <span className="text-sm">Verificando serviço...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center space-x-2 text-red-600">
        <XCircle className="w-4 h-4" />
        <span className="text-sm">Serviço indisponível</span>
      </div>
    );
  }

  if (isAvailable) {
    return (
      <div className="flex items-center space-x-2 text-green-600">
        <CheckCircle className="w-4 h-4" />
        <span className="text-sm">IA Online</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 text-orange-600">
      <AlertTriangle className="w-4 h-4" />
      <span className="text-sm">Configurando...</span>
    </div>
  );
}
