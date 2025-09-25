import React from 'react';

function CombinedCard({ title, items, loading, lastSync }) {
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  return (
    <div className="combined-card">
      <div className="combined-card-header">
        <h2>{title}</h2>
      </div>
      <div className="combined-card-content">
        {loading ? (
          <div className="combined-skeleton">
            {items.map((_, index) => (
              <div key={index} className="skeleton-item" />
            ))}
          </div>
        ) : (
          <div className="combined-items">
            {items.map((item, index) => (
              <div key={index} className="combined-item">
                <div className="item-main">
                  <span className="item-value">{formatNumber(item.value)}</span>
                  <span className="item-unit">{item.unit}</span>
                </div>
                <div className="item-info">
                  <span className="item-label">{item.label}</span>
                  {item.percentage && (
                    <span className="item-percentage">{item.percentage}</span>
                  )}
                </div>
                {item.totalVolume && (
                  <div className="item-volume">
                    <span className="volume-label">Total Volume After 21.09.2025:</span>
                    <span className="volume-value">{formatNumber(item.totalVolume)}</span>
                    <span className="volume-unit">WLD</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="combined-card-footer">
        <span className="last-updated">Last updated: {lastSync}</span>
      </div>
    </div>
  );
}

export default CombinedCard;
