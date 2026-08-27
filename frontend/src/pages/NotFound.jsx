import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle } from 'lucide-react';

const NotFound = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleReturn = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: 'var(--warm-ivory)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--primary-teal)',
        marginBottom: '1.5rem',
        border: '1px solid var(--border-color)'
      }}>
        <AlertCircle size={32} />
      </div>

      <h2 style={{
        fontSize: '2.5rem',
        fontWeight: 800,
        color: 'var(--primary-teal)',
        marginBottom: '0.5rem',
        letterSpacing: '-0.03em'
      }}>404</h2>

      <h3 style={{
        fontSize: '1.25rem',
        fontWeight: 600,
        color: 'var(--text-color)',
        marginBottom: '0.75rem'
      }}>Page Not Found</h3>

      <p style={{
        color: 'var(--text-muted)',
        fontSize: '0.95rem',
        maxWidth: '360px',
        lineHeight: 1.5,
        marginBottom: '2rem'
      }}>
        The clinical page you're trying to locate does not exist or has been relocated.
      </p>

      <button 
        className="btn btn-primary"
        onClick={handleReturn}
      >
        {isAuthenticated ? 'Return to Dashboard' : 'Return to Login'}
      </button>
    </div>
  );
};

export default NotFound;
