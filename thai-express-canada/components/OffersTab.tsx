import React from 'react';
import { Gift } from 'lucide-react';

const OffersTab: React.FC = () => {
  return (
    <div className="flex flex-col h-screen pb-20 bg-brand-cream">
      <div className="pt-12 pb-4">
        <h1 className="text-center font-bold text-sm tracking-widest uppercase text-gray-800">Offers</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        {/* Illustration placeholder */}
        <div className="relative mb-8">
             <div className="w-32 h-32 rounded-full bg-gray-100 absolute -top-4 -left-4 animate-pulse"></div>
             <div className="w-20 h-20 rounded-full bg-thai-lime/20 absolute top-0 right-0"></div>
             <Gift size={120} className="text-thai-lime relative z-10" strokeWidth={1.5} />
        </div>
        
        <p className="text-gray-600 text-lg leading-relaxed">
            There are no offers available at the moment. Check again later.
        </p>
      </div>
    </div>
  );
};

export default OffersTab;