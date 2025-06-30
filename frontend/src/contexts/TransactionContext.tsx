import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

export interface Transaction {
  _id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, '_id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
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

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { user } = useAuth();

  // Fetch transactions when user logs in
  useEffect(() => {
    if (user) {
      const fetchTransactions = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/transactions');
          setTransactions(response.data);
        } catch (error) {
          console.error('Error fetching transactions:', error);
        }
      };
      fetchTransactions();
    } else {
      setTransactions([]); // Clear transactions on logout
    }
  }, [user]);

  const addTransaction = async (transaction: Omit<Transaction, '_id'>) => {
    try {
      const newTransaction = {
        ...transaction,
        category: transaction.category || categorizeTransaction(transaction.description),
      };
      const response = await axios.post('http://localhost:5000/api/transactions', newTransaction);
      setTransactions((prev) => [response.data, ...prev]);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error adding transaction');
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/transactions/${id}`);
      setTransactions((prev) => prev.filter((t) => t._id !== id));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error deleting transaction');
    }
  };

  const updateTransaction = async (id: string, updatedTransaction: Partial<Transaction>) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/transactions/${id}`, updatedTransaction);
      setTransactions((prev) =>
        prev.map((t) => (t._id === id ? response.data : t))
      );
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error updating transaction');
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        categorizeTransaction,
      }}
    >
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