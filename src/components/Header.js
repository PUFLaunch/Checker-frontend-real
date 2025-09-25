import React from 'react';

function Header({ tokenPrice, priceChange24h, loading, refreshSecondsLeft }) {
  return (
    <header className="header">
      <h1>$PUFBoard</h1>
      <div className="token-info">
        <div className="token-price">
          <span className="price-label">Current Price:</span>
          <span
            className={`price-value ${loading ? 'loading' : ''}`}
            style={
              tokenPrice.includes('Error') 
                ? { color: '#ff9800' } 
                : priceChange24h !== null && !isNaN(priceChange24h)
                  ? { color: Number(priceChange24h) >= 0 ? '#059669' : '#dc2626' }
                  : { color: '#059669' }
            }
            title={tokenPrice.includes('Error') ? 'Price data temporarily unavailable' : ''}
          >
            {tokenPrice}
             {priceChange24h !== null && !isNaN(priceChange24h) && (
               <span className={`price-inline-change ${Number(priceChange24h) < 0 ? 'negative' : ''}`}>
                 {Number(priceChange24h) >= 0 ? ` (+${Number(priceChange24h).toFixed(2)}%)` : ` (${Number(priceChange24h).toFixed(2)}%)`}
               </span>
             )}
          </span>
        </div>
        {typeof refreshSecondsLeft === 'number' && (
          <div className="price-change">
            <span className="change-label">Auto refresh in:</span>
            <span className="change-value">
              {refreshSecondsLeft}s
            </span>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;

