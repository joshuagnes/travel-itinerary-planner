import { FormEvent, useState } from 'react';
import { doc, setDoc, DocumentReference } from "firebase/firestore";
import { auth, destCollection, tripsCollection } from '../firebaseConfig';
import TripDetailsDialog, { TripDetails } from './TripDetailsDialog';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


export const NewTrip = () => {
  const [tripName, setTripName] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tripData, setTripData] = useState<TripDetails[]>([]);
  const navigate = useNavigate();


  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);
  const handleConfirm = (details: TripDetails) => {
    setTripData([...tripData, { ...details }]);
    console.log("Trip Details:", tripData); //Do something with the trip data.  Add it to Firestore, etc.
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {


      const destinationsRefs: DocumentReference[] = [];
      tripData.forEach(() => {
        const newDocRef = doc(destCollection);
        destinationsRefs.push(newDocRef);
      });
      const tripDocRef = doc(tripsCollection);
      const docRef = await setDoc(tripDocRef, {
        id: tripDocRef.id,
        name: tripName,
        destination: destinationsRefs.map(ref => ref.id), // Store the IDs of the destination documents
        start_date: new Date(startDate), // Convert to Date object
        end_date: new Date(endDate),     // Convert to Date object
        title: notes,
        created_at: new Date(),          // Add a timestamp
        userId: auth.currentUser?.uid, // Assuming you have user authentication
      });



      tripData.forEach((trip, index) => {
        const newDocRef = destinationsRefs[index];
        setDoc(newDocRef, {
          id: newDocRef.id,
          address: trip.address,
          city: trip.city,
          flightNumber: trip.flightNumber,
          hotel: trip.hotel,
          name: trip.name,
          tripId: tripDocRef.id, // Assuming you want to link this destination to the trip
        });
      });

      // Optionally, reset the form or show a success message.
      setTripName('');
      setDestination('');
      setStartDate('');
      setEndDate('');
      setNotes('');
      navigate('/dashboard');
    } catch (error) {
      console.error("Error adding document: ", error);
      // Optionally, display an error message to the user.
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className='w-full bg-white p-8 rounded shadow-md'>
        <div className='my-4 '>
          <label htmlFor="tripName">Trip Name:</label>
          <input className='border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            type="text"
            id="tripName"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            required
          />
        </div>
        <div className='my-4'>
          <label htmlFor="destination">Destination:</label>
          <div className='p-2' onClick={openDialog}>
            <Plus className='h-4 w-4 text-blue-600' />
          </div>

        </div>
        <div className='my-4'>
          <label htmlFor="startDate">Start Date:</label>
          <input
            className='border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className='my-4'>
          <label htmlFor="endDate">End Date:</label>
          <input
            className='border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div className='my-4'>
          <label htmlFor="notes">Notes:</label>
          <textarea
            className='border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <div className='w-full flex justify-center'>
          <button type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"        >Add Trip</button>
        </div>
      </form>
      <TripDetailsDialog isOpen={isDialogOpen} onClose={closeDialog} onConfirm={handleConfirm} />
    </div>
  );
};