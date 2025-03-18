import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  
  MapPin,
  Loader2,
  Trash,
  Pencil,
  Save,
  X,
} from 'lucide-react';
import { format } from 'date-fns';
import { auth, db, destCollection } from '../firebaseConfig';
import {
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import TripDetails from '../components/TripDetails';
import DestinationDetails from '../components/DestinationDetails';
import FormControl from '../components/FormControl';
import { Destination, Trip } from '../types';

export function Trips() {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Trip>>({});
  const [editedDestinations, setEditedDestinations] = useState<
    Partial<Destination>[]
  >([]);
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

        const destinationsQuery = query(
          destCollection,
          where('tripId', '==', tripId)
        );
        const destinationsSnapshot = await getDocs(destinationsQuery);
        const destinations = destinationsSnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Destination)
        );

        const fetchedTrip = {
          id: tripDoc.id,
          title: tripData.title,
          description: tripData.description,
          startDate: tripData.start_date.toDate(),
          endDate: tripData.end_date.toDate(),
          createdAt: tripData.created_at,
          updatedAt: tripData.updated_at,
          userId: tripData.userId,
          destinations,
        };

        setTrip(fetchedTrip);
        setFormData(fetchedTrip);
        setEditedDestinations([...destinations]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch trip'
        );
        console.error('Error fetching trip:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTrip();
  }, [tripId]);

  const handleDelete = async () => {
    if (
      !tripId ||
      !window.confirm('Are you sure you want to delete this trip?')
    ) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await deleteDoc(doc(db, 'trips', tripId));
      navigate('/dashboard');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete trip'
      );
      console.error('Error deleting trip:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData(trip!);
    setEditedDestinations(trip?.destinations || []);
  };

  const handleSave = async () => {
    if (!tripId) return;

    try {
      setLoading(true);
      setError(null);

      const tripRef = doc(db, 'trips', tripId);
      await updateDoc(tripRef, {
        title: formData.title,
        description: formData.description,
        start_date: formData.startDate,
        end_date: formData.endDate,
        updated_at: new Date().toISOString(),
      });

      for (const dest of editedDestinations) {
        if (dest.id) {
          const destRef = doc(db, 'destinations', dest.id);
          await updateDoc(destRef, {
            address: dest.address,
            city: dest.city,
            flightNumber: dest.flightNumber,
            hotel: dest.hotel,
            name: dest.name,
          });
        }
      }

      setTrip({
        ...trip!,
        title: formData.title!,
        description: formData.description!,
        startDate: formData.startDate!,
        endDate: formData.endDate!,
        destinations: editedDestinations as Destination[],
      });

      setIsEditing(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update trip or destinations'
      );
      console.error('Error updating trip or destinations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    if (id === 'startDate' || id === 'endDate') {
      setFormData({ ...formData, [id]: new Date(value) });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const handleDestinationChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: keyof Destination
  ) => {
    const newDestinations = [...editedDestinations];
    newDestinations[index] = {
      ...newDestinations[index],
      [field]: e.target.value,
    };
    setEditedDestinations(newDestinations);
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen p-8 bg-gray-100 text-center text-gray-700">
        Trip not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg shadow-sm max-w-lg w-full">
          {error}
        </div>
      )}
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl w-full">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <MapPin className="h-8 w-8 text-blue-500" />
            <h2 className="text-3xl font-bold text-gray-800">Trip Details</h2>
          </div>
          <div className="flex space-x-3">
            {!isEditing ? (
              <button
                onClick={handleEditToggle}
                className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
              >
                <Pencil className="h-5 w-5" />
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition disabled:opacity-50"
                >
                  <Save className="h-5 w-5" />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </>
            )}
            <button
              onClick={handleDelete}
              disabled={loading}
              className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition disabled:opacity-50"
            >
              <Trash className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <TripDetails
            formData={formData}
            handleInputChange={handleInputChange}
            isEditing={isEditing}
          />
          <DestinationDetails
            editedDestinations={editedDestinations}
            handleDestinationChange={handleDestinationChange}
            isEditing={isEditing}
          />
          <FormControl
            label="Start Date"
            id="startDate"
            type="date"
            value={formData.startDate ? format(formData.startDate, 'yyyy-MM-dd') : ''}
            handleInputChange={handleInputChange}
            isEditing={isEditing}
          />
          <FormControl
            label="End Date"
            id="endDate"
            type="date"
            value={formData.endDate ? format(formData.endDate, 'yyyy-MM-dd') : ''}
            handleInputChange={handleInputChange}
            isEditing={isEditing}
          />
          <FormControl
            label="Notes"
            id="description"
            type="textarea"
            value={formData.description || ''}
            handleInputChange={handleInputChange}
            isEditing={isEditing}
          />
          <div className="flex justify-end">
            <Link
              to="/dashboard"
              className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition shadow-md"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}