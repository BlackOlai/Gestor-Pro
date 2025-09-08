import { useState } from 'react';
import { Category } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { 
  TrendingUp, 
  Megaphone, 
  Users, 
  Settings, 
  DollarSign, 
  Target,
  Building2,
  BarChart3,
  Menu,
  X,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
  onDashboardClick: () => void;
  showDashboard: boolean;
}

const categories = [
  { id: 'vendas' as Category, label: 'Vendas', icon: TrendingUp },
  { id: 'marketing' as Category, label: 'Marketing', icon: Megaphone },
  { id: 'pessoas' as Category, label: 'Pessoas', icon: Users },
  { id: 'processos' as Category, label: 'Processos', icon: Settings },
  { id: 'financas' as Category, label: 'Finanças', icon: DollarSign },
  { id: 'estrategia' as Category, label: 'Estratégia', icon: Target },
];

export default function Sidebar({ activeCategory, onCategoryChange, onDashboardClick, showDashboard }: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCategoryClick = (category: Category) => {
    onCategoryChange(category);
    setIsMobileMenuOpen(false); // Close mobile menu after selection
  };

  const handleDashboardClick = () => {
    onDashboardClick();
    setIsMobileMenuOpen(false); // Close mobile menu after selection
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 mobile-button-neomorphism rounded-2xl border-0"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-800 icon-morph" />
        ) : (
          <Menu className="w-6 h-6 text-gray-800 icon-morph" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 sidebar-neomorphism border-0 z-40 transform transition-all duration-500 ease-out ${
        isMobileMenuOpen ? 'translate-x-0 morph-in' : '-translate-x-full lg:translate-x-0 lg:morph-in'
      }`}>
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 logo-neomorphism rounded-2xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white icon-morph" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">GestorPro</h1>
            <p className="text-xs text-gray-800">Gestão Profissional Inteligente</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <button
              onClick={handleDashboardClick}
              className={`w-full flex items-center space-x-3 px-4 py-4 rounded-2xl mb-2 ${
                showDashboard
                  ? 'nav-item-active text-blue-700'
                  : 'nav-item-neomorphism text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className={`w-5 h-5 icon-morph ${showDashboard ? 'text-blue-700' : 'text-gray-800'}`} />
              <span className="font-medium">Dashboard</span>
              {showDashboard && (
                <div className="w-2 h-2 bg-blue-500 rounded-full ml-auto morph-in"></div>
              )}
            </button>
          </li>
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = !showDashboard && activeCategory === category.id;
            
            return (
              <li key={category.id}>
                <button
                  onClick={() => handleCategoryClick(category.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-4 rounded-2xl mb-2 ${
                    isActive
                      ? 'nav-item-active text-blue-700'
                      : 'nav-item-neomorphism text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 icon-morph ${isActive ? 'text-blue-600' : 'text-gray-800'}`} />
                  <span className="font-medium">{category.label}</span>
                  {isActive && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full ml-auto morph-in"></div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-600 sidebar-neomorphism">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="w-10 h-10 user-avatar-neomorphism rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-800 truncate">{user?.name || 'Usuário'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-2 nav-item-neomorphism rounded-xl transition-all hover:shadow-neomorphism-small"
            title="Sair"
          >
            <LogOut className="w-4 h-4 text-gray-600 icon-morph" />
          </button>
        </div>
      </div>
      </div>
    </>
  );
}