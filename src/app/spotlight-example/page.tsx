'use client';

import React from 'react';
import SpotlightCard from '../../components/SpotlightCard';

export default function SpotlightExample() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
      <h1 className="text-white text-5xl font-bold mb-12">Spotlight Card</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Default Spotlight Card */}
        <SpotlightCard>
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-white">Default Card</h2>
            <p className="text-gray-300">
              This card uses the default spotlight color effect when you hover over it.
            </p>
          </div>
        </SpotlightCard>

        {/* Custom Spotlight Card - Blue */}
        <SpotlightCard 
          spotlightColor="rgba(0, 229, 255, 0.2)"
          className="custom-spotlight-card"
        >
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-white">Blue Spotlight</h2>
            <p className="text-gray-300">
              This card has a custom blue spotlight color.
            </p>
          </div>
        </SpotlightCard>

        {/* Custom Spotlight Card - Purple */}
        <SpotlightCard 
          spotlightColor="rgba(147, 51, 234, 0.2)"
        >
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-white">Purple Spotlight</h2>
            <p className="text-gray-300">
              This card has a custom purple spotlight color.
            </p>
            <button 
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Click Me
            </button>
          </div>
        </SpotlightCard>

        {/* Custom Spotlight Card - Green */}
        <SpotlightCard 
          spotlightColor="rgba(16, 185, 129, 0.2)"
        >
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-white">Green Spotlight</h2>
            <p className="text-gray-300">
              This card has a custom green spotlight color effect.
            </p>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-gray-800 rounded-full text-gray-300 text-sm">Tag 1</span>
              <span className="px-3 py-1 bg-gray-800 rounded-full text-gray-300 text-sm">Tag 2</span>
              <span className="px-3 py-1 bg-gray-800 rounded-full text-gray-300 text-sm">Tag 3</span>
            </div>
          </div>
        </SpotlightCard>
      </div>

      {/* Add a hero-style card */}
      <div className="mt-16 w-full max-w-4xl">
        <SpotlightCard 
          spotlightColor="rgba(236, 72, 153, 0.25)"
          className="p-12"
        >
          <div className="flex flex-col gap-6 items-center text-center">
            <h2 className="text-4xl font-bold text-white">Boost Your Experience</h2>
            <p className="text-xl text-gray-300 max-w-2xl">
              Get exclusive benefits, features & 24/7 support as a permanent club member.
            </p>
            <button className="mt-4 px-8 py-3 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition-colors">
              Join now
            </button>
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
} 