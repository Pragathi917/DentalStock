import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, Bell } from 'lucide-react';

const Topbar = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Simple title mapper
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return 'Overview Dashboard';
    if (path.startsWith('/inventory/add')) return 'Add Inventory Item';
    if (path.startsWith('/inventory/edit')) return 'Edit Inventory Item';
    if (path.startsWith('/inventory')) return 'Inventory Management';
    if (path.startsWith('/usage')) return 'Procedure Usage Logs';
    if (path.startsWith('/forecast')) return 'Demand Forecasting';
    if (path.startsWith('/alerts')) return 'Inventory Alerts';
    if (path.startsWith('/users')) return 'User & Staff Management';
    return 'DentalStock';
  };

  const getInitials = (name) => {
    if (!name) return 'US';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header style={{
      height: '70px',
      backgroundColor: 'var(--white)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 99,
    }} className="topbar-element">
      {/* Left side: hamburger trigger & title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={toggleSidebar}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary-teal)',
          }}
          className="menu-button"
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={24} />
        </button>

        <h1 style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          color: 'var(--primary-teal)',
          letterSpacing: '-0.02em',
        }}>{getPageTitle()}</h1>
      </div>

      {/* Right side: Alert bell & profile initials avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link 
          to="/alerts" 
          style={{
            position: 'relative',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="View Alerts"
        >
          <Bell size={20} />
        </Link>

        {/* User Card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="user-profile-widget">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-color)' }}>{user?.name || 'User'}</span>
            <span style={{
              fontSize: '0.675rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: user?.role === 'admin' ? 'var(--danger-color)' : 'var(--success-color)',
              backgroundColor: user?.role === 'admin' ? '#FCE4D6' : '#E2F0D9',
              padding: '0.125rem 0.375rem',
              borderRadius: '4px',
              marginTop: '0.125rem',
            }}>
              {user?.role || 'staff'}
            </span>
          </div>

          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--warm-ivory)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.875rem',
            fontWeight: 700,
            color: 'var(--primary-teal)'
          }}>
            {getInitials(user?.name)}
          </div>
        </div>
      </div>

      <style>{`
        .menu-button {
          display: none;
        }

        @media (max-width: 768px) {
          .topbar-element {
            padding: 0 1rem;
          }
          .menu-button {
            display: flex;
          }
          .user-profile-widget {
            gap: 0.5rem;
          }
        }
      `}</style>
    </header>
  );
};

export default Topbar;
