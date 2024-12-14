import React, { useState } from 'react';

export function SearchForm({ onSearch }) {
  const [searchParams, setSearchParams] = useState({
    location: 'praha',
    sizeFrom: '60',
    sizeTo: '100',
    priceFrom: '',
    priceTo: '',
    sources: ['sreality', 'idnes', 'bezrealitky', 'remax'] // Default all sources selected
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      const sourceValue = name.replace('source_', '');
      setSearchParams(prev => ({
        ...prev,
        sources: checked
          ? [...prev.sources, sourceValue]
          : prev.sources.filter(source => source !== sourceValue)
      }));
    } else {
      setSearchParams(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <select
            name="location"
            value={searchParams.location}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="praha">Prague</option>
            <option value="brno">Brno</option>
            <option value="ostrava">Ostrava</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">size min (m²)</label>
          <input
            type="number"
            name="sizeFrom"
            value={searchParams.sizeFrom}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">size max (m²)</label>
          <input
            type="number"
            name="sizeTo"
            value={searchParams.sizeTo}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">price min (CZK)</label>
          <input
            type="number"
            name="priceFrom"
            value={searchParams.priceFrom}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">price max (CZK)</label>
          <input
            type="number"
            name="priceTo"
            value={searchParams.priceTo}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Search
          </button>
        </div>
      </div>

      <div className="border-t pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Sources</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['sreality', 'idnes', 'bezrealitky', 'remax'].map(source => (
            <label key={source} className="flex items-center space-x-2">
              <input
                type="checkbox"
                name={`source_${source}`}
                checked={searchParams.sources.includes(source)}
                onChange={handleChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 capitalize">{source}</span>
            </label>
          ))}
        </div>
      </div>
    </form>
  );
}