import React from 'react';

export function ListingsGrid({ listings }) {
  if (!listings.length) {
    return (
      <div className="text-center text-gray-500 py-10">
        No listings found. Try adjusting your search parameters.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map(listing => (
        <div key={listing.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative h-48">
            {listing.images[0] ? (
              <img
                src={listing.images[0]}
                alt={listing.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <p className="text-gray-400">No image available</p>
              </div>
            )}
            <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-sm">
              {listing.source}
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{listing.name}</h3>
            <p className="text-gray-600 mb-2">{listing.location}</p>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-sm text-gray-500">Size</p>
                <p className="font-semibold">{listing.size} m²</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-sm text-gray-500">Price</p>
                <p className="font-semibold">
                  {new Intl.NumberFormat('cs-CZ').format(listing.price)} Kč
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-2 rounded mb-4">
              <p className="text-sm text-gray-500">Price per m²</p>
              <p className="font-semibold text-blue-600">
                {new Intl.NumberFormat('cs-CZ').format(listing.pricePerMeter)} Kč/m²
              </p>
            </div>

            <a
              href={listing.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
            >
              View Listing
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
