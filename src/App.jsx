import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = '0x1aE3498f1B417fe31BE544B04B711F27Ba437bd3';
const WORLDCHAIN_RPC = 'https://worldchain-mainnet.g.alchemy.com/public';
const ERC20_ABI = [
  'function totalSupply() view returns (uint256)',
];
const REFRESH_INTERVAL_MS = 30000;

function formatNumberCompact(numberValue) {
  if (numberValue === undefined || numberValue === null || Number.isNaN(numberValue)) {
    return '-';
  }
  if (numberValue >= 1_000_000) {
    return (numberValue / 1_000_000).toFixed(2) + 'M';
  }
  if (numberValue >= 1_000) {
    return (numberValue / 1_000).toFixed(1) + 'K';
  }
  try {
    return Number(numberValue).toLocaleString('tr-TR');
  } catch {
    return String(numberValue);
  }
}

function formatWeiToTokenDecimal(weiLike) {
  try {
    if (!weiLike || weiLike === '0') return 0;
    return parseFloat(ethers.formatEther(weiLike));
  } catch {
    return 0;
  }
}

export default function App() {
  const [tokenPriceUsd, setTokenPriceUsd] = useState(null);
  const [priceChange24h, setPriceChange24h] = useState(null);
  const [totalSupply, setTotalSupply] = useState(null);

  const [burnedAmount, setBurnedAmount] = useState(null);
  const [treasuryAmount, setTreasuryAmount] = useState(null);
  const [royaltiesAmount, setRoyaltiesAmount] = useState(null);
  const [totalVolume, setTotalVolume] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [hadPriceError, setHadPriceError] = useState(false);
  const [lastSync, setLastSync] = useState('-');

  const intervalRef = useRef(null);

  const mockData = useMemo(() => ({
    tokenPrice: 0.0234,
    burnedAmount: 1250000,
    treasuryAmount: 890000,
    royaltiesAmount: 340000,
  }), []);

  const calculatePercentage = useCallback((value, total) => {
    if (!value || !total) return 0;
    return (value / total) * 100;
  }, []);

  const calculateTotalVolume = useCallback((creatorRoyalty) => {
    if (!creatorRoyalty || creatorRoyalty <= 0) return 0;
    const volumeMultiplier = 0.02 * 0.35; // 0.007
    return creatorRoyalty / volumeMultiplier;
  }, []);

  const updateTimestamps = useCallback(() => {
    const nowText = new Date().toLocaleTimeString('tr-TR');
    setLastSync(nowText);
  }, []);

  const fetchTotalSupply = useCallback(async () => {
    try {
      const provider = new ethers.JsonRpcProvider(WORLDCHAIN_RPC);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ERC20_ABI, provider);
      const totalSupplyWei = await contract.totalSupply();
      const totalSupplyTokens = formatWeiToTokenDecimal(totalSupplyWei);
      setTotalSupply(totalSupplyTokens);
    } catch (error) {
      // Fallback yaklaşık değer
      setTotalSupply(1_000_000_000);
    }
  }, []);

  const fetchTokenPrice = useCallback(async () => {
    try {
      const pairAddress = '0x1D3bdD97F3772EAbe2c039476805376e788374d8';
      const apiUrl = `https://api.dexscreener.com/latest/dex/pairs/worldchain/${pairAddress}`;
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`DexScreener API error: ${response.status}`);
      const data = await response.json();
      if (!data || !data.pairs || data.pairs.length === 0) throw new Error('Pair verisi yok');
      const pair = data.pairs[0];
      const price = parseFloat(pair.priceUsd);
      const change24h = pair.priceChange?.h24;
      if (!price || Number.isNaN(price)) throw new Error('Geçersiz fiyat');
      setTokenPriceUsd(price);
      if (change24h !== undefined && change24h !== null && !Number.isNaN(parseFloat(change24h))) {
        setPriceChange24h(parseFloat(change24h));
      } else {
        setPriceChange24h(null);
      }
      setHadPriceError(false);
    } catch (error) {
      setTokenPriceUsd(mockData.tokenPrice);
      setPriceChange24h(null);
      setHadPriceError(true);
    }
  }, [mockData.tokenPrice]);

  const fetchTokenomics = useCallback(async () => {
    try {
      const apiUrl = 'https://puf-tracker-indexer-production.up.railway.app/puf';
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`API hatası: ${response.status}`);
      const raw = await response.json();
      const burned = formatWeiToTokenDecimal(raw.burnAmount);
      const treasury = formatWeiToTokenDecimal(raw.treasuryAmount);
      const royalties = formatWeiToTokenDecimal(raw.creatorFeeAmount);
      setBurnedAmount(burned);
      setTreasuryAmount(treasury);
      setRoyaltiesAmount(royalties);
      setTotalVolume(calculateTotalVolume(royalties));
    } catch (error) {
      setBurnedAmount(mockData.burnedAmount);
      setTreasuryAmount(mockData.treasuryAmount);
      setRoyaltiesAmount(mockData.royaltiesAmount);
      setTotalVolume(calculateTotalVolume(mockData.royaltiesAmount));
    }
  }, [calculateTotalVolume, mockData.burnedAmount, mockData.royaltiesAmount, mockData.treasuryAmount]);

  const refreshAll = useCallback(async () => {
    setIsLoading(true);
    await fetchTotalSupply();
    await fetchTokenPrice();
    await fetchTokenomics();
    updateTimestamps();
    setIsLoading(false);
  }, [fetchTokenPrice, fetchTokenomics, fetchTotalSupply, updateTimestamps]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      refreshAll();
    }, REFRESH_INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, [refreshAll]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        refreshAll();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [refreshAll]);

  const burnedPct = useMemo(() => calculatePercentage(burnedAmount || 0, totalSupply || 0), [burnedAmount, totalSupply, calculatePercentage]);
  const treasuryPct = useMemo(() => calculatePercentage(treasuryAmount || 0, totalSupply || 0), [treasuryAmount, totalSupply, calculatePercentage]);
  const royaltiesPct = useMemo(() => calculatePercentage(royaltiesAmount || 0, totalSupply || 0), [royaltiesAmount, totalSupply, calculatePercentage]);

  const priceValueStyle = useMemo(() => ({ color: hadPriceError ? '#ff9800' : '#4CAF50' }), [hadPriceError]);

  return (
    <div className="container">
      <header className="header">
        <h1>$PUFBoard</h1>
        <div className="token-info">
          <div className="token-price">
            <span className="price-label">Current Price:</span>
            <span id="tokenPrice" className={`price-value ${isLoading && tokenPriceUsd === null ? 'loading' : ''}`} style={priceValueStyle} title={hadPriceError ? 'Fiyat verisi geçici olarak erişilemez' : ''}>
              {tokenPriceUsd === null ? 'Loading...' : `$${tokenPriceUsd.toFixed(6)}`}
            </span>
          </div>
          {priceChange24h !== null && (
            <div className="price-change">
              <span className="change-label">24h:</span>
              <span className={`change-value ${priceChange24h >= 0 ? 'positive' : 'negative'}`}>
                {priceChange24h >= 0 ? '+' : ''}{priceChange24h.toFixed(2)}%
              </span>
            </div>
          )}
        </div>
      </header>

      <main className="dashboard">
        <div className="data-card burned-card">
          <div className="card-header">
            <h2>Burned Amount</h2>
            <div className="status-indicator burned-indicator"></div>
          </div>
          <div className="card-content">
            <div id="burnedAmount" className="main-value">
              <span className={`value ${isLoading && burnedAmount === null ? 'loading' : ''}`}>{formatNumberCompact(burnedAmount ?? 0)}</span>
              <span className="unit">PUF</span>
            </div>
            <div className="sub-info">
              <span className="percentage">{totalSupply ? `${burnedPct.toFixed(4)}%` : '-%'}</span>
              <span className="label">of total supply</span>
            </div>
          </div>
          <div className="card-footer">
            <span className="last-updated">Last updated: {lastSync}</span>
          </div>
        </div>

        <div className="data-card treasury-card">
          <div className="card-header">
            <h2>Sent to Treasury</h2>
            <div className="status-indicator treasury-indicator"></div>
          </div>
          <div className="card-content">
            <div id="treasuryAmount" className="main-value">
              <span className={`value ${isLoading && treasuryAmount === null ? 'loading' : ''}`}>{formatNumberCompact(treasuryAmount ?? 0)}</span>
              <span className="unit">PUF</span>
            </div>
          </div>
          <div className="card-footer">
            <span className="last-updated">Last updated: {lastSync}</span>
          </div>
        </div>

        <div className="data-card royalties-card">
          <div className="card-header">
            <h2>Creator Royalties Distributed</h2>
            <div className="status-indicator royalties-indicator"></div>
          </div>
          <div className="card-content">
            <div id="royaltiesAmount" className="main-value">
              <span className={`value ${isLoading && royaltiesAmount === null ? 'loading' : ''}`}>{formatNumberCompact(royaltiesAmount ?? 0)}</span>
              <span className="unit">WLD</span>
            </div>
            <div className="sub-info total-volume-info">
              <span className="label">Total Volume Since Update:</span>
              <span id="totalVolumeValue" className={`total-volume-value ${isLoading && totalVolume === null ? 'loading' : ''}`}>{formatNumberCompact(totalVolume ?? 0)}</span>
              <span className="volume-unit">WLD</span>
            </div>
          </div>
          <div className="card-footer">
            <span className="last-updated">Last updated: {lastSync}</span>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>Real-time $PUF data • Last sync: <span id="lastSync">{lastSync}</span></p>
        <p className="signature">$PUFBoard by <span className="creator">lambzerfaust.2702</span></p>
      </footer>
    </div>
  );
}


