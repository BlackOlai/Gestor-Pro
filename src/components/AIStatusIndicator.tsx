import { useState, useEffect } from 'react';
import { useAIConfig } from '../hooks/useAIConfig';
import { Wifi, WifiOff, Settings } from 'lucide-react';

interface AIStatusIndicatorProps {
  onOpenSettings?: () => void;
}

export default function AIStatusIndicator({ onOpenSettings }: AIStatusIndicatorProps) {
  const { isConfigured } = useAIConfig();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getStatusColor = () => {
    if (!isConfigured) return 'text-red-500';
    if (!isOnline) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStatusText = () => {
    if (!isConfigured) return 'IA não configurada';
    if (!isOnline) return 'Offline';
    return 'IA ativa';
  };

  const getStatusIcon = () => {
    if (!isOnline) return WifiOff;
    return Wifi;
  };

  const StatusIcon = getStatusIcon();

  return (
    <div className="flex items-center space-x-2 text-sm">
      <StatusIcon className={`w-4 h-4 ${getStatusColor()}`} />
      <span className={`${getStatusColor()} font-medium`}>
        {getStatusText()}
      </span>
      {onOpenSettings && (
        <button
          onClick={onOpenSettings}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Configurações da IA"
        >
          <Settings className="w-4 h-4 text-gray-400" />
        </button>
      )}
    </div>
  );
}
