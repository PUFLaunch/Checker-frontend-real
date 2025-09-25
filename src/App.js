import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ethers } from 'ethers';
import { supabase } from './supabase';
import './App.css';
import Header from './components/Header';
import Dashboard from './components/Dashboard';

function App() {
  // State management
  const [tokenPrice, setTokenPrice] = useState('Loading...');
  const [burnedAmount, setBurnedAmount] = useState(0);
  const [treasuryAmount, setTreasuryAmount] = useState(0);
  const [royaltiesAmount, setRoyaltiesAmount] = useState(0);
  const [totalVolume, setTotalVolume] = useState(0);
  const [priceChange24h, setPriceChange24h] = useState(null);
  const [lastSync, setLastSync] = useState('Never');
  const [totalSupply, setTotalSupply] = useState(null);
  const [loading, setLoading] = useState(true);
  const [priceLoading, setPriceLoading] = useState(true);
  const [refreshSecondsLeft, setRefreshSecondsLeft] = useState(30);

  // User and token stats
  const [userStats, setUserStats] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
    total: 0
  });
  const [tokenStats, setTokenStats] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
    total: 0
  });
  const [uniqueCreators, setUniqueCreators] = useState(0);
  const [range, setRange] = useState('24h'); // all | 24h | 7d | 30d
  const [rangeUsers, setRangeUsers] = useState(0);
  const [rangeTokens, setRangeTokens] = useState(0);
  const [rangeCreators, setRangeCreators] = useState(0);
  const [tokenCreatorAgg, setTokenCreatorAgg] = useState({
    '24h': { tokens: 0, creators: 0 },
    '7d': { tokens: 0, creators: 0 },
    '30d': { tokens: 0, creators: 0 },
    all: { tokens: 0, creators: 0 }
  });

  // Configuration
  const contractAddress = '0x1aE3498f1B417fe31BE544B04B711F27Ba437bd3';
  const worldchainRPC = 'https://ancient-lingering-theorem.worldchain-mainnet.quiknode.pro/e675ad9beb96bbaacc8d48edfa4738642824c58e/';

  // ERC20 ABI for totalSupply
  const erc20ABI = useMemo(() => [
    "function totalSupply() view returns (uint256)"
  ], []);

  // Mock data for fallback
  const mockData = useMemo(() => ({
    tokenPrice: 0.0234,
    burnedAmount: 1250000,
    treasuryAmount: 890000,
    royaltiesAmount: 340000,
    lastUpdate: new Date()
  }), []);

  // Utility functions
  const formatWeiToToken = useCallback((weiValue) => {
    try {
      if (!weiValue || weiValue === '0') return 0;
      const etherValue = ethers.formatEther(weiValue);
      return parseFloat(etherValue);
    } catch (error) {
      console.error('Wei format error:', error, weiValue);
      return 0;
    }
  }, []);

  const getSinceHours = useCallback((hours) => {
    return new Date(Date.now() - hours * 60 * 60 * 1000);
  }, []);

  // Exact aggregates for tokens and unique creators as per Supabase queries
  const fetchTokenCreatorAggregates = useCallback(async () => {
    try {
      console.log('📊 Aggregates: tokens & unique creators (24h/7d/30d/All)');

      const fetchWindow = async (since) => {
        // tokens count (fast, server-side)
        let tq = supabase
          .from('tokens')
          .select('*', { count: 'exact', head: true });
        if (since) tq = tq.gte('created_at', since.toISOString());
        const { count: tokensCount, error: tokensErr } = await tq;
        if (tokensErr) throw tokensErr;

        // creators distinct count (client-side distinct with pagination)
        const pageSize = 1000;
        let from = 0;
        const uniqueCreatorsSet = new Set();
        // Loop pages until fewer than pageSize rows returned
        while (true) {
          let cq = supabase
            .from('tokens')
            .select('creator_id')
            .not('creator_id', 'is', null);
          if (since) cq = cq.gte('created_at', since.toISOString());
          const { data, error } = await cq.range(from, from + pageSize - 1);
          if (error) throw error;
          if (!data || data.length === 0) break;
          for (const row of data) {
            if (row.creator_id) uniqueCreatorsSet.add(row.creator_id);
          }
          if (data.length < pageSize) break;
          from += pageSize;
        }

        return { tokens: tokensCount || 0, creators: uniqueCreatorsSet.size };
      };

      const [agg24h, agg7d, agg30d, aggAll] = await Promise.all([
        fetchWindow(getSinceHours(24)),
        fetchWindow(getSinceHours(168)),
        fetchWindow(getSinceHours(720)),
        fetchWindow(null)
      ]);

      setTokenCreatorAgg({ '24h': agg24h, '7d': agg7d, '30d': agg30d, all: aggAll });
      console.log('✅ Aggregates loaded:', { '24h': agg24h, '7d': agg7d, '30d': agg30d, all: aggAll });
    } catch (e) {
      console.error('❌ Aggregates error:', e);
      setTokenCreatorAgg({ '24h': { tokens: 0, creators: 0 }, '7d': { tokens: 0, creators: 0 }, '30d': { tokens: 0, creators: 0 }, all: { tokens: 0, creators: 0 } });
    }
  }, [getSinceHours]);

  const formatNumber = useCallback((num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  }, []);

  const calculatePercentage = useCallback((value, total) => {
    return (value / total) * 100;
  }, []);

  const calculateTotalVolume = useCallback((creatorRoyalty) => {
    if (!creatorRoyalty || creatorRoyalty <= 0) return 0;
    const volumeMultiplier = 0.02 * 0.35; // 2%'nin 35'i = 0.007
    return creatorRoyalty / volumeMultiplier;
  }, []);

  // API functions
  const fetchTotalSupply = useCallback(async () => {
    try {
      console.log('🔢 Total Supply fetching from contract...');

      const provider = new ethers.JsonRpcProvider(worldchainRPC);
      const contract = new ethers.Contract(contractAddress, erc20ABI, provider);

      const totalSupplyWei = await contract.totalSupply();
      const totalSupplyTokens = formatWeiToToken(totalSupplyWei.toString());

      setTotalSupply(totalSupplyTokens);
      console.log(`✅ Total Supply: ${formatNumber(totalSupplyTokens)} PUF`);

    } catch (error) {
      console.error('❌ Total Supply fetch error:', error);
      setTotalSupply(1000000000); // 1B tokens fallback
      console.log('🔄 Fallback: Total Supply = 1B PUF (approximate)');
    }
  }, [contractAddress, worldchainRPC, erc20ABI, formatWeiToToken, formatNumber]);

  const fetchTokenPrice = useCallback(async () => {
    try {
      console.log('💰 Token price fetching from DexScreener...');

      const pairAddress = '0x1D3bdD97F3772EAbe2c039476805376e788374d8';
      const apiUrl = `https://api.dexscreener.com/latest/dex/pairs/worldchain/${pairAddress}`;

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`DexScreener API error: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.pairs && data.pairs.length > 0) {
        const pair = data.pairs[0];
        const price = parseFloat(pair.priceUsd);

        if (price && !isNaN(price)) {
          console.log(`✅ $PUF price: $${price}`);

          const priceChange24h = pair.priceChange?.h24;
          setTokenPrice(`$${price.toFixed(6)}`);
          setPriceChange24h(priceChange24h);

          // debug details (silenced)
        } else {
          throw new Error('Invalid price data');
        }
      } else {
        throw new Error('Pair data not found');
      }

    } catch (error) {
      console.error('❌ Token price error:', error);
      console.log('🔄 Fallback: Using mock data...');
      const fallbackPrice = mockData.tokenPrice;
      setTokenPrice(`$${fallbackPrice.toFixed(6)}`);
      setPriceChange24h(null);

      // Error styling would be handled in Header component
    }
  }, [mockData]);

  const fetchTokenomicsData = useCallback(async () => {
    try {
      console.log('📈 Tokenomics data fetching...');

      const apiUrl = 'https://puf-tracker-indexer-production.up.railway.app/puf';
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const rawData = await response.json();
      // console.debug('🔗 Raw API data:', rawData);

      // Format Wei values using Ethers.js (18 decimals)
      const data = {
        burnedAmount: formatWeiToToken(rawData.burnAmount),
        treasuryAmount: formatWeiToToken(rawData.treasuryAmount),
        royaltiesAmount: formatWeiToToken(rawData.creatorFeeAmount)
      };

      // console.debug('✅ Formatted data:', data);

      const calculatedTotalVolume = calculateTotalVolume(data.royaltiesAmount);
      // console.debug(`💹 Calculated Total Volume: ${formatNumber(calculatedTotalVolume)} WLD`);

      setBurnedAmount(data.burnedAmount);
      setTreasuryAmount(data.treasuryAmount);
      setRoyaltiesAmount(data.royaltiesAmount);
      setTotalVolume(calculatedTotalVolume);

    } catch (error) {
      console.error('❌ Tokenomics data error:', error);
      console.log('🔄 Fallback: Using mock data...');

      const fallbackData = {
        burnedAmount: mockData.burnedAmount,
        treasuryAmount: mockData.treasuryAmount,
        royaltiesAmount: mockData.royaltiesAmount
      };

      const fallbackTotalVolume = calculateTotalVolume(fallbackData.royaltiesAmount);

      setBurnedAmount(fallbackData.burnedAmount);
      setTreasuryAmount(fallbackData.treasuryAmount);
      setRoyaltiesAmount(fallbackData.royaltiesAmount);
      setTotalVolume(fallbackTotalVolume);
    }
  }, [formatWeiToToken, calculateTotalVolume, mockData]);

  const fetchUserStats = useCallback(async () => {
    try {
      console.log('👥 User stats fetching from Supabase...');

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Get total users
      const { count: totalUsers, error: totalError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      if (totalError) throw totalError;

      // Get daily users
      const { count: dailyUsers, error: dailyError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

      if (dailyError) throw dailyError;

      // Get weekly users
      const { count: weeklyUsers, error: weeklyError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString());

      if (weeklyError) throw weeklyError;

      // Get monthly users
      const { count: monthlyUsers, error: monthlyError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthAgo.toISOString());

      if (monthlyError) throw monthlyError;

      const stats = {
        daily: dailyUsers || 0,
        weekly: weeklyUsers || 0,
        monthly: monthlyUsers || 0,
        total: totalUsers || 0
      };

      setUserStats(stats);
      console.log(`✅ User stats: ${JSON.stringify(stats)}`);

    } catch (error) {
      console.error('❌ User stats error:', error);
      setUserStats({ daily: 0, weekly: 0, monthly: 0, total: 0 });
    }
  }, []);

  const fetchTokenStats = useCallback(async () => {
    try {
      console.log('🪙 Token stats fetching from Supabase...');

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Get total tokens
      const { count: totalTokens, error: totalError } = await supabase
        .from('tokens')
        .select('*', { count: 'exact', head: true });

      if (totalError) throw totalError;

      // Get daily tokens
      const { count: dailyTokens, error: dailyError } = await supabase
        .from('tokens')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

      if (dailyError) throw dailyError;

      // Get weekly tokens
      const { count: weeklyTokens, error: weeklyError } = await supabase
        .from('tokens')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString());

      if (weeklyError) throw weeklyError;

      // Get monthly tokens
      const { count: monthlyTokens, error: monthlyError } = await supabase
        .from('tokens')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthAgo.toISOString());

      if (monthlyError) throw monthlyError;

      const stats = {
        daily: dailyTokens || 0,
        weekly: weeklyTokens || 0,
        monthly: monthlyTokens || 0,
        total: totalTokens || 0
      };

      setTokenStats(stats);
      console.log(`✅ Token stats: ${JSON.stringify(stats)}`);

    } catch (error) {
      console.error('❌ Token stats error:', error);
      setTokenStats({ daily: 0, weekly: 0, monthly: 0, total: 0 });
    }
  }, []);

  const getRangeStart = useCallback((r) => {
    const now = new Date();
    if (r === '24h') {
      return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }
    if (r === '7d') {
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
    if (r === '30d') {
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    return null; // all
  }, []);

  // Range-based queries
  const fetchRangeUsers = useCallback(async (r) => {
    const since = getRangeStart(r);
    if (!since) {
      // all
      const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      setRangeUsers(count || 0);
      return;
    }
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', since.toISOString());
    if (error) throw error;
    setRangeUsers(count || 0);
  }, [getRangeStart]);

  const fetchRangeTokensAndCreators = useCallback(async (r) => {
    const since = getRangeStart(r);
    if (!since) {
      const [{ count: tokensAll, error: tokensErr }, { data: creatorsData, error: creatorsErr }] = await Promise.all([
        supabase.from('tokens').select('*', { count: 'exact', head: true }),
        supabase.from('tokens').select('creator_id').not('creator_id', 'is', null)
      ]);
      if (tokensErr) throw tokensErr;
      if (creatorsErr) throw creatorsErr;
      const uniqueCreatorIds = [...new Set((creatorsData || []).map(t => t.creator_id))];
      setRangeTokens(tokensAll || 0);
      setRangeCreators(uniqueCreatorIds.length);
      return;
    }
    const [{ count: tokensCount, error: tokensErr }, { data: creatorsData, error: creatorsErr }] = await Promise.all([
      supabase.from('tokens').select('*', { count: 'exact', head: true }).gte('created_at', since.toISOString()),
      supabase.from('tokens').select('creator_id, created_at').gte('created_at', since.toISOString()).not('creator_id', 'is', null)
    ]);
    if (tokensErr) throw tokensErr;
    if (creatorsErr) throw creatorsErr;
    const uniqueCreatorIds = [...new Set((creatorsData || []).map(t => t.creator_id))];
    setRangeTokens(tokensCount || 0);
    setRangeCreators(uniqueCreatorIds.length);
  }, [getRangeStart]);

  useEffect(() => {
    // fetch range-dependent stats when range changes
    (async () => {
      try {
        await Promise.all([
          fetchRangeUsers(range),
          fetchRangeTokensAndCreators(range)
        ]);
      } catch (e) {
        console.error('Range stats error', e);
        setRangeUsers(0);
        setRangeTokens(0);
        setRangeCreators(0);
      }
    })();
  }, [range, fetchRangeUsers, fetchRangeTokensAndCreators]);

  const fetchUniqueCreators = useCallback(async () => {
    try {
      console.log('🎨 Unique creators fetching from Supabase...');

      const { data, error } = await supabase
        .from('tokens')
        .select('creator_id')
        .not('creator_id', 'is', null);

      if (error) throw error;

      // Get unique creator IDs
      const uniqueCreatorIds = [...new Set(data.map(token => token.creator_id))];
      const creatorCount = uniqueCreatorIds.length;

      setUniqueCreators(creatorCount);
      console.log(`✅ Unique creators: ${creatorCount}`);

    } catch (error) {
      console.error('❌ Unique creators error:', error);
      setUniqueCreators(0);
    }
  }, []);

  const loadInitialData = useCallback(async () => {
    console.log('📊 Loading initial data...');
    setLoading(true);

    // fire price fetch independently so it can render ASAP
    setPriceLoading(true);
    fetchTokenPrice().finally(() => setPriceLoading(false));

    try {
      await Promise.all([
        fetchTotalSupply(),
        fetchTokenomicsData(),
        fetchUserStats(),
        fetchTokenStats(),
        fetchUniqueCreators(),
        fetchTokenCreatorAggregates()
      ]);
      setLastSync(new Date().toLocaleTimeString('tr-TR'));
    } catch (error) {
      console.error('❌ Data loading error:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchTotalSupply, fetchTokenPrice, fetchTokenomicsData, fetchUserStats, fetchTokenStats, fetchUniqueCreators, fetchTokenCreatorAggregates]);

  // Initial load
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Auto refresh every 30s with countdown
  useEffect(() => {
    const tickId = setInterval(() => {
      setRefreshSecondsLeft((s) => {
        if (s <= 1) {
          // time to refresh
          loadInitialData();
          return 30;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(tickId);
  }, [loadInitialData]);

  // Calculate percentages for display
  const getBurnedPercentage = () => {
    if (!totalSupply || totalSupply === 0) return '0%';
    return `${calculatePercentage(burnedAmount, totalSupply).toFixed(4)}%`;
  };

  const getTreasuryPercentage = () => {
    if (!totalSupply || totalSupply === 0) return '0%';
    return `${calculatePercentage(treasuryAmount, totalSupply).toFixed(4)}%`;
  };

  const getRoyaltiesPercentage = () => {
    if (!totalSupply || totalSupply === 0) return '0%';
    return `${calculatePercentage(royaltiesAmount, totalSupply).toFixed(4)}%`;
  };

  return (
    <div className="App">
      <div className="container">
        <Header
          tokenPrice={tokenPrice}
          priceChange24h={priceChange24h}
          loading={priceLoading}
          refreshSecondsLeft={refreshSecondsLeft}
        />
        <Dashboard
          burnedAmount={burnedAmount}
          treasuryAmount={treasuryAmount}
          royaltiesAmount={royaltiesAmount}
          totalVolume={totalVolume}
          burnedPercentage={getBurnedPercentage()}
          treasuryPercentage={getTreasuryPercentage()}
          royaltiesPercentage={getRoyaltiesPercentage()}
          loading={loading}
          lastSync={lastSync}
          userStats={userStats}
          tokenStats={tokenStats}
          uniqueCreators={uniqueCreators}
          range={range}
          rangeUsers={rangeUsers}
          rangeTokens={rangeTokens}
          rangeCreators={rangeCreators}
          tokenCreatorAgg={tokenCreatorAgg}
          onRangeChange={setRange}
        />
        <footer className="footer">
          <p className="signature">$PUFBoard by <span className="creator">lambzerfaust.2702</span></p>
        </footer>
      </div>
    </div>
  );
}

export default App;
