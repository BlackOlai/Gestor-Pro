import React, { useState } from 'react';
import { Company } from '../types';
import { User, Building, Save } from 'lucide-react';

interface ProfileFormProps {
  company: Company;
  onSave: (company: Company) => void;
}

export default function ProfileForm({ company, onSave }: ProfileFormProps) {
  const [formData, setFormData] = useState<Company>(company);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsEditing(false);
  };

  const handleChange = (field: keyof Company, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isEditing && company.name) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{company.name}</h2>
              <p className="text-sm text-gray-500">Empresa {company.size}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Editar Perfil
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Proprietário:</span>
            <p className="text-gray-600 mt-1">{company.ownerName}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Produto/Serviço:</span>
            <p className="text-gray-600 mt-1">{company.productService}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Seu Cargo:</span>
            <p className="text-gray-600 mt-1">{company.userRole}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {company.name ? 'Editar Perfil' : 'Complete seu Perfil'}
          </h2>
          <p className="text-sm text-gray-500">
            Personalize suas consultorias com informações da empresa
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seu Nome
            </label>
            <input
              type="text"
              value={formData.ownerName}
              onChange={(e) => handleChange('ownerName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Ex: João Silva"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Empresa
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Ex: Tech Solutions Ltda"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tamanho da Empresa
          </label>
          <select
            value={formData.size}
            onChange={(e) => handleChange('size', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">Selecione...</option>
            <option value="micro">Micro (até 9 funcionários)</option>
            <option value="pequena">Pequena (10-49 funcionários)</option>
            <option value="media">Média (50-249 funcionários)</option>
            <option value="grande">Grande (250+ funcionários)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Produto ou Serviço Oferecido
          </label>
          <textarea
            value={formData.productService}
            onChange={(e) => handleChange('productService', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            rows={3}
            placeholder="Descreva brevemente o que sua empresa oferece..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Principais Dores dos Clientes
          </label>
          <textarea
            value={formData.customerPains}
            onChange={(e) => handleChange('customerPains', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            rows={3}
            placeholder="Quais são os principais problemas que seus clientes enfrentam?"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cultura da Empresa
            </label>
            <textarea
              value={formData.culture}
              onChange={(e) => handleChange('culture', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              rows={3}
              placeholder="Como você definiria a cultura da empresa?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seu Cargo/Função
            </label>
            <input
              type="text"
              value={formData.userRole}
              onChange={(e) => handleChange('userRole', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Ex: CEO, Gerente de Marketing, etc."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sua Rotina Diária
          </label>
          <textarea
            value={formData.dailyRoutine}
            onChange={(e) => handleChange('dailyRoutine', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            rows={3}
            placeholder="Descreva suas principais atividades e responsabilidades diárias..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Informações Adicionais
          </label>
          <textarea
            value={formData.additionalInfo}
            onChange={(e) => handleChange('additionalInfo', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            rows={3}
            placeholder="Outras informações relevantes sobre a empresa ou seus desafios..."
          />
        </div>

        <div className="flex justify-end space-x-4">
          {company.name && (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Save className="w-5 h-5" />
            <span>Salvar Perfil</span>
          </button>
        </div>
      </form>
    </div>
  );
}