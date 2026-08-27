import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getInventory } from '../services/inventoryService';
import { recordUsage, getUsageHistory } from '../services/usageService';
import { getErrorMessage } from '../utils/errorHandler';
import { formatDate } from '../utils/formatDate';
import { 
  Plus, 
  Search, 
  Calendar, 
  X, 
  Info,
  Loader2,
  AlertCircle
} from 'lucide-react';

const PURPOSES = [
  'General Treatment',
  'Cleaning',
  'Extraction',
  'Root Canal',
  'Restoration',
  'Preventive Care',
  'Other'
];

const Usage = () => {
  const { showToast } = useAuth();

  // Data States
  const [inventoryList, setInventoryList] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [errorList, setErrorList] = useState('');
  const [errorLogs, setErrorLogs] = useState('');

  // Form Record States
  const [selectedItemId, setSelectedItemId] = useState('');
  const [quantityUsed, setQuantityUsed] = useState('');
  const [purpose, setPurpose] = useState('');
  const [date, setDate] = useState('');
  const [formError, setFormError] = useState('');
  const [recording, setRecording] = useState(false);

  // Filters States
  const [filterItem, setFilterItem] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch inventory options dropdown list
  const fetchInventoryOptions = async () => {
    setLoadingList(true);
    setErrorList('');
    try {
      const data = await getInventory();
      // Dropdown only needs items with positive stock for usage recording, but list all for robustness
      setInventoryList(data.data);
    } catch (err) {
      setErrorList(getErrorMessage(err));
    } finally {
      setLoadingList(false);
    }
  };

  // Fetch usage logs history
  const fetchUsageHistory = async () => {
    setLoadingLogs(true);
    setErrorLogs('');
    try {
      const params = {};
      if (filterItem) params.item = filterItem;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const data = await getUsageHistory(params);
      setLogs(data.data);
    } catch (err) {
      setErrorLogs(getErrorMessage(err));
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchInventoryOptions();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsageHistory();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [filterItem, startDate, endDate]);

  const handleClearFilters = () => {
    setFilterItem('');
    setStartDate('');
    setEndDate('');
  };

  // Find currently selected item stock details
  const currentSelectedItem = inventoryList.find(item => item._id === selectedItemId);

  const handleRecordSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!selectedItemId) {
      setFormError('Please select an inventory item.');
      return;
    }
    if (!quantityUsed || Number(quantityUsed) <= 0) {
      setFormError('Quantity used must be greater than zero.');
      return;
    }
    if (!purpose) {
      setFormError('Please select a procedure purpose.');
      return;
    }

    if (currentSelectedItem && currentSelectedItem.quantity < Number(quantityUsed)) {
      setFormError(`Quantity used cannot exceed current stock. (Available: ${currentSelectedItem.quantity} ${currentSelectedItem.unit})`);
      return;
    }

    setRecording(true);
    try {
      const submitData = {
        inventoryId: selectedItemId,
        quantityUsed: Number(quantityUsed),
        purpose,
        date: date ? new Date(date).toISOString() : new Date().toISOString()
      };

      await recordUsage(submitData);
      showToast('Usage recorded successfully', 'success');

      // Reset form fields
      setSelectedItemId('');
      setQuantityUsed('');
      setPurpose('');
      setDate('');

      // Refresh list options and history logs
      fetchInventoryOptions();
      fetchUsageHistory();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setRecording(false);
    }
  };

  return (
    <div className="page-container">
      {/* Title */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-teal)', letterSpacing: '-0.02em' }}>Inventory Usage</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Track supplies consumed during clinical procedures.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 2fr',
        gap: '1.5rem',
        alignItems: 'start'
      }} className="usage-layout-grid">
        
        {/* Left Side: Form */}
        <div className="card">
          <h3 style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--primary-teal)',
            marginBottom: '1.25rem',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '0.5rem'
          }}>Record Usage</h3>

          <form onSubmit={handleRecordSubmit}>
            
            {/* Item selector */}
            <div className="form-group">
              <label className="form-label" htmlFor="inventoryId">Inventory Item *</label>
              <select
                id="inventoryId"
                className="form-control"
                value={selectedItemId}
                onChange={(e) => {
                  setSelectedItemId(e.target.value);
                  setFormError('');
                }}
                disabled={loadingList || recording}
              >
                <option value="">Select Item</option>
                {inventoryList.map(item => (
                  <option key={item._id} value={item._id}>
                    {item.name} ({item.quantity} {item.unit} available)
                  </option>
                ))}
              </select>
              {errorList && <div className="error-text">Unable to load items: {errorList}</div>}
            </div>

            {/* Quantity info */}
            <div className="form-group">
              <label className="form-label" htmlFor="quantityUsed">Quantity Used *</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  id="quantityUsed"
                  type="number"
                  min="1"
                  className="form-control"
                  value={quantityUsed}
                  onChange={(e) => {
                    setQuantityUsed(e.target.value);
                    setFormError('');
                  }}
                  placeholder="e.g. 5"
                  disabled={recording}
                />
                {currentSelectedItem && (
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {currentSelectedItem.unit}
                  </span>
                )}
              </div>
            </div>

            {/* Purpose */}
            <div className="form-group">
              <label className="form-label" htmlFor="purpose">Purpose *</label>
              <select
                id="purpose"
                className="form-control"
                value={purpose}
                onChange={(e) => {
                  setPurpose(e.target.value);
                  setFormError('');
                }}
                disabled={recording}
              >
                <option value="">Select Purpose</option>
                {PURPOSES.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="form-group">
              <label className="form-label" htmlFor="date">Date Used</label>
              <input
                id="date"
                type="date"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={recording}
              />
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
                marginBottom: '1rem'
              }}>
                <AlertCircle size={16} />
                <span>{formError}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={recording}
            >
              {recording ? (
                <>
                  <Loader2 size={16} className="skeleton" style={{ animation: 'loading 1.5s infinite' }} />
                  Recording...
                </>
              ) : 'Record Usage'}
            </button>

          </form>
        </div>

        {/* Right Side: Usage Logs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Logs Search / Filters */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              alignItems: 'end'
            }} className="usage-filters-grid">
              
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Search Item Logs</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Gloves..."
                    value={filterItem}
                    onChange={(e) => setFilterItem(e.target.value)}
                    style={{ paddingLeft: '2rem' }}
                  />
                  <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {(filterItem || startDate || endDate) && (
              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  onClick={handleClearFilters}
                  style={{
                    border: 'none',
                    background: 'none',
                    color: 'var(--danger-color)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <X size={14} /> Reset Log Filters
                </button>
              </div>
            )}
          </div>

          {/* Logs Table */}
          {errorLogs ? (
            <div className="card text-center" style={{ padding: '3rem', textAlign: 'center' }}>
              <AlertCircle size={48} color="var(--danger-color)" style={{ marginBottom: '1rem', margin: '0 auto' }} />
              <h3 style={{ color: 'var(--primary-teal)', marginBottom: '0.5rem' }}>Unable to load usage logs</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{errorLogs}</p>
              <button className="btn btn-primary" onClick={fetchUsageHistory}>Retry</button>
            </div>
          ) : loadingLogs ? (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    {['Date', 'Item', 'Quantity', 'Purpose', 'Recorded By'].map(h => <th key={h}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map(row => (
                    <tr key={row}>
                      {[1, 2, 3, 4, 5].map(col => (
                        <td key={col}><div className="skeleton skeleton-text" style={{ marginBottom: 0 }} /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : logs.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Info size={36} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ color: 'var(--primary-teal)', marginBottom: '0.5rem' }}>No usage records yet</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '340px' }}>
                Usage logs history will appear here after item supplies are consumed.
              </p>
            </div>
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Item</th>
                    <th>Qty Used</th>
                    <th>Purpose</th>
                    <th>Recorded By</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log._id}>
                      <td style={{ fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>{formatDate(log.date)}</td>
                      <td style={{ fontWeight: 600, color: 'var(--primary-teal)' }}>{log.itemName}</td>
                      <td>{log.quantityUsed}</td>
                      <td>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          backgroundColor: 'var(--warm-ivory)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          border: '1px solid var(--border-color)'
                        }}>{log.purpose}</span>
                      </td>
                      <td style={{ fontSize: '0.8125rem' }}>{log.recordedBy?.name || 'Staff'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .usage-layout-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 500px) {
          .usage-filters-grid {
            grid-template-columns: 1fr !important;
            gap: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Usage;
