import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';

const COLORS = ['#d4af37', '#3b82f6', '#22c55e', '#ef4444', '#8b5cf6', '#f59e0b'];

const AnalyticsView = ({ api, isRTL, chartData, categoryData, statusData }) => {
  return (
    <section className="analytics-view" aria-label={isRTL ? 'אנליטיקס ודוחות' : 'Analytics and Reports'}>
      <div className="charts-grid">
        <div className="chart-card full-width">
          <h3 id="leads-over-time-title">{isRTL ? 'לידים לאורך זמן' : 'Leads Over Time'}</h3>
          <div className="chart-container" role="img" aria-labelledby="leads-over-time-title">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData} aria-label={isRTL ? 'גרף לידים לאורך זמן' : 'Leads over time chart'}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3f54" />
                <XAxis dataKey="month" stroke="#b8c5d1" />
                <YAxis stroke="#b8c5d1" />
                <Tooltip
                  contentStyle={{
                    background: '#1e2d3d',
                    border: '1px solid #2a3f54',
                    borderRadius: '8px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#d4af37"
                  fill="rgba(212, 175, 55, 0.2)"
                  name={isRTL ? 'לידים' : 'Leads'}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3 id="leads-by-category-title">{isRTL ? 'לידים לפי קטגוריה' : 'Leads by Category'}</h3>
          <div className="chart-container" role="img" aria-labelledby="leads-by-category-title">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3 id="leads-by-status-title">{isRTL ? 'לידים לפי סטטוס' : 'Leads by Status'}</h3>
          <div className="chart-container" role="img" aria-labelledby="leads-by-status-title">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3f54" />
                <XAxis dataKey="status" stroke="#b8c5d1" />
                <YAxis stroke="#b8c5d1" />
                <Tooltip
                  contentStyle={{
                    background: '#1e2d3d',
                    border: '1px solid #2a3f54',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="count" fill="#d4af37" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsView;
