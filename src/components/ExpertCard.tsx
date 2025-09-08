import React from 'react';
import { Expert } from '../types';
import { MessageCircle } from 'lucide-react';

interface ExpertCardProps {
  expert: Expert;
  onChat: (expert: Expert) => void;
}

export default function ExpertCard({ expert, onChat }: ExpertCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <img
            src={expert.avatar}
            alt={expert.name}
            className="w-[6rem] h-[6rem] rounded-full object-cover p-1.5 bg-gradient-to-br from-blue-700 to-orange-400"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {expert.name}
          </h3>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            {expert.specialty}
          </p>
          
          <button
            onClick={() => onChat(expert)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Conversar</span>
          </button>
        </div>
      </div>
    </div>
  );
}