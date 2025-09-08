import React from 'react';
import { Category, Company, Expert } from '../types';
import ProfileForm from './ProfileForm';
import ExpertsList from './ExpertsList';

interface DashboardProps {
  activeCategory: Category;
  company: Company;
  onSaveCompany: (company: Company) => void;
  onExpertSelect: (expert: Expert) => void;
  showDashboard: boolean;
}

export default function Dashboard({ 
  activeCategory, 
  company, 
  onSaveCompany, 
  onExpertSelect,
  showDashboard
}: DashboardProps) {
  if (showDashboard) {
    return null; // Dashboard overview will be handled by parent
  }

  return (
    <div>
        {/* Profile Section */}
        <ProfileForm company={company} onSave={onSaveCompany} />
        
        {/* Experts Section */}
        {company.name && (
          <ExpertsList 
            category={activeCategory} 
            onExpertSelect={onExpertSelect}
          />
        )}
        
        {/* Welcome Message if no company profile */}
        {!company.name && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Bem-vindo ao GestorPro!
              </h2>
              <p className="text-gray-600 mb-6">
                Complete seu perfil empresarial acima para acessar nossos especialistas 
                e receber consultoria personalizada baseada nas características da sua empresa.
              </p>
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🚀</span>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}