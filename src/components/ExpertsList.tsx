import React from 'react';
import { Category, Expert } from '../types';
import { experts } from '../data/experts';
import ExpertCard from './ExpertCard';

interface ExpertsListProps {
  category: Category;
  onExpertSelect: (expert: Expert) => void;
}

const categoryLabels = {
  vendas: 'Vendas',
  marketing: 'Marketing',
  pessoas: 'Pessoas',
  processos: 'Processos',
  financas: 'Finanças',
  estrategia: 'Estratégia'
};

export default function ExpertsList({ category, onExpertSelect }: ExpertsListProps) {
  const categoryExperts = experts[category] || [];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Especialistas em {categoryLabels[category]}
        </h2>
        <p className="text-gray-600">
          Escolha um especialista para receber consultoria personalizada para sua empresa
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryExperts.map((expert) => (
          <ExpertCard
            key={expert.id}
            expert={expert}
            onChat={onExpertSelect}
          />
        ))}
      </div>

      {categoryExperts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            Nenhum especialista disponível nesta categoria ainda.
          </p>
        </div>
      )}
    </div>
  );
}