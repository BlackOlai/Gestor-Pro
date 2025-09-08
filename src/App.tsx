import { useState, useEffect } from 'react';
import { Category, Company, Expert, ChatSession } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ChatModal from './components/ChatModal';
import OverviewDashboard from './components/OverviewDashboard';
import ServiceStatus from './components/ServiceStatus';
import SettingsModal from './components/SettingsModal';
import AuthModal from './components/AuthModal';
import { experts } from './data/experts';

const initialCompany: Company = {
  name: '',
  ownerName: '',
  size: 'micro',
  productService: '',
  customerPains: '',
  culture: '',
  userRole: '',
  dailyRoutine: '',
  additionalInfo: ''
};

function AppContent() {
  const [activeCategory, setActiveCategory] = useState<Category>('vendas');
  const [showDashboard, setShowDashboard] = useState(true);
  const [company, setCompany] = useLocalStorage<Company>('company-profile', initialCompany);
  const [chatSessions, setChatSessions] = useLocalStorage<Record<string, ChatSession>>('chat-sessions', {});
  const [activeChatExpert, setActiveChatExpert] = useState<Expert | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const { isAuthenticated } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);

  // Force re-render when authentication state changes
  useEffect(() => {
    setAuthChecked(true);
  }, [isAuthenticated]);

  const handleSaveCompany = (newCompany: Company) => {
    setCompany(newCompany);
  };

  const handleExpertSelect = (expert: Expert) => {
    setActiveChatExpert(expert);
  };

  const handleCloseChat = () => {
    setActiveChatExpert(null);
  };

  const handleSaveChatSession = (session: ChatSession) => {
    setChatSessions(prev => ({
      ...prev,
      [session.expertId]: session
    }));
  };

  const handleCategoryChange = (category: Category) => {
    setActiveCategory(category);
    setShowDashboard(false);
  };

  const handleDashboardClick = () => {
    setShowDashboard(true);
  };

  const handleStartChat = () => {
    // Find first expert from current category or default to sales
    const categoryExperts = experts[activeCategory] || experts.vendas;
    if (categoryExperts.length > 0) {
      setActiveChatExpert(categoryExperts[0]);
    }
  };

  const getCurrentChatSession = () => {
    return activeChatExpert ? chatSessions[activeChatExpert.id] || null : null;
  };

  // Show auth modal if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        <AuthModal isOpen={true} onClose={() => {}} />
      </div>
    );
  }

  // Ensure we've checked auth state before rendering main app
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">

      <Sidebar 
        activeCategory={activeCategory} 
        onCategoryChange={handleCategoryChange}
        onDashboardClick={handleDashboardClick}
        showDashboard={showDashboard}
      />
      
      <div className="lg:ml-64 min-h-screen p-4 sm:p-8 pt-16 lg:pt-8">
        <div className="max-w-7xl mx-auto">
          {showDashboard ? (
            <OverviewDashboard
              company={company}
              chatSessions={chatSessions}
              onCategoryChange={handleCategoryChange}
              onStartChat={handleStartChat}
            />
          ) : (
            <Dashboard
              activeCategory={activeCategory}
              company={company}
              onSaveCompany={handleSaveCompany}
              onExpertSelect={handleExpertSelect}
              showDashboard={showDashboard}
            />
          )}
        </div>
      </div>

      {activeChatExpert && (
        <ChatModal
          expert={activeChatExpert}
          company={company}
          isOpen={!!activeChatExpert}
          onClose={handleCloseChat}
          chatSession={getCurrentChatSession()}
          onSaveSession={handleSaveChatSession}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      {/* AI Status Indicator */}
      <div className="fixed bottom-4 right-4 z-30">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
          <ServiceStatus />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;