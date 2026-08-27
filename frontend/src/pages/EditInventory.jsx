import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getInventoryById, updateInventory } from '../services/inventoryService';
import { getErrorMessage } from '../utils/errorHandler';
import { CATEGORIES } from './Inventory';
import { ArrowLeft, Loader2, AlertTriangle } from 'lucide-react';

const EditInventory = () => {
  const { id } = useParams();
  const { showToast } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    unit: '',
    minimumStock: '',
    supplier: '',
    price: '',
    batchNumber: '',
    expiryDate: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchItemDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getInventoryById(id);
      const item = data.data;
      
      // Convert date string back into YYYY-MM-DD for date input
      let cleanDate = '';
      if (item.expiryDate) {
        cleanDate = new Date(item.expiryDate).toISOString().split('T')[0];
      }

      setFormData({
        name: item.name || '',
        category: item.category || '',
        quantity: item.quantity !== undefined ? item.quantity : '',
        unit: item.unit || '',
        minimumStock: item.minimumStock !== undefined ? item.minimumStock : '',
        supplier: item.supplier || '',
        price: item.price !== undefined ? item.price : '',
        batchNumber: item.batchNumber || '',
        expiryDate: cleanDate,
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Item name is required.';
    if (!formData.category) tempErrors.category = 'Category selection is required.';
    
    if (formData.quantity === '') {
      tempErrors.quantity = 'Quantity is required.';
    } else if (Number(formData.quantity) < 0) {
      tempErrors.quantity = 'Quantity cannot be negative.';
    }
    
    if (!formData.unit.trim()) tempErrors.unit = 'Unit is required.';
    
    if (formData.minimumStock === '') {
      tempErrors.minimumStock = 'Minimum stock is required.';
    } else if (Number(formData.minimumStock) < 0) {
      tempErrors.minimumStock = 'Minimum stock cannot be negative.';
    }

    if (!formData.supplier.trim()) tempErrors.supplier = 'Supplier is required.';

    if (formData.price === '') {
      tempErrors.price = 'Price is required.';
    } else if (Number(formData.price) < 0) {
      tempErrors.price = 'Price cannot be negative.';
    }

    if (!formData.batchNumber.trim()) tempErrors.batchNumber = 'Batch number is required.';
    if (!formData.expiryDate) tempErrors.expiryDate = 'Expiry date is required.';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const submitData = {
        ...formData,
        quantity: Number(formData.quantity),
        minimumStock: Number(formData.minimumStock),
        price: Number(formData.price),
      };
      await updateInventory(id, submitData);
      showToast('Inventory item updated successfully', 'success');
      navigate('/inventory');
    } catch (err) {
      showToast(getErrorMessage(err), 'danger');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="skeleton" style={{ height: '30px', width: '200px', marginBottom: '1.5rem' }} />
        <div className="skeleton" style={{ height: '400px', width: '100%', maxWidth: '700px' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="card" style={{ textAlign: 'center', padding: '3rem', maxWidth: '500px', margin: '2rem auto' }}>
          <AlertTriangle size={48} color="var(--danger-color)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ color: 'var(--primary-teal)', marginBottom: '0.5rem' }}>Inventory item not found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error}</p>
          <button className="btn btn-primary" onClick={() => navigate('/inventory')}>Back to Inventory</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Navigation and Title */}
      <div style={{ marginBottom: '1.5rem' }}>
        <button 
          onClick={() => navigate('/inventory')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '0.875rem',
            marginBottom: '0.75rem'
          }}
        >
          <ArrowLeft size={16} /> Back to Inventory
        </button>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-teal)', letterSpacing: '-0.02em' }}>Edit Inventory Item</h2>
      </div>

      <div className="card" style={{ maxWidth: '700px' }}>
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label className="form-label" htmlFor="name">Item Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Latex Sterile Gloves"
            />
            {errors.name && <div className="error-text">{errors.name}</div>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-row-2">
            <div className="form-group">
              <label className="form-label" htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <div className="error-text">{errors.category}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="batchNumber">Batch Number *</label>
              <input
                id="batchNumber"
                name="batchNumber"
                type="text"
                className="form-control"
                value={formData.batchNumber}
                onChange={handleChange}
                placeholder="e.g. B-1029-X"
              />
              {errors.batchNumber && <div className="error-text">{errors.batchNumber}</div>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }} className="form-row-3">
            <div className="form-group">
              <label className="form-label" htmlFor="quantity">Quantity *</label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                className="form-control"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="50"
              />
              {errors.quantity && <div className="error-text">{errors.quantity}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="unit">Unit *</label>
              <input
                id="unit"
                name="unit"
                type="text"
                className="form-control"
                value={formData.unit}
                onChange={handleChange}
                placeholder="e.g. boxes"
              />
              {errors.unit && <div className="error-text">{errors.unit}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="minimumStock">Minimum Stock *</label>
              <input
                id="minimumStock"
                name="minimumStock"
                type="number"
                min="0"
                className="form-control"
                value={formData.minimumStock}
                onChange={handleChange}
                placeholder="10"
              />
              {errors.minimumStock && <div className="error-text">{errors.minimumStock}</div>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-row-2">
            <div className="form-group">
              <label className="form-label" htmlFor="price">Price (₹) *</label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                className="form-control"
                value={formData.price}
                onChange={handleChange}
                placeholder="499.00"
              />
              {errors.price && <div className="error-text">{errors.price}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="expiryDate">Expiry Date *</label>
              <input
                id="expiryDate"
                name="expiryDate"
                type="date"
                className="form-control"
                value={formData.expiryDate}
                onChange={handleChange}
              />
              {errors.expiryDate && <div className="error-text">{errors.expiryDate}</div>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="supplier">Supplier *</label>
            <input
              id="supplier"
              name="supplier"
              type="text"
              className="form-control"
              value={formData.supplier}
              onChange={handleChange}
              placeholder="e.g. ABC Medical Supplies Inc."
            />
            {errors.supplier && <div className="error-text">{errors.supplier}</div>}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            marginTop: '2rem',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1.25rem'
          }}>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => navigate('/inventory')}
              disabled={saving}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="skeleton" style={{ animation: 'loading 1.5s infinite' }} />
                  Saving Changes...
                </>
              ) : 'Save Changes'}
            </button>
          </div>

        </form>
      </div>

      <style>{`
        @media (max-width: 550px) {
          .form-row-2, .form-row-3 {
            grid-template-columns: 1fr !important;
            gap: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default EditInventory;
