import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  ClipboardList, 
  TrendingUp, 
  Bell, 
  Users, 
  LogOut,
  Sparkles
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();

  const handleLogoutClick = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Inventory', path: '/inventory', icon: Package },
    { name: 'Usage', path: '/usage', icon: ClipboardList },
    { name: 'Forecast', path: '/forecast', icon: TrendingUp },
    { name: 'Alerts', path: '/alerts', icon: Bell },
  ];

  // Admin only navigation items
  if (user?.role === 'admin') {
    navItems.push({ name: 'Users', path: '/users', icon: Users });
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={toggleSidebar}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(22, 74, 74, 0.4)',
            backdropFilter: 'blur(2px)',
            zIndex: 1000,
          }}
        />
      )}

      <aside style={{
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        width: '260px',
        backgroundColor: 'var(--white)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1001,
        transition: 'transform 0.3s ease',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
      }} className="sidebar-element">
        {/* Branding header */}
        <div style={{
          padding: '1.75rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'var(--soft-mint)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-teal)'
            }}>
              {/* Abstract clinical/healthcare cross style icon */}
              <Sparkles size={18} />
            </div>
            <span style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--primary-teal)',
              letterSpacing: '-0.025em'
            }}>DentalStock</span>
          </div>
          <span style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            fontWeight: 500,
            paddingLeft: '0.25rem'
          }}>Smarter inventory. Better care.</span>
        </div>

        {/* Navigation list */}
        <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth <= 768) toggleSidebar();
                }}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.875rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius)',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--primary-teal)' : 'var(--text-muted)',
                  backgroundColor: isActive ? 'var(--soft-mint)' : 'transparent',
                  transition: 'all 0.2s ease',
                })}
              >
                <Icon size={18} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div style={{
          padding: '1.25rem 1rem',
          borderTop: '1px solid var(--border-color)',
        }}>
          <button
            onClick={handleLogoutClick}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.875rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius)',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'var(--danger-color)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </aside>

      <style>{`
        /* Desktop styles overrides mobile drawer rules */
        @media (min-width: 769px) {
          .sidebar-element {
            transform: none !important;
          }
        }
        
        .nav-link:hover {
          background-color: var(--warm-ivory);
          color: var(--primary-teal) !important;
        }
      `}</style>
    </>
  );
};

export default Sidebar;
