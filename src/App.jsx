import React, { useState } from 'react';
import { SearchForm } from './components/SearchForm';
import { ListingsGrid } from './components/ListingsGrid';
import { ListingsTable } from './components/ListingsTable';
import { LogViewer } from './components/LogViewer';
import { LayoutGrid, Table } from 'lucide-react';

export default function App() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });

  const filterInvalidListings = (listings) => {
    return listings.filter(listing => {
      // Filter out listings with invalid size
      if (!listing.size || listing.size === 0) {
        return false;
      }
      
      // Filter out listings with invalid price
      if (!listing.price || listing.price === 0 || listing.price === 1) {
        return false;
      }

      return true;
    });
  };

  const sortListings = (listingsToSort) => {
    if (!sortConfig.key) return listingsToSort;

    return [...listingsToSort].sort((a, b) => {
      const direction = sortConfig.direction === 'asc' ? 1 : -1;
      
      switch (sortConfig.key) {
        case 'price':
          return (a.price - b.price) * direction;
        case 'size':
          return (a.size - b.size) * direction;
        case 'pricePerMeter':
          return (a.pricePerMeter - b.pricePerMeter) * direction;
        case 'location':
          return a.location.localeCompare(b.location) * direction;
        case 'source':
          return a.source.localeCompare(b.source) * direction;
        default:
          return 0;
      }
    });
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const processStats = (rawListings, filteredListings) => {
    const totalRemoved = rawListings.length - filteredListings.length;
    
    return {
      total: filteredListings.length,
      sreality: filteredListings.filter(l => l.source === 'sreality').length,
      idnes: filteredListings.filter(l => l.source === 'idnes').length,
      remax: filteredListings.filter(l => l.source === 'remax').length,
      bezrealitky: filteredListings.filter(l => l.source === 'bezrealitky').length,
      removed: totalRemoved
    };
  };

  const searchListings = async (searchParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const { sources, ...otherParams } = searchParams;
      const queryParams = new URLSearchParams({
        ...otherParams,
        sources: sources.join(',')
      });

      const response = await fetch(`http://localhost:3000/api/listings?${queryParams}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to fetch listings');

      // Process and filter the listings
      const rawListings = data.listings;
      const validListings = filterInvalidListings(rawListings);
      
      // Calculate new stats after filtering
      const updatedStats = processStats(rawListings, validListings);
      
      setListings(validListings);
      setStats(updatedStats);

      // Log the filtering results
      const removedCount = rawListings.length - validListings.length;
      if (removedCount > 0) {
        console.log(`Filtered out ${removedCount} invalid listings`);
      }

    } catch (err) {
      setError(err.message);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  // Sort listings whenever sortConfig changes
  const sortedListings = sortListings(listings);

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <LogViewer loading={loading} />

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Properties for sale
          </h1>
          
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${viewMode === 'grid' 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              title="Grid View"
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md ${viewMode === 'table' 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              title="Table View"
            >
              <Table className="h-5 w-5" />
            </button>
          </div>
        </div>

        <SearchForm onSearch={searchListings} />

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {stats && !loading && (
          <div className="bg-white shadow rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold mb-2">Vysledky</h2>
            <div className="grid grid-cols-6 gap-4">
              <div>
                <p className="text-sm text-gray-500">Vse</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">SReality</p>
                <p className="text-2xl font-bold">{stats.sreality}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">iDNES</p>
                <p className="text-2xl font-bold">{stats.idnes}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Remax</p>
                <p className="text-2xl font-bold">{stats.remax}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Bezrealitky</p>
                <p className="text-2xl font-bold">{stats.bezrealitky}</p>
              </div>
              {stats.removed > 0 && (
                <div>
                  <p className="text-sm text-gray-500">Filtered Out</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.removed}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {!loading && (
          viewMode === 'grid' ? (
            <ListingsGrid listings={sortedListings} />
          ) : (
            <ListingsTable 
              listings={sortedListings}
              sortConfig={sortConfig}
              onSort={handleSort}
            />
          )
        )}
      </div>
    </div>
  );
}