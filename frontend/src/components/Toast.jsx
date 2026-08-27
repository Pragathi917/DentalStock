import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

const Toast = () => {
  const { toast } = useAuth();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      backgroundColor: '#FFFFFF',
      borderLeft: `4px solid ${isSuccess ? 'var(--success-color)' : 'var(--danger-color)'}`,
      boxShadow: 'var(--shadow-lg)',
      borderRadius: 'var(--radius)',
      padding: '1rem 1.25rem',
      maxWidth: '350px',
      animation: 'slideIn 0.3s ease forwards'
    }}>
      {isSuccess ? (
        <CheckCircle size={20} color="var(--success-color)" />
      ) : (
        <AlertCircle size={20} color="var(--danger-color)" />
      )}
      <div style={{ fontSize: '0.875rem', color: 'var(--text-color)', fontWeight: 500, flex: 1 }}>
        {toast.message}
      </div>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(120%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Toast;
