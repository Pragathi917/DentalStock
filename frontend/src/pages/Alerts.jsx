import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAlerts as fetchAlertsApi } from '../services/alertService';
import { getErrorMessage } from '../utils/errorHandler';
import { formatDate } from '../utils/formatDate';
import { 
  AlertTriangle, 
  Clock, 
  XOctagon, 
  TrendingUp, 
  ChevronRight, 
  CheckCircle,
  Loader2
} from 'lucide-react';

const Alerts = () => {
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAlerts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAlertsApi();
      setAlerts(data.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div className="skeleton" style={{ height: '30px', width: '200px', marginBottom: '1.5rem' }} />
        <div className="skeleton" style={{ height: '150px', marginBottom: '1.5rem' }} />
        <div className="skeleton" style={{ height: '150px' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <AlertTriangle size={48} color="var(--danger-color)" style={{ marginBottom: '1rem', margin: '0 auto' }} />
          <h3 style={{ color: 'var(--primary-teal)', marginBottom: '0.5rem' }}>Unable to load alerts</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error}</p>
          <button className="btn btn-primary" onClick={loadAlerts}>Retry</button>
        </div>
      </div>
    );
  }

  const { lowStock, expiringSoon, expired, forecastWarnings } = alerts || {
    lowStock: [],
    expiringSoon: [],
    expired: [],
    forecastWarnings: []
  };

  const hasAlerts = 
    lowStock.length > 0 || 
    expiringSoon.length > 0 || 
    expired.length > 0 || 
    forecastWarnings.length > 0;

  const handleViewItem = (name) => {
    navigate(`/inventory?search=${encodeURIComponent(name)}`);
  };

  const handleViewForecast = (id) => {
    navigate('/forecast');
    // For simplicity, navigating is enough, but let's pass a small location state to forecast page
    // (We could parse the item ID but forecast dropdown will let them choose)
  };

  return (
    <div className="page-container">
      {/* Title */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-teal)', letterSpacing: '-0.02em' }}>Inventory Alerts</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Critical alerts regarding stock shortages, shelf life expirations, and forecasted demands.</p>
      </div>

      {hasAlerts ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Expired Category Section (Most critical) */}
          {expired.length > 0 && (
            <div className="card" style={{ borderLeft: '4px solid var(--danger-color)' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--danger-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <XOctagon size={18} /> Expired Items ({expired.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {expired.map(item => (
                  <div key={item.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#FAF8F3',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius)',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}>
                    <div>
                      <span style={{ fontWeight: 600, color: 'var(--primary-teal)' }}>{item.name}</span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Expired on: <span style={{ fontWeight: 600, color: 'var(--danger-color)' }}>{formatDate(item.expiryDate)}</span>
                      </div>
                    </div>
                    <button className="btn btn-secondary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }} onClick={() => handleViewItem(item.name)}>
                      View Item <ChevronRight size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Low Stock Section */}
          {lowStock.length > 0 && (
            <div className="card" style={{ borderLeft: '4px solid var(--warning-color)' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--warning-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <AlertTriangle size={18} /> Low Stock Supplies ({lowStock.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {lowStock.map(item => (
                  <div key={item.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#FAF8F3',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius)',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}>
                    <div>
                      <span style={{ fontWeight: 600, color: 'var(--primary-teal)' }}>{item.name}</span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Current quantity: <span style={{ fontWeight: 700, color: 'var(--danger-color)' }}>{item.quantity}</span> | Minimum Required: {item.minimumStock}
                      </div>
                    </div>
                    <button className="btn btn-secondary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }} onClick={() => handleViewItem(item.name)}>
                      View Item <ChevronRight size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expiring Soon Section */}
          {expiringSoon.length > 0 && (
            <div className="card" style={{ borderLeft: '4px solid var(--warning-color)' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--warning-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Clock size={18} /> Expiring Soon - within 30 days ({expiringSoon.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {expiringSoon.map(item => (
                  <div key={item.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#FAF8F3',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius)',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}>
                    <div>
                      <span style={{ fontWeight: 600, color: 'var(--primary-teal)' }}>{item.name}</span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Expires on: <span style={{ fontWeight: 600, color: 'var(--warning-color)' }}>{formatDate(item.expiryDate)}</span>
                      </div>
                    </div>
                    <button className="btn btn-secondary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }} onClick={() => handleViewItem(item.name)}>
                      View Item <ChevronRight size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Forecast Warnings Section */}
          {forecastWarnings.length > 0 && (
            <div className="card" style={{ borderLeft: '4px solid var(--secondary-teal)' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--secondary-teal)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <TrendingUp size={18} /> Demand Shortage Warnings ({forecastWarnings.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {forecastWarnings.map(item => (
                  <div key={item.inventoryId} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#FAF8F3',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius)',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}>
                    <div>
                      <span style={{ fontWeight: 600, color: 'var(--primary-teal)' }}>{item.itemName}</span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Monthly usage is predicted to exceed current stock levels. (Recommended Order: <span style={{ fontWeight: 600, color: 'var(--warning-color)' }}>{item.recommendedOrder} units</span>)
                      </div>
                    </div>
                    <button className="btn btn-secondary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }} onClick={() => handleViewForecast(item.inventoryId)}>
                      View Forecast <ChevronRight size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      ) : (
        /* Empty State */
        <div className="card" style={{ textAlign: 'center', padding: '5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#E2F0D9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--success-color)',
            marginBottom: '1rem'
          }}>
            <CheckCircle size={32} />
          </div>
          <h3 style={{ color: 'var(--primary-teal)', marginBottom: '0.5rem' }}>Everything looks good</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '340px' }}>
            Your inventory currently requires no immediate attention. All items are in sufficient stock levels and within active dates.
          </p>
        </div>
      )}
    </div>
  );
};

export default Alerts;
