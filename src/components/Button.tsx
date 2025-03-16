import React from 'react'

type Props = {
    loading: boolean,
    text: string,
    conditionalText?: string,
}

export default function Button({ 
    loading,
    text,
    conditionalText = 'Sign in',
    // conditionalText = 'Sign up',
}: Props) {
    return (
        <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
        >
            {loading ? text : conditionalText}
        </button>
    )
}