import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Trips } from './pages/Trips';
import { NewTrip } from './pages/NewTrip';
import { FlightDetails } from './pages/FlightDetails';
import Weather from '/src/pages/Weather.tsx';

function App() {
	return (
		<>
			<BrowserRouter
				future={{
					v7_relativeSplatPath: true,
					v7_startTransition: true,
				}}
			>
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route index element={<Home />} />
						<Route path="login" element={<Login />} />
						<Route path="signup" element={<Signup />} />
						<Route path="dashboard" element={<Dashboard />} />
						<Route path="trips/new" element={<NewTrip />} />
						<Route path="trips/:id" element={<Trips />} />
						<Route
							path="flight-details"
							element={<FlightDetails />}
						/>
						<Route path="weather" element={<Weather />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
