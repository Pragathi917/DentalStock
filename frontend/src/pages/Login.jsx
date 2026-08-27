import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register as apiRegister } from '../services/authService';
import { getErrorMessage } from '../utils/errorHandler';
import { 
  Sparkles, 
  Loader2, 
  Eye, 
  EyeOff, 
  Check, 
  User, 
  Mail, 
  Lock, 
  ArrowRight 
} from 'lucide-react';

const Login = () => {
  const { login, isAuthenticated, showToast } = useAuth();
  const navigate = useNavigate();

  // Mode: Sign In (false) or Create Account (true)
  const [isSignUp, setIsSignUp] = useState(false);

  // Form inputs state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility triggers
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Loaders and errors
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // If already logged in, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Live password validation checks
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const validate = () => {
    const tempErrors = {};
    if (isSignUp && !name.trim()) {
      tempErrors.name = 'Full name is required.';
    }
    if (!email) {
      tempErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      tempErrors.password = 'Password is required.';
    } else {
      const meetsAllCriteria = 
        passwordChecks.length && 
        passwordChecks.uppercase && 
        passwordChecks.lowercase && 
        passwordChecks.special;
      if (!meetsAllCriteria) {
        tempErrors.password = 'Password does not meet complexity requirements.';
      }
    }

    if (isSignUp) {
      if (!confirmPassword) {
        tempErrors.confirmPassword = 'Please confirm your password.';
      } else if (password !== confirmPassword) {
        tempErrors.confirmPassword = 'Passwords do not match.';
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (isSignUp) {
        // Register new staff account
        const data = await apiRegister(name, email, password);
        if (data.success) {
          showToast('Staff account registered successfully! Logging in...', 'success');
          // Automatically log in after registration
          await login(email, password);
          navigate('/dashboard', { replace: true });
        }
      } else {
        // Normal Sign In
        await login(email, password);
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      // Errors handled via toast in AuthContext or local mapping
      showToast(getErrorMessage(err), 'danger');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(prev => !prev);
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrors({});
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#FAF8F3'
    }}>
      {/* Left Column: Visual Panel */}
      <div style={{
        flex: 1.2,
        backgroundColor: 'var(--primary-teal)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '3rem',
        color: 'var(--white)',
        position: 'relative',
        overflow: 'hidden'
      }} className="login-visual-panel">
        
        {/* Subtle grid pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.05,
          backgroundImage: 'radial-gradient(var(--white) 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '480px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: '#2D6A68',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={22} color="var(--soft-mint)" />
            </div>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em' }}>DentalStock</span>
          </div>

          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: '1rem',
            letterSpacing: '-0.02em'
          }}>Clinical inventory management, refined.</h2>
          
          <p style={{
            fontSize: '1rem',
            color: 'var(--soft-mint)',
            lineHeight: 1.6,
            marginBottom: '2.5rem'
          }}>
            Smarter stock monitoring, automated procedure usage tracking, and intelligent demand forecasting tailored for modern dental care clinics.
          </p>

          <div style={{
            borderLeft: '2px solid var(--soft-mint)',
            paddingLeft: '1.25rem'
          }}>
            <span style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--soft-mint)' }}>
              Dental Hospital Inventory System
            </span>
            <span style={{ fontSize: '0.75rem', color: '#88B0AD', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Institutional Access Gate
            </span>
          </div>
        </div>
      </div>

      {/* Right Column: Dynamic Form (Sign In / Create Account) */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        backgroundColor: '#FAF8F3'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '430px',
          backgroundColor: 'var(--white)',
          padding: '2.5rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-color)'
        }} className="auth-form-card">
          
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'var(--primary-teal)',
              marginBottom: '0.375rem'
            }}>
              {isSignUp ? 'Create Account' : 'Sign In'}
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              {isSignUp 
                ? 'Join Clinical Precision to streamline your practice.' 
                : 'Enter your clinical credentials to continue'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            
            {/* 1. Full Name input (Sign Up mode only) */}
            {isSignUp && (
              <div className="form-group">
                <label className="form-label" htmlFor="fullName" style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="fullName"
                    type="text"
                    className="form-control"
                    style={{ paddingLeft: '2.5rem', backgroundColor: '#EBF0FF', border: 'none' }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dr. Jane Doe"
                    disabled={loading}
                  />
                  <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
                {errors.name && <div className="error-text">{errors.name}</div>}
              </div>
            )}

            {/* 2. Professional Email input */}
            <div className="form-group">
              <label className="form-label" htmlFor="email" style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                {isSignUp ? 'Professional Email' : 'Email Address'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem', backgroundColor: '#EBF0FF', border: 'none' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isSignUp ? 'jane.doe@practice.com' : 'doctor@hospital.com'}
                  disabled={loading}
                />
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
              {errors.email && <div className="error-text">{errors.email}</div>}
            </div>

            {/* 3. Password input */}
            <div className="form-group">
              <label className="form-label" htmlFor="password" style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', backgroundColor: '#EBF0FF', border: 'none' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                />
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '12px',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              
              {/* Dynamic checklist for password requirements */}
              {password.length > 0 && (
                <div style={{
                  marginTop: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.375rem',
                  backgroundColor: 'var(--warm-ivory)',
                  padding: '0.625rem 0.875rem',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border-color)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: passwordChecks.length ? 'var(--success-color)' : 'var(--text-muted)' }}>
                    <div style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      border: `1px solid ${passwordChecks.length ? 'var(--success-color)' : 'var(--text-muted)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: passwordChecks.length ? '#E2F0D9' : 'transparent',
                      flexShrink: 0
                    }}>
                      {passwordChecks.length && <Check size={10} strokeWidth={3} />}
                    </div>
                    <span>At least 8 characters</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: passwordChecks.uppercase ? 'var(--success-color)' : 'var(--text-muted)' }}>
                    <div style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      border: `1px solid ${passwordChecks.uppercase ? 'var(--success-color)' : 'var(--text-muted)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: passwordChecks.uppercase ? '#E2F0D9' : 'transparent',
                      flexShrink: 0
                    }}>
                      {passwordChecks.uppercase && <Check size={10} strokeWidth={3} />}
                    </div>
                    <span>Contains uppercase letter (A-Z)</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: passwordChecks.lowercase ? 'var(--success-color)' : 'var(--text-muted)' }}>
                    <div style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      border: `1px solid ${passwordChecks.lowercase ? 'var(--success-color)' : 'var(--text-muted)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: passwordChecks.lowercase ? '#E2F0D9' : 'transparent',
                      flexShrink: 0
                    }}>
                      {passwordChecks.lowercase && <Check size={10} strokeWidth={3} />}
                    </div>
                    <span>Contains lowercase letter (a-z)</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: passwordChecks.special ? 'var(--success-color)' : 'var(--text-muted)' }}>
                    <div style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      border: `1px solid ${passwordChecks.special ? 'var(--success-color)' : 'var(--text-muted)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: passwordChecks.special ? '#E2F0D9' : 'transparent',
                      flexShrink: 0
                    }}>
                      {passwordChecks.special && <Check size={10} strokeWidth={3} />}
                    </div>
                    <span>Contains special character (e.g. @, #, $, %)</span>
                  </div>
                </div>
              )}
              {errors.password && <div className="error-text">{errors.password}</div>}
            </div>

            {/* 4. Confirm Password input (Sign Up mode only) */}
            {isSignUp && (
              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword" style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="form-control"
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', backgroundColor: '#EBF0FF', border: 'none' }}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(prev => !prev)}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: '12px',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    tabIndex="-1"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && <div className="error-text">{errors.confirmPassword}</div>}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="btn"
              style={{
                width: '100%',
                marginTop: '1.5rem',
                height: '46px',
                backgroundColor: 'var(--primary-teal)',
                color: 'var(--white)',
                fontSize: '0.875rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                textTransform: 'uppercase'
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="skeleton" style={{ animation: 'loading 1.5s infinite' }} />
                  {isSignUp ? 'Registering...' : 'Signing in...'}
                </>
              ) : (
                <>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Toggle mode trigger links */}
          <div style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: 'var(--text-color)'
          }}>
            {isSignUp ? (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={toggleMode}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--primary-teal)',
                    fontWeight: 700,
                    fontSize: 'inherit',
                    padding: 0,
                    textDecoration: 'none'
                  }}
                >
                  Login here
                </button>
              </span>
            ) : (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={toggleMode}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--primary-teal)',
                    fontWeight: 700,
                    fontSize: 'inherit',
                    padding: 0,
                    textDecoration: 'none'
                  }}
                >
                  Create an account
                </button>
              </span>
            )}
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .login-visual-panel {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
