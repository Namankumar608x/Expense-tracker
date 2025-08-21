import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

function Navbar({ activeTab, onTabChange, user }) {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
      <div className="container-fluid">
        {/* Brand */}
        <a className="navbar-brand fw-bold text-primary" href="#">
          ExpenseTracker
        </a>

        {/* Navigation tabs */}
        <div className="navbar-nav flex-row me-auto">
          <button
            className={`nav-link btn btn-link ${activeTab === 'expenses' ? 'active' : ''}`}
            onClick={() => onTabChange('expenses')}
          >
            Add Expenses
          </button>
          <button
            className={`nav-link btn btn-link ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => onTabChange('analytics')}
          >
            Analytics
          </button>
        </div>

        {/* User info and logout */}
        <div className="d-flex align-items-center">
          <img
            src={user?.photoURL || 'https://via.placeholder.com/32x32?text=U'}
            alt="Profile"
            className="rounded-circle me-2"
            width="32"
            height="32"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/32x32?text=U';
            }}
          />
          <span className="me-3 d-none d-md-inline">
            {user?.displayName || 'User'}
          </span>
          <button 
            className="btn btn-outline-primary btn-sm" 
            onClick={handleSignOut}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;