import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase'; // Your Firebase config
import ExpenseAnalytics from "../components/chart";
import ExpenseForm from "../components/ExpenseFORM.JSX";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [activeTab, setActiveTab] = useState('expenses');
  const [user, loading, error] = useAuthState(auth);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Handle auth error
  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Authentication error: {error.message}
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    window.location.href = '/login';
    return null;
  }

  return (
    <>
      <Navbar 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        user={user} // Pass the actual Firebase user object
      />
      
      <div className="container-fluid">
        {activeTab === 'expenses' && <ExpenseForm />}
        {activeTab === 'analytics' && <ExpenseAnalytics />}
      </div>
    </>
  );
}

export default Dashboard;