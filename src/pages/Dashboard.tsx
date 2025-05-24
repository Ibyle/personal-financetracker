import { useState, useMemo } from 'react';
import TransactionForm from '../components/TransactionForm';

const categories = ['Salary', 'Freelance', 'Groceries', 'Rent', 'Utilities'];

type Transaction = {
  id: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
  notes?: string;
};

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions((prev) => [...prev, transaction]);
    console.log('Added transaction:', transaction);
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Get all unique categories from transactions
  const allCategories = useMemo(() => {
    const cats = transactions.map(t => t.category);
    return Array.from(new Set([...categories, ...cats])).sort();
  }, [transactions]);

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(t => t.category === filterCategory);
    }

    // Sort transactions
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [transactions, sortBy, sortOrder, filterType, filterCategory]);

  const handleSortChange = (newSortBy: 'date' | 'amount' | 'category') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Financial Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800">Total Income</h3>
          <p className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</p>
        </div>
        <div className={`p-4 rounded-lg ${balance >= 0 ? 'bg-blue-100' : 'bg-orange-100'}`}>
          <h3 className={`text-lg font-semibold ${balance >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
            Balance
          </h3>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
            ${balance.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Add New Transaction</h2>
          <TransactionForm onSubmit={handleAddTransaction} categories={categories} />
        </div>

        {/* Transactions List */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Transaction History</h2>
            <span className="text-sm text-gray-500">
              {filteredAndSortedTransactions.length} of {transactions.length} transactions
            </span>
          </div>

          {/* Filters and Sort Controls */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium mb-1">Filter by Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
                  className="w-full p-2 border rounded text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="income">Income Only</option>
                  <option value="expense">Expenses Only</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium mb-1">Filter by Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                >
                  <option value="all">All Categories</option>
                  {allCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Controls */}
              <div>
                <label className="block text-sm font-medium mb-1">Sort by</label>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleSortChange('date')}
                    className={`px-3 py-2 text-xs rounded ${
                      sortBy === 'date'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                  <button
                    onClick={() => handleSortChange('amount')}
                    className={`px-3 py-2 text-xs rounded ${
                      sortBy === 'amount'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Amount {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                  <button
                    onClick={() => handleSortChange('category')}
                    className={`px-3 py-2 text-xs rounded ${
                      sortBy === 'category'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Category {sortBy === 'category' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            {(filterType !== 'all' || filterCategory !== 'all') && (
              <div className="mt-3 pt-3 border-t">
                <button
                  onClick={() => {
                    setFilterType('all');
                    setFilterCategory('all');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* Transaction List */}
          {transactions.length === 0 ? (
            <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-500">
              No transactions yet. Add your first transaction!
            </div>
          ) : filteredAndSortedTransactions.length === 0 ? (
            <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-500">
              No transactions match your current filters.
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredAndSortedTransactions.map((transaction) => (
                <div 
                  key={transaction.id} 
                  className={`p-4 border-l-4 rounded-lg shadow-sm hover:shadow-md transition-shadow ${
                    transaction.type === 'income' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-block w-3 h-3 rounded-full ${
                          transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                        }`}></span>
                        <span className="font-semibold capitalize">{transaction.type}</span>
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                          {transaction.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        <strong>Date:</strong> {new Date(transaction.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                      {transaction.notes && (
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>Notes:</strong> {transaction.notes}
                        </p>
                      )}
                    </div>
                    <div className={`text-lg font-bold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;