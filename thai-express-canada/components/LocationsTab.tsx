import React, { useState } from 'react';
import { Search, List, MapPin, Navigation } from 'lucide-react';
import { LOCATIONS } from '../constants';

const LocationsTab: React.FC = () => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  return (
    <div className="flex flex-col h-screen pb-20 bg-brand-cream">
      {/* Top Bar */}
      <div className="px-4 pt-12 pb-4 bg-brand-cream z-10">
        <h1 className="text-center font-bold text-sm tracking-widest uppercase text-gray-800 mb-4">Locations</h1>
        
        {/* Toggle Switch */}
        <div className="bg-white rounded-full p-1 flex border border-gray-200 mb-4 shadow-sm">
          <button className="flex-1 bg-brand-green text-white py-2 rounded-full text-sm font-bold shadow-md transition-all">
            Pick up
          </button>
          <button className="flex-1 text-gray-500 py-2 rounded-full text-sm font-bold hover:bg-gray-50 transition-all">
            Delivery
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2">
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input 
                    type="text" 
                    placeholder="Search address" 
                    className="w-full pl-10 pr-4 py-3 bg-[#f0ece6] rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green/20 text-gray-800 placeholder-gray-500"
                />
            </div>
            <button 
                className="bg-[#f0ece6] p-3 rounded-md text-gray-800 hover:bg-gray-200"
                onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
            >
                <List size={24} />
            </button>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-blue-50">
         {/* Mock Map Background */}
         <div className="absolute inset-0 opacity-80" style={{
             backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/commons/e/ec/Ottawa_Location_Map.png)',
             backgroundSize: 'cover',
             backgroundPosition: 'center'
         }}></div>
         
         {/* Map Pins */}
         <div className="absolute top-1/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
            <MapPin className="text-brand-green fill-current" size={40} />
         </div>
         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
         </div>

         {/* Floating Buttons on Map */}
         <div className="absolute bottom-40 right-4">
            <button className="bg-white p-3 rounded-full shadow-lg text-brand-green">
                <Navigation size={24} fill="currentColor" />
            </button>
         </div>
         <div className="absolute top-4 left-4 flex gap-2">
             <button className="bg-brand-green text-white px-4 py-2 rounded-full text-sm font-bold shadow-md">Closest</button>
             <button className="bg-white text-gray-600 border border-gray-200 px-4 py-2 rounded-full text-sm font-bold shadow-sm">Favourites</button>
         </div>

         {/* Bottom Card Overlay */}
         <div className="absolute bottom-4 left-4 right-4 bg-white p-6 rounded-lg shadow-xl">
            <p className="text-gray-700 mb-8 text-lg">
                There are 3 Thai Express locations in your area.
            </p>
            <div className="flex justify-end">
                <button className="text-brand-green font-bold uppercase tracking-wide text-sm">
                    View Closest
                </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default LocationsTab;