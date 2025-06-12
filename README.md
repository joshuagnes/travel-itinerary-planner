# Travel Itinerary Planner

This project is a Travel Itinerary Planner application built with React and Vite. It allows users to create detailed travel itineraries, track their destinations, and share their adventures with friends and family.

## Project Setup Instructions

1. **Clone the repository:**
```sh
git clone https://github.com/yourusername/travel-itinerary-planner.git
cd travel-itinerary-planner
```

2. **Install dependencies:**
```
npm install
```

3. **Set up environment variables: Create a `.env` file in the root directory and add the following:**
```
VITE_APP_ID='your_openweathermap_api_key'
VITE_FLIGHT_API_KEY='your_aviationstack_api_key'
```

4. **Run the development server:**
```
npm run dev
```

5. **Build for production:**
```
npm run build
```

6. **Preview the production build:**
```
npm run preview
```

## Features

- **User Authentication:** Sign up and log in using Firebase Authentication.
- **Trip Management:** Create, edit, and delete trips with multiple destinations.
- **Weather Forecast:** Fetch and display weather information for different cities.
- **Flight Details:** Fetch and display flight details using the AviationStack API.
- **Responsive Design:** Mobile-friendly layout with Tailwind CSS.

## Technologies Used 

- **React:** JavaScript library for building user interfaces.
- **Vite:** Next-generation frontend tooling.
- **Firebase:** Backend-as-a-Service for authentication and Firestore database.
- **Tailwind CSS:** Utility-first CSS framework.
- **Zustand:** State management library.
- **Date-fns:** Modern JavaScript date utility library.
- **Lucide-react:** Icon library for React.
- **Supabase:** Open-source Firebase alternative.

## API Documentation

### Weather API

- Endpoint: https://api.openweathermap.org/data/2.5/weather
- Parameters:
    - q: City name
    - units: Units of measurement (metric)
    - appid: API key

## Known Limitations or Bugs

- **Error Handling:** Some error messages may not be user-friendly.
- **API Rate Limits:** The application may hit API rate limits if used extensively.
- **Mobile Responsiveness:** Some components may need further optimization for smaller screens.
- **Data Consistency:** Ensure that the Firebase Firestore rules are properly configured to prevent unauthorized access.

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License
This project is licensed under the MIT License.
