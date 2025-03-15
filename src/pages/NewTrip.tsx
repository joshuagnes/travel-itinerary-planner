import { FormEvent, useState } from 'react';
import { doc, runTransaction } from 'firebase/firestore';
import { auth, db, destCollection, tripsCollection } from '../firebaseConfig';
import TripDetailsDialog, { TripDetails } from './TripDetailsDialog';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FormState {
  tripName: string;
  startDate: string;
  endDate: string;
  notes: string;
  tripData: TripDetails[];
}

export const NewTrip = () => {
  const [formState, setFormState] = useState<FormState>({
    tripName: '',
    startDate: '',
    endDate: '',
    notes: '',
    tripData: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const updateFormState = (updates: Partial<FormState>) => {
    setFormState(prev => ({ ...prev, ...updates }));
  };

  const handleConfirm = (details: TripDetails) => {
    updateFormState({ tripData: [...formState.tripData, details] });
    setIsDialogOpen(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!auth.currentUser) {
      setError('You must be logged in to create a trip');
      return;
    }

    if (formState.tripData.length === 0) {
      setError('Please add at least one destination');
      return;
    }

    if (new Date(formState.startDate) > new Date(formState.endDate)) {
      setError('End date must be after start date');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await runTransaction(db, async (transaction) => {
        const tripDocRef = doc(tripsCollection);
        
        transaction.set(tripDocRef, {
          id: tripDocRef.id,
          title: formState.tripName,
          description: formState.notes,
          start_date: new Date(formState.startDate),
          end_date: new Date(formState.endDate),
          created_at: new Date(),
          userId: auth.currentUser?.uid,
          destinations: [],
        });

        formState.tripData.forEach((trip) => {
          const destDocRef = doc(destCollection);
          transaction.set(destDocRef, {
            ...trip,
            id: destDocRef.id,
            tripId: tripDocRef.id,
          });
        });
      });

      updateFormState({
        tripName: '',
        startDate: '',
        endDate: '',
        notes: '',
        tripData: [],
      });
      navigate('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create trip');
      console.error('Error creating trip:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Create New Trip</h2>

        <div className="my-4">
          <label htmlFor="tripName" className="block mb-1">Trip Name:</label>
          <input
            className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            type="text"
            id="tripName"
            value={formState.tripName}
            onChange={(e) => updateFormState({ tripName: e.target.value })}
            required
            disabled={isLoading}
          />
        </div>

        <div className="my-4">
          <label className="block mb-1">Destinations:</label>
          {formState.tripData.map((dest, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <span>{dest.name} - {dest.city}</span>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center text-blue-600 hover:text-blue-800"
            disabled={isLoading}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Destination
          </button>
        </div>

        <div className="my-4">
          <label htmlFor="startDate" className="block mb-1">Start Date:</label>
          <input
            className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            type="date"
            id="startDate"
            value={formState.startDate}
            onChange={(e) => updateFormState({ startDate: e.target.value })}
            required
            disabled={isLoading}
          />
        </div>

        <div className="my-4">
          <label htmlFor="endDate" className="block mb-1">End Date:</label>
          <input
            className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            type="date"
            id="endDate"
            value={formState.endDate}
            onChange={(e) => updateFormState({ endDate: e.target.value })}
            required
            disabled={isLoading}
          />
        </div>

        <div className="my-4">
          <label htmlFor="notes" className="block mb-1">Notes:</label>
          <textarea
            className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            id="notes"
            value={formState.notes}
            onChange={(e) => updateFormState({ notes: e.target.value })}
            disabled={isLoading}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Add Trip'}
          </button>
        </div>
      </form>

      <TripDetailsDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
};