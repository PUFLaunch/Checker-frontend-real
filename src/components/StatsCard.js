import React from 'react';

function StatsCard({ title, currentData, range, loading }) {
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  return (
    <div className="stats-card">
      <div className="stats-card-header">
        <h2>{title}</h2>
        <span className="range-badge">{range}</span>
      </div>
      <div className="stats-card-content">
        {loading ? (
          <div className="stats-skeleton">
            <div className="skeleton-main" />
            <div className="skeleton-sub" />
          </div>
        ) : (
          <div className="stats-data">
            <div className="primary-stat">
              <span className="primary-value">{formatNumber(currentData.primary)}</span>
              <span className="primary-label">{currentData.primaryLabel}</span>
            </div>
            {currentData.secondary && (
              <div className="secondary-stat">
                <span className="secondary-value">{formatNumber(currentData.secondary)}</span>
                <span className="secondary-label">{currentData.secondaryLabel}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default StatsCard;
