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
              <svg xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 452 512.11">
           <path d="M336.47 255.21h64.36v-12.46c-3.68-13.63-9.54-22.87-17.13-28.49-7.59-5.61-17.43-8.01-28.98-7.93l-263.96.06c-6.5 0-11.76-5.27-11.76-11.76 0-6.5 5.26-11.76 11.76-11.76l263.65.03c16.59-.16 31.23 3.62 43.25 12.53 1.08.8 2.14 1.64 3.17 2.52v-7.07c0-10.98-4.53-21.02-11.82-28.31-7.23-7.29-17.25-11.8-28.29-11.8h-8.49l-1.09-.05-4.15 15.56h-28.52l16.92-63.47c-14.22-3.8-22.7-18.5-18.89-32.72l-94.11-25.21c-3.81 14.21-18.5 22.71-32.7 18.9l-27.63 102.5h-29.41L177.4 0l199.7 53.51-19.69 73.73h3.31c17.45 0 33.36 7.19 44.9 18.72 11.56 11.51 18.73 27.45 18.73 44.92v64.99c6.79 1.35 12.86 4.71 17.57 9.42 6.21 6.21 10.08 14.81 10.08 24.28v77.35c0 9.87-4.04 18.85-10.52 25.32-4.63 4.63-10.53 8.02-17.13 9.57v46.66c0 17.46-7.18 33.39-18.72 44.93l-.74.68c-11.5 11.13-27.11 18.03-44.17 18.03H63.63c-17.47 0-33.4-7.17-44.94-18.7C7.17 481.89 0 465.98 0 448.47V190.88c0-17.52 7.16-33.43 18.68-44.95 11.52-11.52 27.44-18.69 44.95-18.69h37.12l.16.01L130.46 17.5l28.19 7.55-38.73 141.23H90.4l4.18-15.51H63.63c-11.01 0-21.04 4.52-28.32 11.79-7.27 7.27-11.79 17.31-11.79 28.32v257.59c0 11.01 4.53 21.03 11.81 28.3 7.28 7.29 17.32 11.82 28.3 11.82h297.09c10.73 0 20.54-4.3 27.74-11.25l.54-.58c7.29-7.28 11.83-17.32 11.83-28.29v-45.71h-64.36c-19.88 0-37.96-8.14-51.02-21.2l-1.23-1.35c-12.36-13-19.98-30.52-19.98-49.68v-3.1c0-19.79 8.13-37.83 21.21-50.94l.13-.13c13.1-13.05 31.12-21.15 50.89-21.15zm-95.71-93.06c17.19 4.6 34.89-5.6 39.49-22.8 4.61-17.19-5.61-34.89-22.8-39.49-17.2-4.6-34.9 5.6-39.5 22.8-4.6 17.19 5.62 34.88 22.81 39.49zM362.3 309.07l.06.05c10.93 10.96 10.9 28.79-.02 39.74l-.05.06c-10.96 10.93-28.79 10.9-39.75-.02l-.05-.05c-10.93-10.96-10.9-28.79.02-39.75l.05-.05c10.96-10.93 28.79-10.91 39.74.02z"/>
           </svg>
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