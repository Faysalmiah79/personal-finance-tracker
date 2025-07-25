// src/pages/Dashboard.js
import { useEffect, useState, useCallback } from 'react';
import { fetchTransactions } from '../api';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  // Initialize to current month
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const initialMonth = `${year}-${month}`;

  const [filters, setFilters] = useState({ from: initialMonth, to: initialMonth });
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0 });
  const [error, setError] = useState('');

  // Load summary by fetching transactions and aggregating
  const loadSummary = useCallback(() => {
    const params = {};
    if (filters.from) params.from = `${filters.from}-01`;
    if (filters.to) {
      const [y, m] = filters.to.split('-');
      const lastDay = new Date(y, m, 0)
        .toISOString()
        .slice(0, 10);
      params.to = lastDay;
    }

    fetchTransactions(params)
      .then(res => {
        const txs = res.data;
        const totalIncome = txs.reduce(
          (sum, t) => (t.type === 'income' ? sum + t.amount : sum),
          0
        );
        const totalExpenses = txs.reduce(
          (sum, t) => (t.type === 'expense' ? sum + t.amount : sum),
          0
        );
        setSummary({ totalIncome, totalExpenses });
      })
      .catch(() => {
        setError('Could not load summary');
      });
  }, [filters]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const handleFilterChange = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const net = summary.totalIncome - summary.totalExpenses;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl mb-4">Dashboard</h1>

      {/* Month selector */}
      <div className="mb-4 flex items-center space-x-2">
        <label>
          Month:
          <input
            type="month"
            name="from"
            value={filters.from}
            onChange={handleFilterChange}
            className="ml-2 p-1 border"
          />
        </label>
        <button
          onClick={loadSummary}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Load
        </button>
      </div>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      {/* Summary display */}
      <div className="mb-4">
        <p>Total Income: £{summary.totalIncome.toFixed(2)}</p>
        <p>Total Expenses: £{summary.totalExpenses.toFixed(2)}</p>
        <p>Remaining: £{net.toFixed(2)}</p>
      </div>

      <Link
        to="/transactions"
        className="inline-block px-4 py-2 bg-blue-500 text-white rounded"
      >
        Manage Transactions
      </Link>
    </div>
  );
}
