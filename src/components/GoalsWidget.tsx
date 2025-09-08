import React, { useState } from 'react';
import { BusinessGoal } from '../types';
import { Target, CheckCircle, Clock, Plus, Edit, Trash2 } from 'lucide-react';
import GoalModal from './GoalModal';

interface GoalsWidgetProps {
  goals: BusinessGoal[];
  onAddGoal: (goalData: Omit<BusinessGoal, 'id'>) => void;
  onUpdateGoal: (id: string, goalData: Omit<BusinessGoal, 'id'>) => void;
  onDeleteGoal: (id: string) => void;
}

const statusColors = {
  pending: 'bg-gray-100 text-gray-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700'
};

const statusLabels = {
  pending: 'Pendente',
  'in-progress': 'Em Progresso',
  completed: 'Concluída'
};

export default function GoalsWidget({ goals, onAddGoal, onUpdateGoal, onDeleteGoal }: GoalsWidgetProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<BusinessGoal | null>(null);
  const completedGoals = goals.filter(goal => goal.status === 'completed').length;
  const totalGoals = goals.length;
  const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Target className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Metas Empresariais</h3>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Meta</span>
        </button>
      </div>

      {/* Progress Overview */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progresso Geral</span>
          <span className="text-sm font-bold text-gray-900">{completionRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {completedGoals} de {totalGoals} metas concluídas
        </p>
      </div>

      {/* Goals List */}
      <div className="space-y-3">
        {goals.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">Nenhuma meta definida</p>
            <p className="text-sm text-gray-400 mt-1">
              Defina metas para acompanhar o progresso
            </p>
          </div>
        ) : (
          goals.slice(0, 5).map((goal) => (
            <div key={goal.id} className="group flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex-shrink-0">
                {goal.status === 'completed' ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Clock className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {goal.title}
                  </h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[goal.status]}`}>
                    {statusLabels[goal.status]}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">{goal.progress}%</span>
                </div>
              </div>
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    setEditingGoal(goal);
                    setIsModalOpen(true);
                  }}
                  className="p-1 hover:bg-blue-100 rounded transition-colors"
                  title="Editar meta"
                >
                  <Edit className="w-3 h-3 text-blue-600" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Tem certeza que deseja excluir esta meta?')) {
                      onDeleteGoal(goal.id);
                    }
                  }}
                  className="p-1 hover:bg-red-100 rounded transition-colors"
                  title="Excluir meta"
                >
                  <Trash2 className="w-3 h-3 text-red-600" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Goal Modal */}
      <GoalModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingGoal(null);
        }}
        onSave={(goalData) => {
          if (editingGoal) {
            onUpdateGoal(editingGoal.id, goalData);
          } else {
            onAddGoal(goalData);
          }
          setEditingGoal(null);
        }}
        goal={editingGoal}
      />
    </div>
  );
}