import React from 'react';
import { Destination } from '../types';
import { useNavigate } from 'react-router-dom';

// Define the props expected by the DestinationDetails component
interface DestinationDetailsProps {
  editedDestinations: any[]; // List of destinations being edited
  handleDestinationChange: (e: React.ChangeEvent<HTMLInputElement>, index: number, field: keyof Destination) => void; // Function to handle input changes
  isEditing: boolean; // Determines if inputs should be editable
}

const DestinationDetails: React.FC<DestinationDetailsProps> = ({
  editedDestinations,
  handleDestinationChange,
  isEditing,
}) => {
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Function to navigate to flight details page with flight number
  const handleViewFlightDetails = (flightNumber: string) => {
    navigate('/flight-details', { state: { flightNumber } });
  };

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
            {/* Input fields for destination details */}
            {['name', 'city', 'hotel', 'address', 'flightNumber'].map((field) => (
              <div key={field} className="flex items-center gap-3">
                <label
                  htmlFor={`${field}-${index}`}
                  className="w-28 text-sm font-medium text-gray-700"
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  id={`${field}-${index}`}
                  className={`flex-1 p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${
                    isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                  }`}
                  type="text"
                  value={destination[field] || ''}
                  onChange={(e) => handleDestinationChange(e, index, field as keyof Destination)}
                  disabled={!isEditing}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                />
              </div>
            ))}

            {/* Button to view flight details */}
            <button
              onClick={() => handleViewFlightDetails(destination.flightNumber)}
              className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition shadow-md me-4"
              disabled={!destination.flightNumber} // Disable button if no flight number
            >
              View Flight Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DestinationDetails;