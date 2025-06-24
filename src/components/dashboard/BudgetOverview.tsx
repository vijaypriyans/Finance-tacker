
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useTransactions } from '../../contexts/TransactionContext';

const BudgetOverview = () => {
  const { transactions } = useTransactions();

  const budgets = [
    { category: 'Food & Dining', budget: 500, color: 'bg-orange-500' },
    { category: 'Transportation', budget: 200, color: 'bg-blue-500' },
    { category: 'Shopping', budget: 300, color: 'bg-purple-500' },
    { category: 'Entertainment', budget: 150, color: 'bg-pink-500' }
  ];

  const getSpentAmount = (category: string) => {
    return transactions
      .filter(t => t.type === 'expense' && t.category === category)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  };

  return (
    <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-white/20">
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {budgets.map((budget) => {
            const spent = getSpentAmount(budget.category);
            const percentage = (spent / budget.budget) * 100;
            const isOverBudget = percentage > 100;

            return (
              <div key={budget.category}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {budget.category}
                  </span>
                  <span className={`text-sm font-medium ${isOverBudget ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'}`}>
                    ${spent.toFixed(0)} / ${budget.budget}
                  </span>
                </div>
                <Progress 
                  value={Math.min(percentage, 100)} 
                  className="h-2 mb-1"
                />
                {isOverBudget && (
                  <p className="text-xs text-red-600">
                    Over budget by ${(spent - budget.budget).toFixed(0)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetOverview;
