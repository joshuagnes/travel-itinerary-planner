import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Share2 } from 'lucide-react';
import LinkComponent from '../components/Link';

export function Home() {
  return (
    <div className="space-y-16">
      <section className="text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900">
          Plan Your Perfect Journey
        </h1>
        <p className="mt-4 text-xl text-black-600 max-w-2xl mx-auto">
          Create detailed travel itineraries, track your destinations, and share your adventures with friends and family.
        </p>
        <div className="mt-8">
          <Link
            to="/signup"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center p-6">
          <div className="mx-auto h-12 w-12 text-blue-600">
            <MapPin className="h-full w-full" />
          </div>
          <h3 className="mt-4 text-xl font-semibold text-gray-900">Plan Destinations</h3>
          <p className="mt-2 text-gray-600">
            Add multiple destinations to your trip with detailed information and notes.
          </p>
        </div>
        <div className="text-center p-6">
          <div className="mx-auto h-12 w-12 text-blue-600">
            <Calendar className="h-full w-full" />
          </div>
          <h3 className="mt-4 text-xl font-semibold text-gray-900">Manage Schedule</h3>
          <p className="mt-2 text-gray-600">
            Organize your travel dates and create detailed day-by-day itineraries.
          </p>
        </div>
        <div className="text-center p-6">
          <div className="mx-auto h-12 w-12 text-blue-600">
            <Share2 className="h-full w-full" />
          </div>
          <h3 className="mt-4 text-xl font-semibold text-gray-900">Share & Collaborate</h3>
          <p className="mt-2 text-gray-600">
            Share your travel plans with friends and family or get inspiration from others.
          </p>
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="relative h-96">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80"
            alt="Travel Planning"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-blue-600/20 flex items-center">
            <div className="px-8 sm:px-12 max-w-lg">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Start Planning Your Next Adventure
              </h2>
              <p className="mt-4 text-lg text-blue-100">
                Join thousands of travelers who use TravelPlanner to create unforgettable journeys.
              </p>

              <LinkComponent
                to="/login"
                text="Sign In to Begin"
                className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}