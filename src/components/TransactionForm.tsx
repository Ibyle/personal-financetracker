import { useState } from 'react';

type TransactionType = 'income' | 'expense';

interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  date: string;
  category: string;
  notes?: string;
}

interface Props {
  onSubmit: (transaction: Transaction) => void;
  categories: string[];
}

const TransactionForm: React.FC<Props> = ({ onSubmit, categories }) => {
  const [formData, setFormData] = useState({
    amount: '',
    type: 'income',
    date: '',
    category: '',
    customCategory: '',
    notes: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalCategory = formData.category === 'custom' ? formData.customCategory : formData.category;

    if (!formData.amount || !formData.date || !finalCategory) {
      alert('Please fill in all required fields');
      return;
    }

    const transaction: Transaction = {
      id: crypto.randomUUID(),
      amount: parseFloat(formData.amount),
      type: formData.type as TransactionType,
      date: formData.date,
      category: finalCategory,
      notes: formData.notes || undefined,
    };

    onSubmit(transaction);

    setFormData({
      amount: '',
      type: 'income',
      date: '',
      category: '',
      customCategory: '',
      notes: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-md space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Amount</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
          step="0.01"
          min="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
          <option value="custom">+ Custom</option>
        </select>
      </div>

      {formData.category === 'custom' && (
        <div>
          <label className="block text-sm font-medium mb-1">Custom Category</label>
          <input
            type="text"
            name="customCategory"
            value={formData.customCategory}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Notes (optional)</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="w-full p-2 border rounded h-20 resize-none"
          rows={3}
        />
      </div>

      <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
        Add Transaction
      </button>
    </form>
  );
};

export default TransactionForm;