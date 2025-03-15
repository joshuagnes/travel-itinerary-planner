import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { PlusCircle, Calendar, MapPin, Loader2, Trash } from 'lucide-react';
import { format } from 'date-fns';
import { auth, db, destCollection } from '../firebaseConfig';
import { deleteDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';

interface Destination {
  id: string;
  address: string;
  city: string;
  flightNumber: string;
  hotel: string;
  name: string;
  tripId: string;
}

interface Trip {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  createdAt: string;
  updatedAt: string;
  userId: string;
  destinations: Destination[];
}

export function Trips() {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id: tripId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    async function fetchTrip() {
      if (!tripId) {
        setError('Trip ID is missing');
        setLoading(false);
        return;
      }

      try {
        const tripRef = doc(db, 'trips', tripId);
        const tripDoc = await getDoc(tripRef);
        const tripData = tripDoc.data();

        if (!tripDoc.exists() || !tripData) {
          throw new Error('Trip not found');
        }

        const destinationsQuery = query(destCollection, where('tripId', '==', tripId));
        const destinationsSnapshot = await getDocs(destinationsQuery);
        const destinations = destinationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Destination));

        setTrip({
          id: tripDoc.id,
          title: tripData.title,
          description: tripData.description,
          startDate: tripData.start_date.toDate(),
          endDate: tripData.end_date.toDate(),
          createdAt: tripData.created_at,
          updatedAt: tripData.updated_at,
          userId: tripData.userId,
          destinations,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch trip');
        console.error('Error fetching trip:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTrip();
  }, [tripId]);

  const handleDelete = async () => {
    if (!tripId || !window.confirm('Are you sure you want to delete this trip?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await deleteDoc(doc(db, 'trips', tripId));
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete trip');
      console.error('Error deleting trip:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!trip) {
    return <div className="min-h-screen p-8">Trip not found</div>;
  }

  return (
    <div className="min-h-screen p-8">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Trip Details</h2>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="text-red-600 hover:text-red-800 disabled:opacity-50"
          >
            <Trash className="h-5 w-5" />
          </button>
        </div>

        <div className="my-4">
          <label htmlFor="tripName" className="block mb-1">Trip Name:</label>
          <input
            className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            type="text"
            id="tripName"
            value={trip.title}
            disabled
          />
        </div>

        <div className="my-4">
          <label className="block mb-1">Destinations:</label>
          <div className="p-2">
            {trip.destinations.map((destination) => (
              <div key={destination.id} className="flex items-center space-x-2 mb-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span>
                  {destination.name} | {destination.city} | {destination.hotel} | 
                  {destination.address} | {destination.flightNumber}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="my-4">
          <label htmlFor="startDate" className="block mb-1">Start Date:</label>
          <input
            className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            type="date"
            id="startDate"
            value={format(trip.startDate, 'yyyy-MM-dd')}
            disabled
          />
        </div>

        <div className="my-4">
          <label htmlFor="endDate" className="block mb-1">End Date:</label>
          <input
            className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            type="date"
            id="endDate"
            value={format(trip.endDate, 'yyyy-MM-dd')}
            disabled
          />
        </div>

        <div className="my-4">
          <label htmlFor="notes" className="block mb-1">Notes:</label>
          <textarea
            className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            id="notes"
            value={trip.description}
            disabled
          />
        </div>

        <div className="flex justify-end">
          <Link
            to="/dashboard"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}