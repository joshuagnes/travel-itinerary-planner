import React, { useState } from 'react';

export interface TripDetails {
  address: string;
  city: string;
  flightNumber: string;
  hotel: string;
  name: string;
}

const TripDetailsDialog = ({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: (details: TripDetails) => void }) => {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [hotel, setHotel] = useState('');
  const [name, setName] = useState(''); // Trip name


  const handleConfirm = () => {
    const tripDetails: TripDetails = {
      address,
      city,
      flightNumber,
      hotel,
      name,
    };
    
    onConfirm(tripDetails);
    onClose();
    setAddress('');
    setCity('');
    setFlightNumber('');
    setHotel('');
    setName('');
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 bg-white rounded-lg shadow-lg p-6">
        
        <h2 className="text-xl font-bold mb-4">Trip Details</h2>
        
        <form>
          <div className="mb-3">
            
            <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Destination:</label>
            <input
              type="text"
              id="name"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          
          <div className="mb-3">
            <label htmlFor="city" className="block text-gray-700 font-bold mb-2">City:</label>
            <input
              type="text"
              id="city"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="flightNumber" className="block text-gray-700 font-bold mb-2">Flight Number:</label>
            <input
              type="text"
              id="flightNumber"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="hotel" className="block text-gray-700 font-bold mb-2">Hotel:</label>
            <input
              type="text"
              id="hotel"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={hotel}
              onChange={(e) => setHotel(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="address" className="block text-gray-700 font-bold mb-2">Address:</label>
            <input
              type="text"
              id="address"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleConfirm}
            >
              Confirm
            </button>
          </div>

          
        </form>
      </div>
    </div>
  );
};

export default TripDetailsDialog;