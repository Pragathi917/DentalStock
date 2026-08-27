import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUsers, createStaff, deleteUser } from '../services/userService';
import { getErrorMessage } from '../utils/errorHandler';
import { formatDate } from '../utils/formatDate';
import Modal from '../components/Modal';
import { 
  Users as UsersIcon, 
  UserPlus, 
  Trash2, 
  Loader2, 
  AlertTriangle,
  Info,
  ShieldAlert,
  Check
} from 'lucide-react';

const Users = () => {
  const { user: currentUser, showToast } = useAuth();

  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Add Staff Modal Form States
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete User Modal States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState('');
  const [deletingUserName, setDeletingUserName] = useState('');
  const [deletingUserEmail, setDeletingUserEmail] = useState('');
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getUsers();
      setUsersList(data.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const handleOpenAddModal = () => {
    setName('');
    setEmail('');
    setPassword('');
    setFormError('');
    setAddModalOpen(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) return setFormError('Name is required.');
    if (!email.trim()) return setFormError('Email is required.');
    
    const meetsAllCriteria = 
      passwordChecks.length && 
      passwordChecks.uppercase && 
      passwordChecks.lowercase && 
      passwordChecks.special;
    if (!meetsAllCriteria) {
      return setFormError('Password does not meet complexity requirements.');
    }

    setSaving(true);
    try {
      await createStaff({
        name,
        email,
        password,
        role: 'staff' // Auto set role to 'staff'
      });
      showToast('Staff account created successfully.', 'success');
      setAddModalOpen(false);
      fetchUsers();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleOpenDeleteModal = (user) => {
    // Basic guards
    if (user._id === currentUser.id) {
      showToast('You cannot delete your own account.', 'danger');
      return;
    }
    setDeletingUserId(user._id);
    setDeletingUserName(user.name);
    setDeletingUserEmail(user.email);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await deleteUser(deletingUserId);
      showToast('Staff member deleted successfully.', 'success');
      setDeleteModalOpen(false);
      fetchUsers();
    } catch (err) {
      showToast(getErrorMessage(err), 'danger');
    } finally {
      setDeleting(false);
    }
  };

  const totalUsers = usersList.length;
  const staffUsers = usersList.filter(u => u.role === 'staff').length;

  return (
    <div className="page-container">
      {/* Title */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-teal)', letterSpacing: '-0.02em' }}>User Management</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Manage clinic staff access permissions to DentalStock.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          <UserPlus size={16} /> Add Staff
        </button>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem',
        marginBottom: '1.5rem'
      }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: 0 }}>
          <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: 'var(--soft-mint)', color: 'var(--primary-teal)' }}>
            <UsersIcon size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-teal)' }}>{totalUsers}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>Total Registered Accounts</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: 0 }}>
          <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: 'var(--warm-ivory)', color: 'var(--secondary-teal)' }}>
            <UsersIcon size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-teal)' }}>{staffUsers}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>Staff Level Accounts</div>
          </div>
        </div>
      </div>

      {/* Main Table Panel */}
      {error ? (
        <div className="card text-center" style={{ padding: '3rem', textAlign: 'center' }}>
          <AlertTriangle size={48} color="var(--danger-color)" style={{ marginBottom: '1rem', margin: '0 auto' }} />
          <h3 style={{ color: 'var(--primary-teal)', marginBottom: '0.5rem' }}>Unable to load users</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error}</p>
          <button className="btn btn-primary" onClick={fetchUsers}>Retry</button>
        </div>
      ) : loading ? (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                {['Name', 'Email', 'Role', 'Created Date', 'Actions'].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {[1, 2].map(row => (
                <tr key={row}>
                  {[1, 2, 3, 4, 5].map(col => (
                    <td key={col}><div className="skeleton skeleton-text" style={{ marginBottom: 0 }} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : usersList.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Info size={36} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ color: 'var(--primary-teal)', marginBottom: '0.5rem' }}>No staff members found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Click "+ Add Staff" button above to add clinic workers.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((usr) => (
                <tr key={usr._id}>
                  <td style={{ fontWeight: 600, color: 'var(--primary-teal)' }}>{usr.name}</td>
                  <td>{usr.email}</td>
                  <td>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      backgroundColor: usr.role === 'admin' ? '#FCE4D6' : '#E2F0D9',
                      color: usr.role === 'admin' ? 'var(--danger-color)' : 'var(--success-color)',
                      border: `1px solid ${usr.role === 'admin' ? '#F2C1B0' : '#C1DCB7'}`
                    }}>{usr.role}</span>
                  </td>
                  <td>{formatDate(usr.createdAt)}</td>
                  <td style={{ textAlign: 'right' }}>
                    {usr._id !== currentUser.id ? (
                      <button 
                        onClick={() => handleOpenDeleteModal(usr)}
                        className="btn btn-secondary"
                        style={{ padding: '0.375rem', borderRadius: '6px', color: 'var(--danger-color)' }}
                        title="Delete user"
                      >
                        <Trash2 size={14} />
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', paddingRight: '0.5rem' }}>
                        Current Account
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Staff Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Staff Account"
        footerActions={
          <>
            <button className="btn btn-secondary" onClick={() => setAddModalOpen(false)} disabled={saving}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAddSubmit} disabled={saving}>
              {saving ? 'Creating...' : 'Create Account'}
            </button>
          </>
        }
      >
        <form onSubmit={handleAddSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="staffName">Staff Name *</label>
            <input
              id="staffName"
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="staffEmail">Email Address *</label>
            <input
              id="staffEmail"
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@dentalstock.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="staffPass">Password *</label>
            <input
              id="staffPass"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
            />
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
          </div>

          {formError && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#FCE4D6',
              color: 'var(--danger-color)',
              padding: '0.75rem',
              borderRadius: 'var(--radius)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              marginTop: '1rem'
            }}>
              <AlertTriangle size={16} />
              <span>{formError}</span>
            </div>
          )}
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Remove Staff Account"
        footerActions={
          <>
            <button className="btn btn-secondary" onClick={() => setDeleteModalOpen(false)} disabled={deleting}>Cancel</button>
            <button className="btn btn-danger" onClick={handleDeleteConfirm} disabled={deleting}>
              {deleting ? 'Removing...' : 'Remove'}
            </button>
          </>
        }
      >
        <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
          <ShieldAlert size={36} color="var(--danger-color)" style={{ marginBottom: '1rem', margin: '0 auto' }} />
          <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--primary-teal)', marginBottom: '0.5rem' }}>
            Are you sure you want to delete {deletingUserName}?
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
            This will permanently remove the account for <strong>{deletingUserEmail}</strong>. They will immediately lose access to the system.
          </p>
        </div>
      </Modal>

    </div>
  );
};

export default Users;
