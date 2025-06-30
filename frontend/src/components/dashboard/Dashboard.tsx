import React from 'react';
import StatsOverview from './StatsOverview';
import ExpenseChart from './ExpenseChart';
import RecentTransactions from './RecentTransactions';
import BudgetOverview from './BudgetOverview';

const Dashboard = () => {
  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="h2 fw-bold mb-2 text-dark">
          Dashboard
        </h2>
        <p className="text-secondary">
          Welcome back! Here's your financial overview.
        </p>
      </div>
      <div className="row g-4">
        <div className="col-12 col-lg-8 d-flex flex-column gap-4">
          <StatsOverview />
          <ExpenseChart />
          <RecentTransactions />
        </div>
        {/* You can add a sidebar or additional cards in col-lg-4 if needed */}
      </div>
    </div>
  );
};

export default Dashboard;
