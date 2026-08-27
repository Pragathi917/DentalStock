import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getInventory, deleteInventory } from '../services/inventoryService';
import { getErrorMessage } from '../utils/errorHandler';
import { formatDate } from '../utils/formatDate';
import { formatCurrency } from '../utils/formatCurrency';
import Modal from '../components/Modal';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Eye, 
  X,
  AlertTriangle,
  Info
} from 'lucide-react';

const CATEGORIES = [
  'Consumable',
  'Restorative Material',
  'Endodontic',
  'Prosthodontic',
  'Preventive',
  'Sterilization',
  'Anesthetic',
  'Other'
];

const STATUS_LABELS = {
  'GOOD': 'Good',
  'LOW_STOCK': 'Low Stock',
  'EXPIRING_SOON': 'Expiring Soon',
  'EXPIRED': 'Expired',
  'LOW_AND_EXPIRING': 'Low & Expiring'
};

const Inventory = () => {
  const { user, showToast } = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters State
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('');

  // Modal Control States
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [deleteItemName, setDeleteItemName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (status) params.status = status;
      if (sort) params.sort = sort;

      const data = await getInventory(params);
      setItems(data.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search slightly or fetch on change
    const delayDebounceFn = setTimeout(() => {
      fetchItems();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, category, status, sort]);

  const handleClearFilters = () => {
    setSearch('');
    setCategory('');
    setStatus('');
    setSort('');
  };

  const handleOpenView = (item) => {
    setSelectedItem(item);
    setViewModalOpen(true);
  };

  const handleOpenDelete = (item) => {
    setDeletingId(item._id);
    setDeleteItemName(item.name);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setSubmitting(true);
    try {
      await deleteInventory(deletingId);
      showToast('Inventory item deleted successfully.', 'success');
      setDeleteModalOpen(false);
      fetchItems();
    } catch (err) {
      showToast(getErrorMessage(err), 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStatusBadge = (statusValue) => {
    const label = STATUS_LABELS[statusValue] || statusValue;
    switch (statusValue) {
      case 'GOOD':
        return <span className="badge badge-good">{label}</span>;
      case 'LOW_STOCK':
        return <span className="badge badge-low-stock">{label}</span>;
      case 'EXPIRING_SOON':
        return <span className="badge badge-expiring">{label}</span>;
      case 'EXPIRED':
        return <span className="badge badge-expired">{label}</span>;
      case 'LOW_AND_EXPIRING':
        return <span className="badge badge-low-expiring">{label}</span>;
      default:
        return <span className="badge">{label}</span>;
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="page-container">
      {/* Title Header area */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-teal)', letterSpacing: '-0.02em' }}>Inventory List</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Manage and monitor dental clinic stock supplies.</p>
        </div>
        {isAdmin && (
          <Link to="/inventory/add" className="btn btn-primary">
            <Plus size={16} /> Add Inventory
          </Link>
        )}
      </div>

      {/* Filters Toolbar */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          alignItems: 'end'
        }} className="filters-toolbar-grid">
          
          {/* Search bar */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Search Items</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.25rem' }}
                placeholder="Item name or supplier..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Category Dropdown Filter */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Category</label>
            <select 
              className="form-control" 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Status Dropdown Filter */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Stock Status</label>
            <select 
              className="form-control" 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              {Object.keys(STATUS_LABELS).map(key => (
                <option key={key} value={key}>{STATUS_LABELS[key]}</option>
              ))}
            </select>
          </div>

          {/* Sorting Dropdown */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Sort By</label>
            <select 
              className="form-control" 
              value={sort} 
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">Default (Recent)</option>
              <option value="expiryDate">Soonest Expiry</option>
              <option value="quantity">Lowest Stock</option>
            </select>
          </div>
        </div>

        {/* Clear filters row */}
        {(search || category || status || sort) && (
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              onClick={handleClearFilters}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                border: 'none',
                background: 'none',
                color: 'var(--danger-color)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <X size={14} /> Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Main Table view */}
      {error ? (
        <div className="card text-center" style={{ padding: '3rem', textAlign: 'center' }}>
          <AlertTriangle size={48} color="var(--danger-color)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ color: 'var(--primary-teal)', marginBottom: '0.5rem' }}>Unable to load inventory</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error}</p>
          <button className="btn btn-primary" onClick={fetchItems}>Retry</button>
        </div>
      ) : loading ? (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                {['Item', 'Category', 'Quantity', 'Supplier', 'Price', 'Expiry', 'Status', 'Actions'].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map(rowIdx => (
                <tr key={rowIdx}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(colIdx => (
                    <td key={colIdx}>
                      <div className="skeleton skeleton-text" style={{ width: colIdx === 1 ? '150px' : '70px', marginBottom: 0 }} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : items.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Info size={40} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ color: 'var(--primary-teal)', marginBottom: '0.5rem' }}>No inventory items found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '360px', marginBottom: '1.5rem' }}>
            No stock products match your search or selected filters. Try broadening your query terms.
          </p>
          {(search || category || status || sort) && (
            <button className="btn btn-secondary" onClick={handleClearFilters}>Reset Filters</button>
          )}
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Supplier</th>
                <th>Price</th>
                <th>Expiry</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td style={{ fontWeight: 600, color: 'var(--primary-teal)' }}>{item.name}</td>
                  <td>{item.category}</td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{item.quantity}</span>{' '}
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.unit}</span>
                  </td>
                  <td>{item.supplier}</td>
                  <td style={{ fontWeight: 500 }}>{formatCurrency(item.price)}</td>
                  <td>{formatDate(item.expiryDate)}</td>
                  <td>{renderStatusBadge(item.status)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => handleOpenView(item)}
                        className="btn btn-secondary"
                        style={{ padding: '0.375rem', borderRadius: '6px' }}
                        title="View details"
                      >
                        <Eye size={14} />
                      </button>
                      {isAdmin && (
                        <>
                          <button 
                            onClick={() => navigate(`/inventory/edit/${item._id}`)}
                            className="btn btn-secondary"
                            style={{ padding: '0.375rem', borderRadius: '6px', color: 'var(--secondary-teal)' }}
                            title="Edit item"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => handleOpenDelete(item)}
                            className="btn btn-secondary"
                            style={{ padding: '0.375rem', borderRadius: '6px', color: 'var(--danger-color)' }}
                            title="Delete item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reusable View Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Inventory Details"
        footerActions={
          <button className="btn btn-secondary" onClick={() => setViewModalOpen(false)}>Close</button>
        }
      >
        {selectedItem && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Item Name</span>
              <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary-teal)', marginTop: '0.125rem' }}>{selectedItem.name}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>CATEGORY</span>
                <div style={{ fontWeight: 500, marginTop: '0.125rem' }}>{selectedItem.category}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>STOCK LEVEL</span>
                <div style={{ fontWeight: 500, marginTop: '0.125rem' }}>{selectedItem.quantity} {selectedItem.unit} (Min: {selectedItem.minimumStock})</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>BATCH NUMBER</span>
                <div style={{ fontWeight: 500, marginTop: '0.125rem' }}>{selectedItem.batchNumber}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>STATUS</span>
                <div style={{ marginTop: '0.125rem' }}>{renderStatusBadge(selectedItem.status)}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>SUPPLIER</span>
                <div style={{ fontWeight: 500, marginTop: '0.125rem' }}>{selectedItem.supplier}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>UNIT PRICE</span>
                <div style={{ fontWeight: 600, color: 'var(--primary-teal)', marginTop: '0.125rem' }}>{formatCurrency(selectedItem.price)}</div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>EXPIRY DATE</span>
              <div style={{ fontWeight: 600, color: 'var(--danger-color)', marginTop: '0.125rem' }}>
                {formatDate(selectedItem.expiryDate)}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Inventory Item"
        footerActions={
          <>
            <button className="btn btn-secondary" onClick={() => setDeleteModalOpen(false)} disabled={submitting}>Cancel</button>
            <button className="btn btn-danger" onClick={handleDeleteConfirm} disabled={submitting}>
              {submitting ? 'Deleting...' : 'Delete'}
            </button>
          </>
        }
      >
        <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
          <AlertTriangle size={36} color="var(--danger-color)" style={{ marginBottom: '1rem' }} />
          <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--primary-teal)', marginBottom: '0.5rem' }}>
            Are you sure you want to delete {deleteItemName}?
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
            This action cannot be undone and will permanently remove this item from the clinical inventory database.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Inventory;
export { CATEGORIES };
