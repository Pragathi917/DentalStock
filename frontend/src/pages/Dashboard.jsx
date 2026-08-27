import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardStats } from '../services/dashboardService';
import { getAlerts } from '../services/alertService';
import { getErrorMessage } from '../utils/errorHandler';
import {
  Package,
  AlertTriangle,
  Clock,
  XOctagon,
  ArrowRight,
  TrendingDown,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

const CHART_COLORS = ['#164A4A', '#2D6A68', '#4E8067', '#88B0AD', '#C58A2A', '#B85C5C', '#6B7A78', '#A2B0AF'];

const Dashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, alertsRes] = await Promise.all([
        getDashboardStats(),
        getAlerts()
      ]);
      setStats(statsRes.data);
      setAlerts(alertsRes.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton" style={{ flex: 1, minWidth: '220px', height: '110px' }} />
          ))}
        </div>
        <div className="skeleton" style={{ height: '350px', width: '100%', marginBottom: '2rem' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <AlertTriangle size={48} color="var(--danger-color)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ color: 'var(--primary-teal)', marginBottom: '0.5rem' }}>Unable to load dashboard</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error}</p>
          <button className="btn btn-primary" onClick={fetchDashboardData}>Retry</button>
        </div>
      </div>
    );
  }

  // Format Recharts Category stats
  const categoryChartData = stats?.categoryStats
    ? Object.keys(stats.categoryStats).map(catName => ({
      name: catName,
      value: stats.categoryStats[catName].count,
      valuation: stats.categoryStats[catName].value
    }))
    : [];

  const usageChartData = stats?.usageChartData || [];

  // Group active highlights for dashboard Alerts Section (Limit to top 3)
  const dashboardAlerts = [];
  if (alerts) {
    alerts.expired.slice(0, 2).forEach(item => {
      dashboardAlerts.push({
        id: `expired-${item.id}`,
        type: 'expired',
        title: `${item.name} has EXPIRED.`,
        subtitle: `Expiry Date: ${new Date(item.expiryDate).toLocaleDateString()}`,
        color: 'var(--danger-color)'
      });
    });
    alerts.lowStock.slice(0, 2).forEach(item => {
      dashboardAlerts.push({
        id: `low-${item.id}`,
        type: 'lowStock',
        title: `${item.name} is below minimum stock level.`,
        subtitle: `Current Stock: ${item.quantity} | Min: ${item.minimumStock}`,
        color: 'var(--warning-color)'
      });
    });
    alerts.forecastWarnings.slice(0, 2).forEach(item => {
      dashboardAlerts.push({
        id: `forecast-${item.inventoryId}`,
        type: 'warning',
        title: `${item.itemName} may experience a shortage next month.`,
        subtitle: `Recommended Order: ${item.recommendedOrder} units`,
        color: 'var(--warning-color)'
      });
    });
  }

  return (
    <div className="page-container">
      {/* Welcome Greetings */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary-teal)', letterSpacing: '-0.02em' }}>
          Hello , {user?.name || 'Doctor'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Here's your clinical inventory overview.</p>
      </div>

      {/* Grid of Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: 0 }}>
          <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: 'var(--soft-mint)', color: 'var(--primary-teal)' }}>
            <Package size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-teal)' }}>{stats?.totalItems || 0}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>Total Items</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: 0 }}>
          <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: '#FFF2CC', color: 'var(--warning-color)' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-teal)' }}>{stats?.lowStockItems || 0}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>Low Stock</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: 0 }}>
          <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: '#FFF2CC', color: 'var(--warning-color)' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-teal)' }}>{stats?.expiringSoonItems || 0}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>Expiring Soon</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: 0 }}>
          <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: '#FCE4D6', color: 'var(--danger-color)' }}>
            <XOctagon size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-teal)' }}>{stats?.expiredItems || 0}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>Expired Items</div>
          </div>
        </div>
      </div>

      {/* Grid of Charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }} className="dashboard-charts-grid">

        {/* Category Stats Chart */}
        <div className="card" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', height: '380px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary-teal)', marginBottom: '1.5rem' }}>
            Inventory by Category
          </h3>
          <div style={{ flex: 1, minHeight: 0 }}>
            {categoryChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [`${value} items (₹${props.payload.valuation})`, name]} />
                  <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                <Info size={32} style={{ marginBottom: '0.5rem' }} />
                <span style={{ fontSize: '0.875rem' }}>No inventory categories loaded.</span>
              </div>
            )}
          </div>
        </div>

        {/* Monthly Usage Summary Chart */}
        <div className="card" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', height: '380px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary-teal)', marginBottom: '1.5rem' }}>
            Monthly Usage Trend (Units Consumed)
          </h3>
          <div style={{ flex: 1, minHeight: 0 }}>
            {usageChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={usageChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                  <Tooltip cursor={{ fill: 'rgba(45, 106, 104, 0.05)' }} />
                  <Bar dataKey="quantity" fill="var(--secondary-teal)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                <TrendingDown size={32} style={{ marginBottom: '0.5rem' }} />
                <span style={{ fontSize: '0.875rem' }}>No usage data available yet.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Attention Required / Alerts Summary */}
      <div className="card">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '0.75rem'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary-teal)' }}>Attention Required</h3>
          <Link to="/alerts" style={{
            fontSize: '0.8125rem',
            color: 'var(--secondary-teal)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            View all alerts <ArrowRight size={14} />
          </Link>
        </div>

        {dashboardAlerts.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {dashboardAlerts.slice(0, 3).map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.875rem',
                  padding: '0.875rem 1rem',
                  borderRadius: 'var(--radius)',
                  backgroundColor: 'var(--warm-ivory)',
                  borderLeft: `3px solid ${item.color}`,
                }}
              >
                <div style={{ color: item.color, marginTop: '2px' }}>
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-color)' }}>{item.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>{item.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Everything looks good. No immediate alerts.</span>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 500px) {
          .dashboard-charts-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
