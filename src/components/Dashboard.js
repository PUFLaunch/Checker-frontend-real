import React from 'react';
import DataCard from './DataCard';
import CombinedCard from './CombinedCard';
import TabsCard from './TabsCard';

function Dashboard({
  burnedAmount,
  treasuryAmount,
  royaltiesAmount,
  totalVolume,
  burnedPercentage,
  treasuryPercentage,
  royaltiesPercentage,
  loading,
  lastSync,
  userStats,
  tokenStats,
  uniqueCreators,
  range,
  rangeUsers,
  rangeTokens,
  rangeCreators,
  tokenCreatorAgg,
  onRangeChange
}) {
  // Prepare data for Users TabsCard
  const usersData = {
    all: {
      primary: (userStats?.total || 0) + 45000,
      primaryLabel: 'total users',
      secondary: undefined
    },
    '30d': {
      primary: userStats?.monthly || 0,
      primaryLabel: 'new users (30d)',
      secondary: (userStats?.total || 0) + 45000,
      secondaryLabel: 'total users'
    },
    '7d': {
      primary: userStats?.weekly || 0,
      primaryLabel: 'new users (7d)',
      secondary: (userStats?.total || 0) + 45000,
      secondaryLabel: 'total users'
    },
    '24h': {
      primary: userStats?.daily || 0,
      primaryLabel: 'new users (24h)',
      secondary: (userStats?.total || 0) + 45000,
      secondaryLabel: 'total users'
    }
  };

  // Prepare data for Tokens & Creators TabsCard
  const tokensData = {
    all: {
      primary: tokenStats?.total || 0,
      primaryLabel: 'total tokens',
      secondary: uniqueCreators || 0,
      secondaryLabel: 'unique creators'
    },
    '30d': {
      primary: range === '30d' ? rangeTokens : (tokenStats?.monthly || 0),
      primaryLabel: 'new tokens (30d)',
      secondary: range === '30d' ? rangeCreators : 0,
      secondaryLabel: 'unique creators'
    },
    '7d': {
      primary: range === '7d' ? rangeTokens : (tokenStats?.weekly || 0),
      primaryLabel: 'new tokens (7d)',
      secondary: range === '7d' ? rangeCreators : 0,
      secondaryLabel: 'unique creators'
    },
    '24h': {
      primary: range === '24h' ? rangeTokens : (tokenStats?.daily || 0),
      primaryLabel: 'new tokens (24h)',
      secondary: range === '24h' ? rangeCreators : 0,
      secondaryLabel: 'unique creators'
    }
  };

  // Prepare combined platform data
  const platformData = {
    all: {
      primary: tokenCreatorAgg?.all?.tokens || 0,
      primaryLabel: 'total tokens',
      secondary: tokenCreatorAgg?.all?.creators || 0,
      secondaryLabel: 'unique creators (all)'
    },
    '30d': {
      primary: tokenCreatorAgg?.['30d']?.tokens || 0,
      primaryLabel: 'new tokens',
      secondary: tokenCreatorAgg?.['30d']?.creators || 0,
      secondaryLabel: 'unique creators'
    },
    '7d': {
      primary: tokenCreatorAgg?.['7d']?.tokens || 0,
      primaryLabel: 'new tokens',
      secondary: tokenCreatorAgg?.['7d']?.creators || 0,
      secondaryLabel: 'unique creators'
    },
    '24h': {
      primary: tokenCreatorAgg?.['24h']?.tokens || 0,
      primaryLabel: 'new tokens',
      secondary: tokenCreatorAgg?.['24h']?.creators || 0,
      secondaryLabel: 'unique creators'
    }
  };

  return (
    <main className="dashboard">
      <TabsCard
        title="Platform Activity"
        data={{
          all: {
            primary: tokenCreatorAgg?.all?.tokens || 0,
            primaryLabel: 'Total Tokens',
            secondary: tokenCreatorAgg?.all?.creators || 0,
            secondaryLabel: 'Total Creators',
            tertiary: (userStats?.total || 0) + 45000,
            tertiaryLabel: 'Total Users'
          },
          '30d': {
            primary: tokenCreatorAgg?.['30d']?.tokens || 0,
            primaryLabel: 'Tokens Created',
            secondary: tokenCreatorAgg?.['30d']?.creators || 0,
            secondaryLabel: 'Unique Creators',
            tertiary: userStats?.monthly || 0,
            tertiaryLabel: 'New Users'
          },
          '7d': {
            primary: tokenCreatorAgg?.['7d']?.tokens || 0,
            primaryLabel: 'Tokens Created',
            secondary: tokenCreatorAgg?.['7d']?.creators || 0,
            secondaryLabel: 'Active Creators',
            tertiary: userStats?.weekly || 0,
            tertiaryLabel: 'New Users'
          },
          '24h': {
            primary: tokenCreatorAgg?.['24h']?.tokens || 0,
            primaryLabel: 'Tokens Created',
            secondary: tokenCreatorAgg?.['24h']?.creators || 0,
            secondaryLabel: 'Active Creators',
            tertiary: userStats?.daily || 0,
            tertiaryLabel: 'New Users'
          }
        }}
        loading={loading}
        currentRange={range}
        onRangeChange={onRangeChange}
      />

      <CombinedCard
        title="$PUF Tokenomics v0 Distribution"
        loading={loading}
        lastSync={lastSync}
        items={[
          {
            value: burnedAmount,
            unit: 'PUF',
            label: '🔥 Burned',
            percentage: burnedPercentage
          },
          {
            value: treasuryAmount,
            unit: 'PUF',
            label: '🏦 Sent to Treasury',
            percentage: treasuryPercentage
          },
          {
            value: royaltiesAmount,
            unit: 'WLD',
            label: '💰 Creator Royalties',
            percentage: royaltiesPercentage,
            totalVolume: totalVolume
          }
        ]}
      />
    </main>
  );
}

export default Dashboard;

