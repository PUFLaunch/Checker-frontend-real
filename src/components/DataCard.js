import React from 'react';

function DataCard({
  title,
  value,
  unit,
  percentage,
  cardType,
  loading,
  lastSync,
  totalVolume = null
}) {
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  return (
    <div className={`data-card ${cardType}-card`}>
      <div className="card-header">
        <h2>{title}</h2>
        <div className={`status-indicator ${cardType}-indicator`}></div>
      </div>
      <div className="card-content">
        <div className="main-value">
          <span className={`value ${loading ? 'loading' : ''}`}>
            {loading ? '...' : formatNumber(value)}
          </span>
          <span className="unit">{unit}</span>
        </div>
        <div className="sub-info">
          <span className="percentage">{percentage}</span>
          <span className="label">of total supply</span>
        </div>
        {totalVolume !== null && (
          <div className="total-volume-info">
            <span className="label">Total Volume:</span>
            <span className={`total-volume-value ${loading ? 'loading' : ''}`}>
              {loading ? '...' : formatNumber(totalVolume)}
            </span>
            <span className="volume-unit">WLD</span>
          </div>
        )}
      </div>
      <div className="card-footer">
        <span className="last-updated">
          Last updated: {lastSync}
        </span>
      </div>
    </div>
  );
}

export default DataCard;

