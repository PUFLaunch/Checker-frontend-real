import React, { useState } from 'react';

function TabsCard({ title, data, loading, onRangeChange, currentRange }) {
  const [activeTab, setActiveTab] = useState(currentRange || '24h');
  
  const tabs = [
    { id: '24h', label: '24h' },
    { id: '7d', label: '7d' },
    { id: '30d', label: '30d' },
    { id: 'all', label: 'All' }
  ];

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (onRangeChange) {
      onRangeChange(tabId);
    }
  };

  const getCurrentData = () => {
    if (!data) return null;
    return data[activeTab] || data.all;
  };

  const currentData = getCurrentData();

  return (
    <div className="tabs-card">
      <div className="tabs-card-header">
        <h2>{title}</h2>
        <div className="tabs-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="tabs-card-content">
        {loading ? (
          <div className="tabs-skeleton">
            <div className="skeleton-main" />
            <div className="skeleton-sub" />
          </div>
        ) : currentData ? (
          <div className="tabs-data">
            <div className="primary-metric">
              <span className="primary-value">{formatNumber(currentData.primary)}</span>
              <span className="primary-label">{currentData.primaryLabel}</span>
            </div>
            {currentData.secondary !== undefined && (
              <div className="secondary-metric">
                <span className="secondary-value">{formatNumber(currentData.secondary)}</span>
                <span className="secondary-label">{currentData.secondaryLabel}</span>
              </div>
            )}
            {currentData.tertiary !== undefined && (
              <div className="tertiary-metric">
                <span className="tertiary-value">{formatNumber(currentData.tertiary)}</span>
                <span className="tertiary-label">{currentData.tertiaryLabel}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="no-data">No data available</div>
        )}
      </div>
    </div>
  );
}

export default TabsCard;
