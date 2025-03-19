import React from 'react';

// Define the expected props for the Button component
// loading: boolean - whether the button is in a loading state
// text: string - the default button text
// conditionalText?: string - optional alternative text when not loading

type Props = {
    loading: boolean,
    text: string,
    conditionalText?: string,
};

export default function Button({ 
    loading,
    text,
    conditionalText = 'Sign in', // Default text when not loading
}: Props) {
    return (
        <button
            type="submit"
            disabled={loading} // Disable button when loading
            className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md shadow-sm 
                       hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                       focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
        >
            {/* Show loading text if loading, otherwise show conditionalText */}
            {loading ? text : conditionalText}
        </button>
    );
}
