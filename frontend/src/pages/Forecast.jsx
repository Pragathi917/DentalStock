import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getInventory } from '../services/inventoryService';
import { getForecast } from '../services/forecastService';
import { getErrorMessage } from '../utils/errorHandler';
import { 
  TrendingUp, 
  ArrowRight, 
  Loader2, 
  AlertTriangle, 
  CheckCircle,
  HelpCircle,
  BarChart2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

const Forecast = () => {
  const { showToast } = useAuth();

  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [months, setMonths] = useState(3);
  
  const [loadingItems, setLoadingItems] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState('');

  // Fetch dropdown list on mount
  useEffect(() => {
    const fetchDropdownItems = async () => {
      setLoadingItems(true);
      try {
        const data = await getInventory();
        setItems(data.data);
      } catch (err) {
        showToast('Unable to load inventory list for forecasting dropdown', 'danger');
      } finally {
        setLoadingItems(false);
      }
    };
    fetchDropdownItems();
  }, []);

  const handleGenerateForecast = async (e) => {
    e.preventDefault();
    if (!selectedItemId) {
      showToast('Please select an inventory item first.', 'danger');
      return;
    }

    setGenerating(true);
    setError('');
    try {
      const data = await getForecast(selectedItemId, months);
      setForecastData(data.data);
    } catch (err) {
      setError(getErrorMessage(err));
      setForecastData(null);
    } finally {
      setGenerating(false);
    }
  };

  const chartData = forecastData?.historicalUsage || [];

  return (
    <div className="page-container">
      {/* Title */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-teal)', letterSpacing: '-0.02em' }}>Demand Forecasting</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Use historical consumption patterns to predict future clinic inventory requirements.</p>
      </div>

      {/* Form Card */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <form onSubmit={handleGenerateForecast} style={{
          display: 'flex',
          alignItems: 'end',
          gap: '1rem',
          flexWrap: 'wrap'
        }} className="forecast-form-row">
          
          <div className="form-group" style={{ marginBottom: 0, flex: 2, minWidth: '220px' }}>
            <label className="form-label" htmlFor="forecastItem">Select Inventory Item</label>
            <select
              id="forecastItem"
              className="form-control"
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              disabled={loadingItems || generating}
            >
              <option value="">Choose item...</option>
              {items.map(item => (
                <option key={item._id} value={item._id}>{item.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '120px' }}>
            <label className="form-label" htmlFor="period">Forecast Period</label>
            <select
              id="period"
              className="form-control"
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              disabled={generating}
            >
              <option value={3}>3 Months</option>
              <option value={6}>6 Months</option>
              <option value={12}>12 Months</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ height: '42px', minWidth: '160px' }}
            disabled={generating || !selectedItemId}
          >
            {generating ? (
              <>
                <Loader2 size={16} className="skeleton" style={{ animation: 'loading 1.5s infinite' }} />
                Generating...
              </>
            ) : (
              <>
                <TrendingUp size={16} /> Generate Forecast
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results panel */}
      {error && (
        <div className="card text-center" style={{ padding: '3rem', textAlign: 'center' }}>
          <AlertTriangle size={48} color="var(--danger-color)" style={{ marginBottom: '1rem', margin: '0 auto' }} />
          <h3 style={{ color: 'var(--primary-teal)', marginBottom: '0.5rem' }}>Forecasting Error</h3>
          <p style={{ color: 'var(--text-muted)' }}>{error}</p>
        </div>
      )}

      {/* Forecast Output Data */}
      {forecastData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }} className="forecast-results-fade">
          
          {/* Output Cards Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem'
          }}>
            <div className="card" style={{ marginBottom: 0 }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>CURRENT STOCK</span>
              <div style={{ fontSize: '1.625rem', fontWeight: 700, color: 'var(--primary-teal)', marginTop: '0.25rem' }}>
                {forecastData.currentStock}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Units in clinic</span>
            </div>

            <div className="card" style={{ marginBottom: 0 }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>AVG MONTHLY DEMAND</span>
              <div style={{ fontSize: '1.625rem', fontWeight: 700, color: 'var(--primary-teal)', marginTop: '0.25rem' }}>
                {forecastData.averageMonthlyUsage}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Units/month average</span>
            </div>

            <div className="card" style={{ marginBottom: 0 }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>RECOMMENDED REORDER</span>
              <div style={{ 
                fontSize: '1.625rem', 
                fontWeight: 700, 
                color: forecastData.recommendedOrder > 0 ? 'var(--warning-color)' : 'var(--success-color)',
                marginTop: '0.25rem' 
              }}>
                {forecastData.recommendedOrder}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Suggested replenishment</span>
            </div>

            <div className="card" style={{ marginBottom: 0 }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>STOCK COVER STATE</span>
              <div style={{ marginTop: '0.5rem' }}>
                {forecastData.status === 'POTENTIAL_SHORTAGE' ? (
                  <span className="badge badge-low-stock" style={{ padding: '0.5rem 0.75rem', fontSize: '0.8125rem' }}>
                    <AlertTriangle size={14} style={{ marginRight: '0.375rem' }} /> Potential Shortage
                  </span>
                ) : forecastData.status === 'NO_DATA' ? (
                  <span className="badge" style={{ padding: '0.5rem 0.75rem', fontSize: '0.8125rem', backgroundColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                    No Data Available
                  </span>
                ) : (
                  <span className="badge badge-good" style={{ padding: '0.5rem 0.75rem', fontSize: '0.8125rem' }}>
                    <CheckCircle size={14} style={{ marginRight: '0.375rem' }} /> Sufficient Stock
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Historical Trend Line Graph */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '350px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--primary-teal)', marginBottom: '1.25rem' }}>
              Historical Usage Log Trend (Units Consumed)
            </h3>
            
            <div style={{ flex: 1, minHeight: 0 }}>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                    <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                    <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="quantity" 
                      stroke="var(--secondary-teal)" 
                      strokeWidth={2}
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                  <BarChart2 size={36} style={{ marginBottom: '0.5rem' }} />
                  <span style={{ fontSize: '0.875rem' }}>Not enough historical usage data to generate a forecast.</span>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Initial Empty state prompt */}
      {!forecastData && !error && (
        <div className="card" style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--text-muted)', marginTop: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <HelpCircle size={40} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ color: 'var(--primary-teal)', marginBottom: '0.5rem' }}>Anticipate Inventory Needs</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '400px' }}>
            Select a dental supply item above and click "Generate Forecast" to inspect average monthly demands, reorder calculations, and chronological consumption trends.
          </p>
        </div>
      )}

      <style>{`
        @media (max-width: 500px) {
          .forecast-form-row {
            flex-direction: column;
            align-items: stretch !important;
          }
        }
        .forecast-results-fade {
          animation: resultsFadeIn 0.3s ease forwards;
        }
        @keyframes resultsFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Forecast;
