import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createInventory } from '../services/inventoryService';
import { getErrorMessage } from '../utils/errorHandler';
import { CATEGORIES } from './Inventory';
import { ArrowLeft, Loader2 } from 'lucide-react';

const AddInventory = () => {
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

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error message on change
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
    
    if (!formData.unit.trim()) tempErrors.unit = 'Unit (e.g. boxes) is required.';
    
    if (formData.minimumStock === '') {
      tempErrors.minimumStock = 'Minimum stock is required.';
    } else if (Number(formData.minimumStock) < 0) {
      tempErrors.minimumStock = 'Minimum stock cannot be negative.';
    }

    if (!formData.supplier.trim()) tempErrors.supplier = 'Supplier name is required.';

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
      await createInventory(submitData);
      showToast('Inventory item created successfully', 'success');
      navigate('/inventory');
    } catch (err) {
      showToast(getErrorMessage(err), 'danger');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      {/* Navigation and title */}
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
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-teal)', letterSpacing: '-0.02em' }}>Add Inventory Item</h2>
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
                  Adding Item...
                </>
              ) : 'Add Item'}
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

export default AddInventory;
