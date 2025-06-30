import React, { useState } from 'react';
import { useTransactions } from '@/contexts/TransactionContext';
import { useAuth } from '@/contexts/AuthContext';

const TransactionsPage: React.FC = () => {
  const { transactions, addTransaction, deleteTransaction, updateTransaction, categorizeTransaction } = useTransactions();
  const { user } = useAuth();
  const [form, setForm] = useState({ amount: '', description: '', date: '', type: 'expense' as 'income' | 'expense' });

  if (!user) {
    return <div>Please log in to view transactions.</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addTransaction({
        amount: parseFloat(form.amount),
        description: form.description,
        date: form.date,
        type: form.type,
        category: categorizeTransaction(form.description),
      });
      setForm({ amount: '', description: '', date: '', type: 'expense' });
    } catch (error) {
      alert(error.message || 'Error adding transaction');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id);
    } catch (error) {
      alert(error.message || 'Error deleting transaction');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Transactions</h1>
      
      {/* Form to add new transaction */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
          style={{ margin: '5px' }}
        />
        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
          style={{ margin: '5px' }}
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
          style={{ margin: '5px' }}
        />
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value as 'income' | 'expense' })}
          style={{ margin: '5px' }}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <button type="submit" style={{ margin: '5px' }}>Add Transaction</button>
      </form>

      {/* Transaction List */}
      <ul>
        {transactions.map((t) => (
          <li key={t._id} style={{ margin: '10px 0' }}>
            {t.description} - ₹{t.amount} - {t.category} - {t.date} ({t.type})
            <button
              onClick={() => handleDelete(t._id)}
              style={{ marginLeft: '10px', color: 'red' }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionsPage;