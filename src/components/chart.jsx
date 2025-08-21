import React, { useState, useEffect, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';
import { getUserExpenses } from '../services/expenseService.js';
import '../styling/ExpenseForm.css'; // Reusing your existing styles

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ExpenseAnalytics = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('6months');

  // Same categories and colors as your ExpenseForm
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

  const categoryColors = categories.reduce((acc, cat) => {
    acc[cat.value] = cat.color;
    return acc;
  }, {});

  // Fetch expenses from Firebase
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Using your getUserExpenses function
        const result = await getUserExpenses('temp-user-id'); // Replace with actual user ID
        
        if (result.success) {
          setExpenses(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [selectedTimeRange]);

  // Filter expenses based on selected time range
  const filteredExpenses = useMemo(() => {
    const now = new Date();
    const startDate = new Date();

    switch (selectedTimeRange) {
      case '1month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '3months':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '6months':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case '1year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 6);
    }

    return expenses.filter(expense => new Date(expense.date) >= startDate);
  }, [expenses, selectedTimeRange]);

  // 1. Category Pie Chart Data
  const categoryChartData = useMemo(() => {
    if (filteredExpenses.length === 0) {
      return {
        labels: ['No Data Available'],
        datasets: [{
          label: 'Spending by Category',
          data: [1],
          backgroundColor: ['#e9ecef'],
          borderColor: ['#dee2e6'],
          borderWidth: 1
        }]
      };
    }

    const categoryTotals = filteredExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);
    const backgroundColor = labels.map(category => categoryColors[category] || '#74b9ff');

    return {
      labels,
      datasets: [{
        label: 'Spending by Category',
        data,
        backgroundColor,
        borderColor: backgroundColor.map(color => color),
        borderWidth: 2,
        hoverOffset: 15
      }]
    };
  }, [filteredExpenses, categoryColors]);

  // 2. Monthly Spending Trend Data
  const monthlyTrendData = useMemo(() => {
    if (filteredExpenses.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{
          label: 'Monthly Spending',
          data: [0],
          borderColor: '#4ecdc4',
          backgroundColor: 'rgba(78, 205, 196, 0.1)',
          borderWidth: 3
        }]
      };
    }

    const monthlyTotals = filteredExpenses.reduce((acc, expense) => {
      const month = expense.date.substring(0, 7); // "2025-08"
      acc[month] = (acc[month] || 0) + expense.amount;
      return acc;
    }, {});

    const sortedMonths = Object.keys(monthlyTotals).sort();
    const labels = sortedMonths.map(month => {
      const [year, monthNum] = month.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${monthNames[parseInt(monthNum) - 1]} ${year}`;
    });
    const data = sortedMonths.map(month => monthlyTotals[month]);

    return {
      labels,
      datasets: [{
        label: 'Monthly Spending',
        data,
        borderColor: '#4ecdc4',
        backgroundColor: 'rgba(78, 205, 196, 0.15)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#4ecdc4',
        pointBorderColor: '#fff',
        pointBorderWidth: 3,
        pointRadius: 7,
        pointHoverRadius: 10,
        pointHoverBackgroundColor: '#4ecdc4',
        pointHoverBorderColor: '#fff'
      }]
    };
  }, [filteredExpenses]);

  // 3. Daily Spending Data (Current Month)
  const dailySpendingData = useMemo(() => {
    const currentMonth = new Date().toISOString().substring(0, 7); // "2025-08"
    const currentMonthExpenses = filteredExpenses.filter(expense => 
      expense.date.startsWith(currentMonth)
    );

    const dailyTotals = currentMonthExpenses.reduce((acc, expense) => {
      const day = expense.date.substring(8, 10); // "15"
      acc[day] = (acc[day] || 0) + expense.amount;
      return acc;
    }, {});

    // Generate all days of current month
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const labels = [];
    const data = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const day = i.toString().padStart(2, '0');
      labels.push(`${now.toLocaleDateString('en-US', { month: 'short' })} ${i}`);
      data.push(dailyTotals[day] || 0);
    }

    return {
      labels,
      datasets: [{
        label: 'Daily Spending',
        data,
        backgroundColor: data.map(amount => 
          amount === 0 ? 'rgba(196, 196, 196, 0.4)' : 
          amount > 50 ? '#ff6b6b' : 
          amount > 20 ? '#ffeaa7' : '#96ceb4'
        ),
        borderColor: data.map(amount => 
          amount === 0 ? '#c4c4c4' : 
          amount > 50 ? '#e55353' : 
          amount > 20 ? '#fdcb6e' : '#7fb069'
        ),
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      }]
    };
  }, [filteredExpenses]);

  // Chart options with your theme colors and rupee symbol
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 13,
            weight: '500'
          },
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                const value = data.datasets[0].data[i];
                const percentage = ((value * 100) / total).toFixed(1);
                
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].borderColor[i],
                  lineWidth: data.datasets[0].borderWidth,
                  pointStyle: 'circle',
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#dee2e6',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed * 100) / total).toFixed(1);
            return `${context.label}: ₹${context.parsed.toFixed(2)} (${percentage}%)`;
          }
        }
      }
    }
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            weight: '500'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#4ecdc4',
        borderWidth: 2,
        callbacks: {
          label: function(context) {
            return `Spending: ₹${context.parsed.y.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            size: 12
          },
          callback: function(value) {
            return '₹' + value.toFixed(0);
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12
          }
        }
      }
    }
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        callbacks: {
          label: function(context) {
            return context.parsed.y === 0 ? 'No spending this day' : `Spent: ₹${context.parsed.y.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            size: 12
          },
          callback: function(value) {
            return '₹' + value.toFixed(0);
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxTicksLimit: 15,
          font: {
            size: 11
          }
        }
      }
    }
  };

  // Calculate summary statistics
  const totalSpending = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const avgDailySpending = filteredExpenses.length > 0 ? totalSpending / Math.max(filteredExpenses.length, 1) : 0;
  const topCategory = filteredExpenses.length > 0 ? Object.entries(
    filteredExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {})
  ).sort(([,a], [,b]) => b - a)[0] : null;

  // Loading State - matches your ExpenseForm loading style
  if (loading) {
    return (
      <div className="expense-form-container">
        <div className="card expense-form-card shadow-lg">
          <div className="card-header expense-form-header">
            <div className="d-flex align-items-center">
              <div className="form-icon me-3">
                <i className="fas fa-chart-line"></i>
              </div>
              <div>
                <h5 className="card-title mb-1 text-white">Expense Analytics</h5>
                <small className="text-white-50">Loading your spending insights...</small>
              </div>
            </div>
          </div>
          <div className="card-body expense-form-body text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Analyzing your expenses...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="expense-form-container">
        <div className="card expense-form-card shadow-lg">
          <div className="card-header expense-form-header">
            <div className="d-flex align-items-center">
              <div className="form-icon me-3">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <div>
                <h5 className="card-title mb-1 text-white">Analytics Error</h5>
                <small className="text-white-50">Unable to load your data</small>
              </div>
            </div>
          </div>
          <div className="card-body expense-form-body">
            <div className="alert alert-danger" role="alert">
              <i className="fas fa-exclamation-triangle me-2"></i>
              <strong>Error:</strong> {error}
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              <i className="fas fa-redo me-2"></i>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="expense-form-container">
      {/* Header Card - matches your ExpenseForm style */}
      <div className="card expense-form-card shadow-lg mb-4">
        <div className="card-header expense-form-header">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div className="form-icon me-3">
                <i className="fas fa-chart-line"></i>
              </div>
              <div>
                <h5 className="card-title mb-1 text-white">Expense Analytics</h5>
                <small className="text-white-50">Visualize your spending patterns and insights</small>
              </div>
            </div>
            <select 
              className="form-select form-select-sm bg-white"
              style={{ maxWidth: '150px' }}
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
            >
              <option value="1month">Last Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
          </div>
        </div>

        {/* Summary Stats in Header */}
        <div className="card-body expense-form-body">
          <div className="row text-center">
            <div className="col-md-4">
              <div className="d-flex align-items-center justify-content-center mb-3 mb-md-0">
                <div className="me-3">
                  <i className="fas fa-rupee-sign fs-2 text-primary"></i>
                </div>
                <div>
                  <h4 className="fw-bold mb-0">₹{totalSpending.toFixed(2)}</h4>
                  <small className="text-muted">Total Spending</small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-center justify-content-center mb-3 mb-md-0">
                <div className="me-3">
                  <i className="fas fa-calendar-day fs-2 text-success"></i>
                </div>
                <div>
                  <h4 className="fw-bold mb-0">₹{avgDailySpending.toFixed(2)}</h4>
                  <small className="text-muted">Avg Daily</small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-center justify-content-center">
                <div className="me-3">
                  <i className="fas fa-trophy fs-2 text-warning"></i>
                </div>
                <div>
                  <h5 className="fw-bold mb-0">{topCategory ? topCategory[0] : 'No Data'}</h5>
                  <small className="text-muted">Top Category</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* No Data State */}
      {filteredExpenses.length === 0 ? (
        <div className="card expense-form-card shadow-lg">
          <div className="card-body expense-form-body text-center py-5">
            <i className="fas fa-chart-pie fs-1 text-muted mb-4"></i>
            <h4 className="text-muted mb-3">No Expenses Found</h4>
            <p className="text-muted mb-4">
              Start adding expenses to see beautiful charts and insights about your spending patterns.
            </p>
            <button className="btn btn-primary btn-lg">
              <i className="fas fa-plus me-2"></i>
              Add Your First Expense
            </button>
          </div>
          <div className="card-footer expense-form-footer bg-light">
            <div className="d-flex align-items-center justify-content-center text-muted">
              <i className="fas fa-lightbulb me-2 text-warning"></i>
              <small>💡 Tip: Add a few expenses to unlock powerful analytics and spending insights</small>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Charts Grid */}
          <div className="row">
            {/* Category Pie Chart */}
            <div className="col-lg-6 mb-4">
              <div className="card expense-form-card shadow-lg h-100">
                <div className="card-header expense-form-header">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <div className="form-icon me-3">
                        <i className="fas fa-chart-pie"></i>
                      </div>
                      <div>
                        <h6 className="card-title mb-1 text-white">Spending by Category</h6>
                        <small className="text-white-50">Breakdown of your expenses</small>
                      </div>
                    </div>
                    <div className="badge bg-white text-primary fw-semibold">
                      {categoryChartData.labels.length} Categories
                    </div>
                  </div>
                </div>
                <div className="card-body expense-form-body">
                  <div style={{ height: '400px' }}>
                    <Pie data={categoryChartData} options={pieOptions} />
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Trend Chart */}
            <div className="col-lg-6 mb-4">
              <div className="card expense-form-card shadow-lg h-100">
                <div className="card-header expense-form-header">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <div className="form-icon me-3">
                        <i className="fas fa-chart-line"></i>
                      </div>
                      <div>
                        <h6 className="card-title mb-1 text-white">Monthly Spending Trend</h6>
                        <small className="text-white-50">Track your spending over time</small>
                      </div>
                    </div>
                    <div className="badge bg-white text-success fw-semibold">
                      Trending
                    </div>
                  </div>
                </div>
                <div className="card-body expense-form-body">
                  <div style={{ height: '400px' }}>
                    <Line data={monthlyTrendData} options={lineOptions} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Spending Chart */}
          <div className="row">
            <div className="col-12 mb-4">
              <div className="card expense-form-card shadow-lg">
                <div className="card-header expense-form-header">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <div className="form-icon me-3">
                        <i className="fas fa-chart-bar"></i>
                      </div>
                      <div>
                        <h6 className="card-title mb-1 text-white">
                          Daily Spending - {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </h6>
                        <small className="text-white-50">Daily spending pattern for current month</small>
                      </div>
                    </div>
                    <div className="d-flex gap-3">
                      <div className="d-flex align-items-center">
                        <div className="bg-success rounded" style={{width: '10px', height: '10px', marginRight: '6px'}}></div>
                        <small className="text-white-50">Low</small>
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="bg-warning rounded" style={{width: '10px', height: '10px', marginRight: '6px'}}></div>
                        <small className="text-white-50">Medium</small>
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="bg-danger rounded" style={{width: '10px', height: '10px', marginRight: '6px'}}></div>
                        <small className="text-white-50">High</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body expense-form-body">
                  <div style={{ height: '350px' }}>
                    <Bar data={dailySpendingData} options={barOptions} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Category Insights with proper layout */}
          <div className="card expense-form-card shadow-lg">
            <div className="card-header expense-form-header">
              <div className="d-flex align-items-center">
                <div className="form-icon me-3">
                  <i className="fas fa-lightbulb"></i>
                </div>
                <div>
                  <h6 className="card-title mb-1 text-white">Category Breakdown</h6>
                  <small className="text-white-50">Detailed spending by category</small>
                </div>
              </div>
            </div>
            <div className="card-body expense-form-body">
              <div className="row g-3">
                {Object.entries(
                  filteredExpenses.reduce((acc, expense) => {
                    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
                    return acc;
                  }, {})
                ).sort(([,a], [,b]) => b - a).map(([category, amount], index) => {
                  const categoryInfo = categories.find(cat => cat.value === category);
                  const percentage = ((amount / totalSpending) * 100).toFixed(1);
                  
                  return (
                    <div key={category} className="col-md-6 col-lg-4">
                      <div 
                        className="p-3 rounded-3 border border-2 h-100 d-flex flex-column justify-content-between"
                        style={{ 
                          backgroundColor: categoryInfo?.color + '15',
                          borderColor: categoryInfo?.color + '50',
                          minHeight: '120px'
                        }}
                      >
                        <div className="d-flex align-items-start justify-content-between">
                          <div className="d-flex align-items-start flex-grow-1 me-2">
                            <span className="fs-3 me-3" style={{ minWidth: '40px' }}>
                              {categoryInfo?.icon || '📝'}
                            </span>
                            <div className="flex-grow-1" style={{ minWidth: 0 }}>
                              <div 
                                className="fw-semibold text-dark mb-1"
                                style={{ 
                                  fontSize: '14px',
                                  lineHeight: '1.2',
                                  wordBreak: 'break-word'
                                }}
                              >
                                {category}
                              </div>
                              <small className="text-muted d-block">
                                {percentage}% of total
                              </small>
                            </div>
                          </div>
                          <div className="text-end" style={{ minWidth: 'fit-content' }}>
                            <div 
                              className="fw-bold"
                              style={{ 
                                color: categoryInfo?.color,
                                fontSize: '16px',
                                wordBreak: 'keep-all',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              ₹{amount.toLocaleString('en-IN', { 
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2 
                              })}
                            </div>
                          </div>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="mt-2">
                          <div className="progress" style={{ height: '6px' }}>
                            <div 
                              className="progress-bar" 
                              role="progressbar" 
                              style={{ 
                                width: `${percentage}%`,
                                backgroundColor: categoryInfo?.color 
                              }}
                              aria-valuenow={percentage} 
                              aria-valuemin="0" 
                              aria-valuemax="100"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="card-footer expense-form-footer bg-light">
              <div className="d-flex align-items-center justify-content-center text-muted">
                <i className="fas fa-info-circle me-2 text-primary"></i>
                <small>📊 Charts update automatically when you add new expenses</small>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExpenseAnalytics;