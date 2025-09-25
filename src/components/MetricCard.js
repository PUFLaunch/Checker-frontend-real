import React from 'react';

function MetricRow({ label, value }) {
  return (
    <div className="metric-row">
      <span className="metric-label">{label}</span>
      <span className="metric-value">{value.toLocaleString()}</span>
    </div>
  );
}

function MetricCard({ title, rows, loading }) {
  return (
    <div className="metric-card">
      <div className="metric-card-header">
        <h2>{title}</h2>
      </div>
      <div className="metric-card-content">
        {loading ? (
          <div className="metric-skeleton">
            <div />
            <div />
            <div />
            <div />
          </div>
        ) : (
          rows.map((r) => (
            <MetricRow key={r.label} label={r.label} value={r.value} />
          ))
        )}
      </div>
    </div>
  );
}

export default MetricCard;


