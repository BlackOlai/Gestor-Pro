import { useState, useEffect } from 'react';
import { BusinessGoal } from '../types';

export const useGoals = () => {
  const [goals, setGoals] = useState<BusinessGoal[]>(() => {
    try {
      const stored = localStorage.getItem('business-goals');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        return parsed.map((goal: any) => ({
          ...goal,
          targetDate: new Date(goal.targetDate)
        }));
      }
      return [];
    } catch {
      return [];
    }
  });

  // Persist goals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('business-goals', JSON.stringify(goals));
  }, [goals]);

  const addGoal = (goalData: Omit<BusinessGoal, 'id'>) => {
    const newGoal: BusinessGoal = {
      ...goalData,
      id: Date.now().toString()
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoal = (id: string, goalData: Omit<BusinessGoal, 'id'>) => {
    setGoals(prev => prev.map(goal => 
      goal.id === id 
        ? { ...goalData, id }
        : goal
    ));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
  };

  const getGoalById = (id: string) => {
    return goals.find(goal => goal.id === id) || null;
  };

  const getGoalsByCategory = (category: string) => {
    return goals.filter(goal => goal.category === category);
  };

  const getGoalsByStatus = (status: BusinessGoal['status']) => {
    return goals.filter(goal => goal.status === status);
  };

  const getCompletionRate = () => {
    if (goals.length === 0) return 0;
    const completedGoals = goals.filter(goal => goal.status === 'completed').length;
    return Math.round((completedGoals / goals.length) * 100);
  };

  const getOverdueGoals = () => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    return goals.filter(goal => 
      goal.status !== 'completed' && 
      new Date(goal.targetDate) < today
    );
  };

  return {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    getGoalById,
    getGoalsByCategory,
    getGoalsByStatus,
    getCompletionRate,
    getOverdueGoals
  };
};
