import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '70vh',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: '#FCE4D6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--danger-color)',
        marginBottom: '1.5rem'
      }}>
        <ShieldAlert size={32} />
      </div>
      
      <h2 style={{
        fontSize: '1.75rem',
        fontWeight: 700,
        color: 'var(--primary-teal)',
        marginBottom: '0.75rem',
        letterSpacing: '-0.02em'
      }}>Access Restricted</h2>

      <p style={{
        color: 'var(--text-muted)',
        fontSize: '0.95rem',
        maxWidth: '400px',
        lineHeight: 1.5,
        marginBottom: '2rem'
      }}>
        You don't have administrative permissions to access this clinical resource. If you believe this is in error, please contact your systems administrator.
      </p>

      <button 
        className="btn btn-primary"
        onClick={() => navigate('/dashboard')}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default Unauthorized;
