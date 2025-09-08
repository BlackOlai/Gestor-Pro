import React from 'react';
import { Company, Category } from '../types';
import { Lightbulb, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

interface InsightsWidgetProps {
  company: Company;
  recentCategories: Category[];
}

export default function InsightsWidget({ company, recentCategories }: InsightsWidgetProps) {
  const generateInsights = () => {
    const insights = [];

    // Company size insights
    if (company.size === 'micro') {
      insights.push({
        type: 'tip',
        title: 'Foco em Automação',
        description: 'Para empresas micro, automatizar processos repetitivos pode liberar tempo valioso para crescimento.',
        icon: TrendingUp,
        color: 'blue'
      });
    } else if (company.size === 'grande') {
      insights.push({
        type: 'tip',
        title: 'Governança Corporativa',
        description: 'Empresas grandes se beneficiam de estruturas de governança bem definidas.',
        icon: CheckCircle,
        color: 'green'
      });
    }

    // Category-based insights
    if (recentCategories.includes('vendas')) {
      insights.push({
        type: 'insight',
        title: 'Oportunidade em Vendas',
        description: 'Considere implementar um CRM para melhorar o acompanhamento de leads.',
        icon: TrendingUp,
        color: 'blue'
      });
    }

    if (recentCategories.includes('marketing')) {
      insights.push({
        type: 'insight',
        title: 'Marketing Digital',
        description: 'Empresas que investem em marketing digital crescem 2.8x mais rápido.',
        icon: Lightbulb,
        color: 'orange'
      });
    }

    // Default insights if none generated
    if (insights.length === 0) {
      insights.push({
        type: 'tip',
        title: 'Complete seu Perfil',
        description: 'Preencha mais informações para receber insights personalizados.',
        icon: AlertCircle,
        color: 'orange'
      });
    }

    return insights.slice(0, 3);
  };

  const insights = generateInsights();

  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    orange: 'bg-orange-50 border-orange-200',
    purple: 'bg-purple-50 border-purple-200'
  };

  const iconColors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    orange: 'text-orange-600',
    purple: 'text-purple-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Lightbulb className="w-6 h-6 text-orange-600" />
        <h3 className="text-lg font-semibold text-gray-800">Insights Personalizados</h3>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div 
              key={index}
              className={`p-4 rounded-lg border ${colorClasses[insight.color]} transition-all duration-300 hover:shadow-sm`}
            >
              <div className="flex items-start space-x-3">
                <Icon className={`w-5 h-5 ${iconColors[insight.color]} flex-shrink-0 mt-0.5`} />
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-1">
                    {insight.title}
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}