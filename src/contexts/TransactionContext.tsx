
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  categorizeTransaction: (description: string) => string;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

// Smart categorization logic
const categorizeTransaction = (description: string): string => {
  const desc = description.toLowerCase();
  
  if (desc.includes('grocery') || desc.includes('food') || desc.includes('restaurant') || desc.includes('cafe')) {
    return 'Food & Dining';
  }
  if (desc.includes('gas') || desc.includes('uber') || desc.includes('taxi') || desc.includes('transport')) {
    return 'Transportation';
  }
  if (desc.includes('amazon') || desc.includes('shopping') || desc.includes('store')) {
    return 'Shopping';
  }
  if (desc.includes('netflix') || desc.includes('spotify') || desc.includes('entertainment')) {
    return 'Entertainment';
  }
  if (desc.includes('salary') || desc.includes('paycheck') || desc.includes('income')) {
    return 'Income';
  }
  if (desc.includes('rent') || desc.includes('mortgage') || desc.includes('utilities')) {
    return 'Housing';
  }
  if (desc.includes('doctor') || desc.includes('hospital') || desc.includes('pharmacy')) {
    return 'Healthcare';
  }
  
  return 'Other';
};

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: '1',
    amount: -45.99,
    description: 'Grocery Store',
    category: 'Food & Dining',
    date: '2024-01-15',
    type: 'expense'
  },
  {
    id: '2',
    amount: -12.50,
    description: 'Uber Ride',
    category: 'Transportation',
    date: '2024-01-14',
    type: 'expense'
  },
  {
    id: '3',
    amount: 3500.00,
    description: 'Salary',
    category: 'Income',
    date: '2024-01-01',
    type: 'income'
  },
  {
    id: '4',
    amount: -89.99,
    description: 'Amazon Purchase',
    category: 'Shopping',
    date: '2024-01-13',
    type: 'expense'
  },
  {
    id: '5',
    amount: -15.99,
    description: 'Netflix Subscription',
    category: 'Entertainment',
    date: '2024-01-12',
    type: 'expense'
  }
];

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      category: transaction.category || categorizeTransaction(transaction.description)
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateTransaction = (id: string, updatedTransaction: Partial<Transaction>) => {
    setTransactions(prev => 
      prev.map(t => t.id === id ? { ...t, ...updatedTransaction } : t)
    );
  };

  return (
    <TransactionContext.Provider value={{
      transactions,
      addTransaction,
      deleteTransaction,
      updateTransaction,
      categorizeTransaction
    }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};
