import React from 'react';
import { ActivityItem } from '../types';
import { MessageCircle, Target, Lightbulb, Clock } from 'lucide-react';

interface ActivityFeedProps {
  activities: ActivityItem[];
}

const activityIcons = {
  chat: MessageCircle,
  goal: Target,
  insight: Lightbulb
};

const categoryColors = {
  vendas: 'bg-blue-100 text-blue-700',
  marketing: 'bg-green-100 text-green-700',
  pessoas: 'bg-purple-100 text-purple-700',
  processos: 'bg-orange-100 text-orange-700',
  financas: 'bg-yellow-100 text-yellow-700',
  estrategia: 'bg-red-100 text-red-700'
};

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora mesmo';
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
    return `${Math.floor(diffInMinutes / 1440)}d atrás`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Atividade Recente</h3>
        <Clock className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">Nenhuma atividade recente</p>
            <p className="text-sm text-gray-400 mt-1">
              Comece conversando com um especialista
            </p>
          </div>
        ) : (
          activities.map((activity) => {
            const Icon = activityIcons[activity.type];
            return (
              <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${categoryColors[activity.category]}`}>
                      {activity.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
                  <p className="text-xs text-gray-400">{formatTimeAgo(activity.timestamp)}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}