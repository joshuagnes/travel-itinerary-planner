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
		setFormState((prev) => ({ ...prev, ...updates }));
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
			setError(
				error instanceof Error ? error.message : 'Failed to create trip'
			);
			console.error('Error creating trip:', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br bg-blue-200 flex items-center justify-center p-6">
			<div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
				{error && (
					<div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-r-lg">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit}>
					<h2 className="text-3xl font-bold text-gray-800 mb-8">
						Plan Your New Adventure
					</h2>

					<div className="space-y-6">
						<div>
							<label
								htmlFor="tripName"
								className="block text-sm font-medium text-gray-700 mb-2"
							>
								Trip Name
							</label>
							<input
								className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 disabled:bg-gray-100"
								type="text"
								id="tripName"
								value={formState.tripName}
								onChange={(e) =>
									updateFormState({
										tripName: e.target.value,
									})
								}
								required
								disabled={isLoading}
								placeholder="e.g., Summer Road Trip"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Destinations
							</label>
							<div className="space-y-2 mb-3">
								{formState.tripData.map((dest, index) => (
									<div
										key={index}
										className="flex items-center p-3 bg-gray-50 rounded-lg text-gray-700"
									>
										<span className="font-medium">
											{dest.name}
										</span>
										<span className="mx-2">-</span>
										<span>{dest.city}</span>
									</div>
								))}
							</div>
							<button
								type="button"
								onClick={() => setIsDialogOpen(true)}
								className="flex items-center text-blue-600 hover:text-blue-800 transition duration-200 disabled:text-gray-400"
								disabled={isLoading}
							>
								<Plus className="h-5 w-5 mr-2" />
								Add Destination
							</button>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label
									htmlFor="startDate"
									className="block text-sm font-medium text-gray-700 mb-2"
								>
									Start Date
								</label>
								<input
									className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 disabled:bg-gray-100"
									type="date"
									id="startDate"
									value={formState.startDate}
									onChange={(e) =>
										updateFormState({
											startDate: e.target.value,
										})
									}
									required
									disabled={isLoading}
								/>
							</div>
							<div>
								<label
									htmlFor="endDate"
									className="block text-sm font-medium text-gray-700 mb-2"
								>
									End Date
								</label>
								<input
									className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 disabled:bg-gray-100"
									type="date"
									id="endDate"
									value={formState.endDate}
									onChange={(e) =>
										updateFormState({
											endDate: e.target.value,
										})
									}
									required
									disabled={isLoading}
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor="notes"
								className="block text-sm font-medium text-gray-700 mb-2"
							>
								Notes
							</label>
							<textarea
								className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 disabled:bg-gray-100"
								id="notes"
								value={formState.notes}
								onChange={(e) =>
									updateFormState({ notes: e.target.value })
								}
								disabled={isLoading}
								rows={4}
								placeholder="Add any additional details or plans..."
							/>
						</div>
					</div>

					<div className="mt-8 flex justify-end space-x-4">
						<button
							type="button"
							onClick={() => navigate('/dashboard')}
							className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200 disabled:opacity-50"
							disabled={isLoading}
						>
							Cancel
						</button>
						<button
							type="submit"
							className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 flex items-center"
							disabled={isLoading}
						>
							{isLoading ? (
								<>
									<svg
										className="animate-spin h-5 w-5 mr-2"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										/>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8v8z"
										/>
									</svg>
									Creating...
								</>
							) : (
								'Create Trip'
							)}
						</button>
					</div>
				</form>

				<TripDetailsDialog
					isOpen={isDialogOpen}
					onClose={() => setIsDialogOpen(false)}
					onConfirm={handleConfirm}
				/>
			</div>
		</div>
	);
};
