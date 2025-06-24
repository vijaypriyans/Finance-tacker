
import React from 'react';
import StatsOverview from './StatsOverview';
import ExpenseChart from './ExpenseChart';
import RecentTransactions from './RecentTransactions';
import BudgetOverview from './BudgetOverview';
import AIInsights from './AIInsights';

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back! Here's your financial overview.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <StatsOverview />
          <ExpenseChart />
          <RecentTransactions />
        </div>
        
        <div className="space-y-8">
          <BudgetOverview />
          <AIInsights />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
