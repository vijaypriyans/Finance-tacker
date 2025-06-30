import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useTransactions } from '../../contexts/TransactionContext';

const DEFAULT_BUDGETS = [
  { category: 'Transportation', budget: 200, color: 'bg-blue-500', protected: true },
  { category: 'Shopping', budget: 300, color: 'bg-purple-500', protected: true },
  { category: 'Entertainment', budget: 150, color: 'bg-pink-500', protected: true },
  { category: 'Housing', budget: 1000, color: 'bg-green-500', protected: true },
];

const LOCAL_STORAGE_KEY = 'userBudgets';

const BudgetOverview = () => {
  const { transactions } = useTransactions();
  const [budgets, setBudgets] = useState(DEFAULT_BUDGETS);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [addMode, setAddMode] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newBudget, setNewBudget] = useState('');

  // Load budgets from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      let filtered = JSON.parse(saved).filter((b: any) => b.category !== 'Food & Dining');
      // Ensure 'Housing' is present
      if (!filtered.some((b: any) => b.category === 'Housing')) {
        filtered.push({ category: 'Housing', budget: 1000, color: 'bg-green-500', protected: true });
      }
      setBudgets(filtered);
    }
  }, []);

  // Save budgets to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(budgets));
  }, [budgets]);

  const getSpentAmount = (category: string) => {
    return transactions
      .filter(t => t.type === 'expense' && t.category === category)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  };

  const hasBudget = budgets.some(b => b.budget > 0);
  if (!hasBudget) return null;

  const handleEdit = (idx: number, value: number) => {
    const newBudgets = budgets.map((b, i) => i === idx ? { ...b, budget: value } : b);
    setBudgets(newBudgets);
    setEditIndex(null);
    setEditValue('');
  };

  const handleAddCategory = () => {
    if (!newCategory.trim() || isNaN(Number(newBudget)) || Number(newBudget) < 0) return;
    if (budgets.some(b => b.category.toLowerCase() === newCategory.trim().toLowerCase())) return;
    setBudgets([
      ...budgets,
      {
        category: newCategory.trim(),
        budget: Number(newBudget),
        color: 'bg-gray-500',
        protected: false
      }
    ]);
    setNewCategory('');
    setNewBudget('');
    setAddMode(false);
  };

  const handleDeleteCategory = (idx: number) => {
    if (budgets[idx].protected) return;
    setBudgets(budgets.filter((_, i) => i !== idx));
  };

  return (
    <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-white/20">
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {budgets.map((budget, idx) => {
            const spent = getSpentAmount(budget.category);
            const percentage = (spent / budget.budget) * 100;
            const isOverBudget = percentage > 100;
            return (
              <div key={budget.category} className="group">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {budget.category}
                  </span>
                  {editIndex === idx ? (
                    <span className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        className="w-20 px-1 py-0.5 border rounded text-sm"
                        autoFocus
                      />
                      <button
                        className="text-green-600 text-xs font-semibold"
                        onClick={() => handleEdit(idx, Number(editValue))}
                        disabled={editValue === '' || isNaN(Number(editValue))}
                      >Save</button>
                      <button
                        className="text-gray-400 text-xs font-semibold"
                        onClick={() => { setEditIndex(null); setEditValue(''); }}
                      >Cancel</button>
                    </span>
                  ) : (
                    <span className={`text-sm font-medium ${isOverBudget ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'}`}>
                      ₹{spent.toFixed(0)} / ₹{budget.budget}
                      <button
                        className="ml-2 text-blue-500 underline text-xs"
                        onClick={() => { setEditIndex(idx); setEditValue(String(budget.budget)); }}
                        title="Edit budget"
                      >Edit</button>
                      {!budget.protected && (
                        <button
                          className="ml-2 text-red-500 underline text-xs"
                          onClick={() => handleDeleteCategory(idx)}
                          title="Delete category"
                        >Delete</button>
                      )}
                    </span>
                  )}
                </div>
                <Progress 
                  value={Math.min(percentage, 100)} 
                  className="h-2 mb-1"
                />
                {isOverBudget && (
                  <p className="text-xs text-red-600">
                    Over budget by ₹{(spent - budget.budget).toFixed(0)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-6">
          {addMode ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Category name"
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                className="w-32 px-1 py-0.5 border rounded text-sm"
                autoFocus
              />
              <input
                type="number"
                min={0}
                placeholder="Budget"
                value={newBudget}
                onChange={e => setNewBudget(e.target.value)}
                className="w-20 px-1 py-0.5 border rounded text-sm"
              />
              <button
                className="text-green-600 text-xs font-semibold"
                onClick={handleAddCategory}
                disabled={!newCategory.trim() || newBudget === '' || isNaN(Number(newBudget))}
              >Add</button>
              <button
                className="text-gray-400 text-xs font-semibold"
                onClick={() => { setAddMode(false); setNewCategory(''); setNewBudget(''); }}
              >Cancel</button>
            </div>
          ) : (
            <button
              className="mt-2 text-blue-500 underline text-xs"
              onClick={() => setAddMode(true)}
            >+ Add Category</button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetOverview;
