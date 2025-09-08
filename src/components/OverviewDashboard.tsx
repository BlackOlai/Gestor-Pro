import React, { useMemo } from 'react';
import { Company, ChatSession, Category, DashboardMetrics, ActivityItem, BusinessGoal } from '../types';
import MetricCard from './MetricCard';
import ActivityFeed from './ActivityFeed';
import GoalsWidget from './GoalsWidget';
import InsightsWidget from './InsightsWidget';
import QuickActions from './QuickActions';
import { useGoals } from '../hooks/useGoals';
import { experts } from '../data/experts';
import { 
  MessageCircle, 
  Users, 
  Target, 
  TrendingUp,
  Calendar,
  Building2
} from 'lucide-react';

interface OverviewDashboardProps {
  company: Company;
  chatSessions: Record<string, ChatSession>;
  onCategoryChange: (category: Category) => void;
  onStartChat: () => void;
}

export default function OverviewDashboard({ 
  company, 
  chatSessions, 
  onCategoryChange,
  onStartChat 
}: OverviewDashboardProps) {
  const { goals, addGoal, updateGoal, deleteGoal } = useGoals();

  // Helper function to find expert by ID
  const findExpertById = (expertId: string) => {
    for (const category of Object.keys(experts) as Category[]) {
      const expert = experts[category].find(exp => exp.id === expertId);
      if (expert) return expert;
    }
    return null;
  };
  const metrics = useMemo(() => {
    const sessions = Object.values(chatSessions);
    const totalMessages = sessions.reduce((acc, session) => acc + session.messages.length, 0);
    const activeSessions = sessions.filter(session => 
      session.messages.length > 0 && 
      new Date().getTime() - new Date(session.messages[session.messages.length - 1].timestamp).getTime() < 24 * 60 * 60 * 1000
    ).length;

    return {
      totalConsultations: sessions.length,
      activeChats: activeSessions,
      totalMessages,
      weeklyProgress: Math.min(100, (sessions.length * 20))
    };
  }, [chatSessions]);

  // Generate sample activities based on chat sessions
  const recentActivities: ActivityItem[] = useMemo(() => {
    const activities: ActivityItem[] = [];
    
    Object.values(chatSessions).forEach(session => {
      if (session.messages.length > 0) {
        const lastMessage = session.messages[session.messages.length - 1];
        activities.push({
          id: `chat-${session.expertId}`,
          type: 'chat',
          title: 'Nova Consultoria',
          description: 'Conversa iniciada com especialista',
          timestamp: new Date(lastMessage.timestamp),
          category: 'vendas' // This would be determined by expert category
        });
      }
    });

    // Add sample insights
    if (company.name) {
      activities.push({
        id: 'insight-1',
        type: 'insight',
        title: 'Perfil Atualizado',
        description: `Perfil da ${company.name} foi atualizado com sucesso`,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        category: 'estrategia'
      });
    }

    return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);
  }, [chatSessions, company]);


  const recentCategories = Object.values(chatSessions)
    .map(session => {
      const expert = findExpertById(session.expertId);
      return expert?.category;
    })
    .filter((category): category is Category => category !== undefined);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-700 to-orange-400 rounded-xl text-white p-8">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {company.name ? `Bem-vindo, ${company.name}!` : 'Bem-vindo ao GestorPro!'}
            </h1>
            <p className="text-blue-100">
              {company.name 
                ? 'Acompanhe o progresso da sua empresa e acesse insights personalizados'
                : 'Complete seu perfil para começar a receber consultoria personalizada'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <MetricCard
          title="Total de Consultorias"
          value={metrics.totalConsultations}
          change="+12% esta semana"
          changeType="positive"
          icon={MessageCircle}
          color="blue"
        />
        <MetricCard
          title="Chats Ativos"
          value={metrics.activeChats}
          change="Últimas 24h"
          changeType="neutral"
          icon={Users}
          color="green"
        />
        <MetricCard
          title="Metas Concluídas"
          value={goals.filter(g => g.status === 'completed').length}
          change="+1 esta semana"
          changeType="positive"
          icon={Target}
          color="purple"
        />
        <MetricCard
          title="Progresso Semanal"
          value={`${metrics.weeklyProgress}%`}
          change="Meta: 100%"
          changeType="neutral"
          icon={TrendingUp}
          color="orange"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        {/* Left Column - Goals and Quick Actions */}
        <div className="space-y-6">
          <GoalsWidget 
            goals={goals} 
            onAddGoal={addGoal}
            onUpdateGoal={updateGoal}
            onDeleteGoal={deleteGoal}
          />
          <QuickActions 
            onCategoryChange={onCategoryChange}
            onStartChat={onStartChat}
          />
        </div>

        {/* Middle Column - Activity Feed */}
        <div>
          <ActivityFeed activities={recentActivities} />
        </div>

        {/* Right Column - Insights */}
        <div>
          <InsightsWidget 
            company={company} 
            recentCategories={recentCategories}
          />
        </div>
      </div>

      {/* Company Overview */}
      {company.name && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Visão Geral da Empresa</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700">Empresa</span>
                <p className="text-gray-800 font-medium">{company.name}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Tamanho</span>
                <p className="text-gray-800 capitalize">{company.size}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700">Seu Cargo</span>
                <p className="text-gray-800">{company.userRole || 'Não informado'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Produto/Serviço</span>
                <p className="text-gray-800 text-sm">{company.productService || 'Não informado'}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Principais Desafios</span>
                <p className="text-gray-800 text-sm">{company.customerPains || 'Não informado'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}