import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { PlusCircle, Calendar, MapPin, Loader2 } from 'lucide-react';
import { format, set } from 'date-fns';
import { useAuthStore } from '../store/authStore';
import type { Trip } from '../types';
import { destCollection, tripsCollection } from '../firebaseConfig';
import { getDocs, query, Timestamp, where } from 'firebase/firestore';

export function Dashboard() {
  const { user } = useAuthStore();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrips() {
      try {


        const tripsquery = query(tripsCollection, where('userId', '==', user?.id));
        const tripsDoc = await getDocs(tripsquery);

        const trips : Trip[] = tripsDoc.docs.map((doc) => {
          const data = doc.data();
          console.log("data", (data.start_date as Timestamp).toDate());
          return {
            id: doc.id,
            title: data.title,
            description: data.description ,
            startDate: (data.start_date as Timestamp).toDate(),
            endDate: (data.end_date as Timestamp).toDate(),
            createdAt: data.created_at,
            updatedAt: data.created_at,
            userId: data.userId,
            destinations: data.destinations || [],
          };
        })
        console.log("trips", trips);

        const TripsWIthDes = trips.map(async (trip) => {
          const destinationsQuery = query(destCollection, where('tripId', '==', trip.id));
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
          return {
            ...trip,
            destinations,
          };
        });
        const tripsWithDestinations = await Promise.all(TripsWIthDes);
        setTrips(tripsWithDestinations);
        console.log("tripsWithDestinations", tripsWithDestinations);
        
//        setTrips(tripsWithDestinations);

        // const { data, error } = await supabase
        //   .from('trips')
        //   .select(`
        //     id,
        //     title,
        //     description,
        //     start_date,
        //     end_date,
        //     created_at,
        //     destinations (
        //       id,
        //       name,
        //       start_date,
        //       end_date
        //     )
        //   `)
        //   .order('start_date', { ascending: true });

        // if (error) throw error;

        // if (user) {
        //   setTrips(
        //     (data || []).map((trip: any) => ({
        //       id: trip.id,
        //       title: trip.title,
        //       description: trip.description,
        //       startDate: trip.start_date,
        //       endDate: trip.end_date,
        //       createdAt: trip.created_at,
        //       updatedAt: trip.created_at, // Assuming updatedAt is the same as createdAt for now
        //       userId: user.id, // Assuming userId is the current user's id
        //       destinations: trip.destinations.map((destination: any) => ({
        //         id: destination.id,
        //         name: destination.name,
        //         startDate: destination.start_date,
        //         endDate: destination.end_date,
        //       })),
        //     }))
        //   );
        // }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch trips');
      } finally {
        setLoading(false);
      }
    }

    fetchTrips();
  }, []);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 "
    style={{
      backgroundImage: 'url(/DBbackground.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
    }}>
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
        <Link
          to="/trips/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          New Trip
        </Link>
      </div>

      {error && (
        <div className="mb-8 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {trips.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No trips</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new trip.</p>
          <div className="mt-6">
            <Link
              to="/trips/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              New Trip
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <Link
              key={trip.id}
              to={`/trips/${trip.id}`}
              className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {trip.title}
                </h3>
                {trip.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {trip.description}
                  </p>
                )}
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    {format(trip.startDate, 'EEE MM dd, yyyy - hh:mm a')} -{' '}
                    {format(trip.endDate, 'EEE MM dd, yyyy - hh:mm a')}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{trip.destinations?.length || 0} destinations</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}