import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { PlusCircle, Calendar, MapPin, Loader2, Delete, DeleteIcon, Recycle, Trash } from 'lucide-react';
import { format, set } from 'date-fns';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import type { Trip } from '../types';
import { auth, db, destCollection, tripsCollection } from '../firebaseConfig';
import { deleteDoc, doc, getDoc, getDocs, query, Timestamp, where } from 'firebase/firestore';

export function Trips() {
  //  const { user } = useAuthStore();
  const user = auth.currentUser;
  const [trip, setTrip] = useState<Trip>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const tripId = useParams().id;
  const navigate = useNavigate();


  console.log("tripId", tripId);


  useEffect(() => {
    async function fetchTrips() {
      if (tripId === undefined) {
        setError("Trip ID is undefined");
        setLoading(false);
        return;
      }
      try {

        const tripsquery = doc(db, 'trips', tripId);
        const tripsDoc = await getDoc(tripsquery);
        const data = tripsDoc.data();
        if (!data) {
          throw new Error('Trip not found');
        }
        const trip = {
          id: data.id,
          title: data.title,
          description: data.description,
          startDate: (data.start_date as Timestamp).toDate(),
          endDate: (data.end_date as Timestamp).toDate(),
          createdAt: data.created_at,
          updatedAt: data.created_at,
          userId: data.userId,
          destinations: data.destinations || [],
        };
        //        console.log("trips", trips);

        const destinationsQuery = query(destCollection, where('tripId', '==', tripId));
        const destinationsDoc = await getDocs(destinationsQuery);
        const destinations = destinationsDoc.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            address: data.address,
            city: data.city,
            flightNumber: data.flightNumber,
            hotel: data.hotel,
            name: data.name,
            tripId: data.tripId,
          };
        });

        setTrip({ ...trip, destinations });

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch trips');
      } finally {
        setLoading(false);
      }
    }

    fetchTrips();
  }, [tripId]);

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


  async function deleteTrip() {
    if (!tripId) {
      setError("Trip ID is undefined");
      return;
    }

    try {
      setLoading(true);
      const tripsquery = doc(db, 'trips', tripId);
      await deleteDoc(tripsquery);
      navigate("/dashboard");

      //      const destinationsQuery = query(destCollection, where('tripId', '==', tripId));
      //    await deleteDoc(destinationsQuery);
      setTrip(undefined);
      setError(null);
      alert('Trip deleted successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete trip');
    } finally {
      setLoading(false);
    }
  }
  return (
    <div>
      <div className='w-full bg-white p-8 rounded shadow-md'>
        <div className='my-4 '>
          <div className='flex end-0 justify-end'>
            <div className='p-2 relative right-0 w-fit end-0' onClick={deleteTrip}>
              <Trash className='h-4 w-4 text-red-600' />
            </div>
          </div>
          <label htmlFor="tripName">Trip Name:</label>
          <input className='border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            type="text"
            id="tripName"
            disabled
            value={trip?.title}
            required
          />
        </div>
        <div className='my-4'>
          <label htmlFor="destination">Destination:</label>
          <div className='p-2'>
            {trip?.destinations.map((destination) => (
              <div key={destination.id} className='flex items-center space-x-2'>
                <MapPin className='h-4 w-4 text-blue-600' />
                <span>{destination.name} | {destination.city} | {destination.hotel} | {destination.address} | {destination.flightNumber}</span>
              </div>
            ))}
          </div>

        </div>
        <div className='my-4'>
          <label htmlFor="startDate">Start Date:</label>
          <input
            className='border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            type="date"
            id="startDate"
            value={trip?.startDate ? format(trip.startDate, 'yyyy-MM-dd') : ''}
            disabled
            required
          />
        </div>
        <div className='my-4'>
          <label htmlFor="endDate">End Date:</label>
          <input
            className='border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            type="date"
            id="endDate"
            value={trip?.endDate ? format(trip.endDate, 'yyyy-MM-dd') : ''}
            disabled
            required
          />
        </div>
        <div className='my-4'>
          <label htmlFor="notes">Notes:</label>
          <textarea
            className='border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id="notes"
            disabled
            value={trip?.description}
          />
        </div>
      </div>
    </div>
  );
};