import React from 'react';

interface TripDetailsProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isEditing: boolean;
}

const TripDetails: React.FC<TripDetailsProps> = ({ formData, handleInputChange, isEditing }) => {
  return (
    <div>
      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
        Trip Name
      </label>
      <input
        className={`w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${
          isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
        }`}
        type="text"
        id="title"
        value={formData.title || ''}
        onChange={handleInputChange}
        disabled={!isEditing}
        placeholder="Enter trip name"
      />
    </div>
  );
};

export default TripDetails;
