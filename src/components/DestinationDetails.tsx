import React from 'react';

interface DestinationDetailsProps {
  editedDestinations: any[];
  handleDestinationChange: (e: React.ChangeEvent<HTMLInputElement>, index: number, field: string) => void;
  isEditing: boolean;
}

const DestinationDetails: React.FC<DestinationDetailsProps> = ({
  editedDestinations,
  handleDestinationChange,
  isEditing,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Destinations
      </label>
      {editedDestinations.map((destination, index) => (
        <div
          key={destination.id}
          className="p-4 mb-4 bg-gray-50 rounded-lg shadow-sm"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <label
                htmlFor={`name-${index}`}
                className="w-28 text-sm font-medium text-gray-700"
              >
                Destination
              </label>
              <input
                id={`name-${index}`}
                className={`flex-1 p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${
                  isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                }`}
                type="text"
                value={destination.name || ''}
                onChange={(e) => handleDestinationChange(e, index, 'name')}
                disabled={!isEditing}
                placeholder="Destination"
              />
            </div>
            <div className="flex items-center gap-3">
              <label
                htmlFor={`city-${index}`}
                className="w-28 text-sm font-medium text-gray-700"
              >
                City
              </label>
              <input
                id={`city-${index}`}
                className={`flex-1 p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${
                  isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                }`}
                type="text"
                value={destination.city || ''}
                onChange={(e) => handleDestinationChange(e, index, 'city')}
                disabled={!isEditing}
                placeholder="City"
              />
            </div>
            <div className="flex items-center gap-3">
              <label
                htmlFor={`hotel-${index}`}
                className="w-28 text-sm font-medium text-gray-700"
              >
                Hotel
              </label>
              <input
                id={`hotel-${index}`}
                className={`flex-1 p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${
                  isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                }`}
                type="text"
                value={destination.hotel || ''}
                onChange={(e) => handleDestinationChange(e, index, 'hotel')}
                disabled={!isEditing}
                placeholder="Hotel"
              />
            </div>
            <div className="flex items-center gap-3">
              <label
                htmlFor={`address-${index}`}
                className="w-28 text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <input
                id={`address-${index}`}
                className={`flex-1 p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${
                  isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                }`}
                type="text"
                value={destination.address || ''}
                onChange={(e) => handleDestinationChange(e, index, 'address')}
                disabled={!isEditing}
                placeholder="Address"
              />
            </div>
            <div className="flex items-center gap-3">
              <label
                htmlFor={`flightNumber-${index}`}
                className="w-28 text-sm font-medium text-gray-700"
              >
                Flight Number
              </label>
              <input
                id={`flightNumber-${index}`}
                className={`flex-1 p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${
                  isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                }`}
                type="text"
                value={destination.flightNumber || ''}
                onChange={(e) =>
                  handleDestinationChange(e, index, 'flightNumber')
                }
                disabled={!isEditing}
                placeholder="Flight Number"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DestinationDetails;
