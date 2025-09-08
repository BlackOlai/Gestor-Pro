import React from 'react';
import { Category } from '../types';
import { 
  MessageCircle, 
  Target, 
  FileText, 
  BarChart3,
  Users,
  Zap
} from 'lucide-react';

interface QuickActionsProps {
  onCategoryChange: (category: Category) => void;
  onStartChat: () => void;
}

const quickActions = [
  {
    id: 'start-chat',
    title: 'Iniciar Consultoria',
    description: 'Converse com um especialista',
    icon: MessageCircle,
    color: 'bg-blue-500 hover:bg-blue-600',
    action: 'chat'
  },
  {
    id: 'view-sales',
    title: 'Estratégias de Vendas',
    description: 'Otimize seu processo comercial',
    icon: BarChart3,
    color: 'bg-green-500 hover:bg-green-600',
    action: 'vendas'
  },
  {
    id: 'team-management',
    title: 'Gestão de Pessoas',
    description: 'Desenvolva sua equipe',
    icon: Users,
    color: 'bg-purple-500 hover:bg-purple-600',
    action: 'pessoas'
  },
  {
    id: 'process-optimization',
    title: 'Otimizar Processos',
    description: 'Automatize e melhore fluxos',
    icon: Zap,
    color: 'bg-orange-500 hover:bg-orange-600',
    action: 'processos'
  }
];

export default function QuickActions({ onCategoryChange, onStartChat }: QuickActionsProps) {
  const handleAction = (action: string) => {
    if (action === 'chat') {
      onStartChat();
    } else {
      onCategoryChange(action as Category);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Target className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">Ações Rápidas</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => handleAction(action.action)}
              className={`${action.color} text-white p-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-left`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <Icon className="w-5 h-5" />
                <h4 className="font-semibold text-sm">{action.title}</h4>
              </div>
              <p className="text-xs opacity-90">{action.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}