export interface Company {
  name: string;
  ownerName: string;
  size: 'micro' | 'pequena' | 'media' | 'grande';
  productService: string;
  customerPains: string;
  culture: string;
  userRole: string;
  dailyRoutine: string;
  additionalInfo: string;
}

export interface Expert {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  category: Category;
}

export type Category = 'vendas' | 'marketing' | 'pessoas' | 'processos' | 'financas' | 'estrategia';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'expert';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  expertId: string;
  messages: ChatMessage[];
}

export interface DashboardMetrics {
  totalConsultations: number;
  activeChats: number;
  completedGoals: number;
  weeklyProgress: number;
  topCategories: { category: Category; count: number }[];
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'chat' | 'goal' | 'insight';
  title: string;
  description: string;
  timestamp: Date;
  category: Category;
}

export interface BusinessGoal {
  id: string;
  title: string;
  description: string;
  category: Category;
  progress: number;
  targetDate: Date;
  status: 'pending' | 'in-progress' | 'completed';
}