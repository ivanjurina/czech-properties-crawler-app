import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export function ListingsTable({ listings, sortConfig, onSort }) {
  if (!listings.length) {
    return (
      <div className="text-center text-gray-500 py-10">
        No listings found. Try adjusting your search parameters.
      </div>
    );
  }

  const SortHeader = ({ column, label }) => {
    const isActive = sortConfig.key === column;
    const direction = sortConfig.direction;

    return (
      <th
        className="px-4 py-2 bg-gray-50 cursor-pointer hover:bg-gray-100"
        onClick={() => onSort(column)}
      >
        <div className="flex items-center gap-1">
          {label}
          <span className="text-gray-400">
            {isActive && (
              direction === 'asc' 
                ? <ChevronUp className="h-4 w-4" /> 
                : <ChevronDown className="h-4 w-4" />
            )}
          </span>
        </div>
      </th>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">Image</th>
              <SortHeader column="source" label="Source" />
              <th className="px-4 py-2 text-left">Name</th>
              <SortHeader column="location" label="Location" />
              <SortHeader column="size" label="Size" />
              <SortHeader column="price" label="Price" />
              <SortHeader column="pricePerMeter" label="Price per m²" />
              <th className="px-4 py-2">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {listings.map(listing => (
              <tr key={listing.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">
                  <div className="w-20 h-20 relative">
                    {listing.images[0] ? (
                      <img
                        src={listing.images[0]}
                        alt={listing.name}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded">
                        <p className="text-gray-400 text-xs">No image</p>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2">
                  <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                    {listing.source}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <p className="font-medium line-clamp-2">{listing.name}</p>
                </td>
                <td className="px-4 py-2">{listing.location}</td>
                <td className="px-4 py-2">{listing.size} m²</td>
                <td className="px-4 py-2">
                  {new Intl.NumberFormat('cs-CZ').format(listing.price)} Kč
                </td>
                <td className="px-4 py-2">
                  <span className="text-blue-600 font-medium">
                    {new Intl.NumberFormat('cs-CZ').format(listing.pricePerMeter)} Kč/m²
                  </span>
                </td>
                <td className="px-4 py-2 text-center">
                  <a
                    href={listing.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}