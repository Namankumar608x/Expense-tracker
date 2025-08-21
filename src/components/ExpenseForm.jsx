import React, { useState } from 'react';
import { addExpense } from '../services/expenseService.js';
import '../styling/ExpenseForm.css'; 
const ExpenseForm = () => {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    { value: "Food & Dining", icon: "🍽️", color: "#ff6b6b" },
    { value: "Transportation", icon: "🚗", color: "#4ecdc4" },
    { value: "Shopping", icon: "🛒", color: "#45b7d1" },
    { value: "Entertainment", icon: "🎬", color: "#96ceb4" },
    { value: "Bills & Utilities", icon: "💡", color: "#ffeaa7" },
    { value: "Healthcare", icon: "⚕️", color: "#fd79a8" },
    { value: "Education", icon: "📚", color: "#fdcb6e" },
    { value: "Travel", icon: "✈️", color: "#6c5ce7" },
    { value: "Personal Care", icon: "💄", color: "#a29bfe" },
    { value: "Others", icon: "📝", color: "#74b9ff" }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount='Amount must be greater than 0';
    }

    if (!formData.category) {
      newErrors.category='Please select a category';
    }

    if (!formData.date) {
      newErrors.date='Please select a date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    if (!validateForm()) {
      document.querySelector('.expense-form-card')?.classList.add('shake');
      setTimeout(() => {
        document.querySelector('.expense-form-card')?.classList.remove('shake');
      }, 500);
      return;
    }
    setIsLoading(true);

    try {
      const expenseData = {
        ...formData,
        userId: 'temp-user-id',
        amount: parseFloat(formData.amount)
      };

      const result = await addExpense(expenseData);
      if (result.success) {
        document.querySelector('.expense-form-card')?.classList.add('success');
        setTimeout(() => {
          document.querySelector('.expense-form-card')?.classList.remove('success');
        }, 600);

        alert('Expense added successfully!');
         
        setFormData({     //reset form
          amount: '',
          category: '',
          description: '',
          date: new Date().toISOString().split('T')[0]
        });
      } else {
        alert('Error adding expense: ' + result.error);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    setErrors({});
  };


  const selectedCategory = categories.find(cat => cat.value === formData.category);

  return (
    <div className="expense-form-container">
      <div className="card expense-form-card shadow-lg">
        <div className="card-header expense-form-header">
          <div className="d-flex align-items-center">
            <div className="form-icon me-3">
              <i className="fas fa-plus-circle"></i>
            </div>
            <div>
              <h5 className="card-title mb-1 text-white">Add New Expense</h5>
              <small className="text-white-50">Track your spending efficiently</small>
            </div>
          </div>
        </div>

        <div className="card-body expense-form-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="amount" className="form-label fw-semibold">
                <i className="fas fa-dollar-sign me-2 text-primary"></i>
                Amount <span className="text-danger">*</span>
              </label>
              <div className="input-group input-group-lg">
                <span className={`input-group-text amount-prefix ${errors.amount ? 'border-danger' : ''}`}>
                  ₹
                </span>
                <input
                  type="number"
                  className={`form-control amount-input ${errors.amount ? 'is-invalid' : formData.amount ? 'is-valid' : ''}`}
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  disabled={isLoading}
                  required
                />
                {errors.amount && (
                  <div className="invalid-feedback d-block">
                    <i className="fas fa-exclamation-triangle me-1"></i>
                    {errors.amount}
                  </div>
                )}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="category" className="form-label fw-semibold">
                <i className="fas fa-tags me-2 text-primary"></i>
                Category <span className="text-danger">*</span>
              </label>
              <select
                className={`form-select form-select-lg category-select ${errors.category ? 'is-invalid' : formData.category ? 'is-valid' : ''}`}
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              >
                <option value="">Choose a category</option>
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.icon} {category.value}
                  </option>
                ))}
              </select>
              {selectedCategory && (
                <div 
                  className="category-preview mt-2 p-3 rounded-3 border border-2"
                  style={{ 
                    backgroundColor: selectedCategory.color + '20',
                    borderColor: selectedCategory.color + '40'
                  }}
                >
                  <div className="d-flex align-items-center">
                    <span className="category-icon me-3">{selectedCategory.icon}</span>
                    <span className="fw-semibold text-dark">{selectedCategory.value}</span>
                  </div>
                </div>
              )}
              
              {errors.category && (
                <div className="invalid-feedback d-block">
                  <i className="fas fa-exclamation-triangle me-1"></i>
                  {errors.category}
                </div>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="date" className="form-label fw-semibold">
                <i className="fas fa-calendar-alt me-2 text-primary"></i>
                Date <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                className={`form-control form-control-lg date-input ${errors.date ? 'is-invalid' : formData.date ? 'is-valid' : ''}`}
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
              {errors.date && (
                <div className="invalid-feedback">
                  <i className="fas fa-exclamation-triangle me-1"></i>
                  {errors.date}
                </div>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="form-label fw-semibold">
                <i className="fas fa-sticky-note me-2 text-primary"></i>
                Description
              </label>
              <textarea
                className="form-control form-control-lg description-input"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Add a description (optional)"
                rows="4"
                maxLength="200"
                disabled={isLoading}
              />
              <div className="form-text text-end">
                <small className="text-muted">
                  <i className="fas fa-pen me-1"></i>
                  {formData.description.length}/200 characters
                </small>
              </div>
            </div>
            <div className="d-grid gap-2 d-md-flex justify-content-md-center">
              <button
                type="submit"
                className="btn btn-primary btn-lg px-4 btn-add-expense"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </span>
                    Adding...
                  </>
                ) : (
                  <>
                    <i className="fas fa-plus me-2"></i>
                    Add Expense
                  </>
                )}
              </button>
              
              <button
                type="button"
                className="btn btn-outline-secondary btn-lg px-4 btn-reset"
                onClick={handleReset}
                disabled={isLoading}
              >
                <i className="fas fa-redo me-2"></i>
                Reset
              </button>
            </div>
          </form>
        </div>
        <div className="card-footer expense-form-footer bg-light">
          <div className="d-flex align-items-center justify-content-center text-muted">
            <i className="fas fa-lightbulb me-2 text-warning"></i>
            <small>💡 Tip: Add detailed descriptions to track your spending patterns better</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseForm;