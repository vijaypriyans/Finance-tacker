import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactions } from '../contexts/TransactionContext';

const StatsOverview = () => {
  const { transactions } = useTransactions();

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-emerald-100">Total Income</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{formatCurrency(totalIncome)}</div>
          <p className="text-emerald-200 text-sm">This month</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-red-100">Total Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{formatCurrency(totalExpenses)}</div>
          <p className="text-red-200 text-sm">This month</p>
        </CardContent>
      </Card>

      <Card className={`bg-gradient-to-br ${balance >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} text-white border-0`}>
        <CardHeader className="pb-2">
          <CardTitle className={balance >= 0 ? 'text-blue-100' : 'text-orange-100'}>
            Net Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{formatCurrency(balance)}</div>
          <p className={`${balance >= 0 ? 'text-blue-200' : 'text-orange-200'} text-sm`}>
            {balance >= 0 ? 'Surplus' : 'Deficit'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverview;
