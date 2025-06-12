import { useLocation } from 'react-router-dom';
import { Plane, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FlightDetail } from '../types';
import { format } from 'date-fns';

interface FlightDetailsProps {
  flightNumber: string;
}

export function FlightDetails() {
  const location = useLocation();
  const { flightNumber } = location.state as FlightDetailsProps;
  const [flightDetail, setFlightDetail] = useState<FlightDetail | null>(null);


  const fetchFlightDetails = async (flightNumber: string) => {

    try {
      const response = await fetch(`https://api.aviationstack.com/v1/flights?access_key=${import.meta.env.VITE_FLIGHT_API_KEY}&flight_iata=${flightNumber}`);
      const data = await response.json();
      setFlightDetail(data.data[0]);
      console.log(data);
    } catch (error) { 
      console.error('Error fetching flight details:', error);
    }
  };

  useEffect(() => {
    fetchFlightDetails(flightNumber);
  }, [flightNumber]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Plane className="h-8 w-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-800">Flight Details</h1>
          </div>
          <Link
            to={-1 as any}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </Link>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h2 className="font-semibold text-lg text-gray-800">Flight Number</h2>
            <p className="text-gray-600">{flightNumber}</p>
          </div>
        </div>
        <div className="space-y-4 mt-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h2 className="font-semibold text-lg text-gray-800">Flight Name</h2>
            <p className="text-gray-600">{flightDetail?.airline.name}</p>
          </div>
        </div>
        <div className="space-y-4 mt-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h2 className="font-semibold text-lg text-gray-800">Flight Status</h2>
            <p className="text-gray-600">{flightDetail?.flight_status}</p>
          </div>
        </div>
        {/* <div className="space-y-4 mt-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h2 className="font-semibold text-lg text-gray-800">Flight Date</h2>
            <p className="text-gray-600">{flightDetail?.flight_date}</p>
          </div>
        </div> */}
        <div className="space-y-4 mt-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h2 className="font-semibold text-lg text-gray-800">Departure Time</h2>
            <label htmlFor="departure-actual">Actual:</label> <p className="text-gray-600">{flightDetail?.departure.actual ? format(new Date(flightDetail.departure.actual), 'EEE MM dd, yyyy - hh:mm a') : '-'}</p>
            <label htmlFor="departure-scheduled">Scheduled:</label> <p className="text-gray-600">{flightDetail?.departure.scheduled ? format(new Date(flightDetail.departure.scheduled), 'EEE MM dd, yyyy - hh:mm a') : '-'}</p>
            <label htmlFor="departure-airport">Airport:</label> <p className="text-gray-600">{flightDetail?.departure.airport}</p>
          </div>
        </div>
        <div className="space-y-4 mt-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h2 className="font-semibold text-lg text-gray-800">Arrival Time</h2>
            <label htmlFor="arrival-actual">Actual:</label> <p className="text-gray-600">{flightDetail?.arrival.actual ? format(new Date(flightDetail.arrival.actual), 'EEE MM dd, yyyy - hh:mm a') : '-'}</p>
            <label htmlFor="arrival-scheduled">Scheduled:</label> <p className="text-gray-600">{flightDetail?.arrival.scheduled ? format(new Date(flightDetail.arrival.scheduled), 'EEE MM dd, yyyy - hh:mm a') : '-'}</p>
            <label htmlFor="arrival-airport">Airport:</label> <p className="text-gray-600">{flightDetail?.arrival.airport}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 