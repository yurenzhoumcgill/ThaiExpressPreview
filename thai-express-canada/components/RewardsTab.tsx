
import React, { useState } from 'react';
import { QrCode, Copy, ScanLine, Ticket, Gift, Percent, Clock, ChevronRight } from 'lucide-react';
import ScanTab from './ScanTab';

const RewardsTab: React.FC = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [activeView, setActiveView] = useState<'membership' | 'offers'>('membership');
  const memberId = "8821 9932 4410";

  // Mock Offers Data
  const activeOffers = [
      {
          id: 1,
          title: "Free Imperial Roll",
          description: "Valid with any main dish purchase of $15 or more.",
          expiry: "Expires in 3 days",
          type: "food",
          code: "ROLL2025"
      },
      {
          id: 2,
          title: "$5 Off Reward",
          description: "You've earned 75 points! Enjoy $5 off your next order.",
          expiry: "Valid until used",
          type: "money",
          code: "5OFF75"
      },
      {
          id: 3,
          title: "Double Points Day",
          description: "Earn 2x points on all Curries today only.",
          expiry: "Expires tonight",
          type: "promo",
          code: "AUTO-APPLIED"
      }
  ];

  const MembershipView = () => (
      <div className="flex-1 px-6 pt-4 flex flex-col items-center animate-in slide-in-from-left duration-300">
        {/* Digital Card */}
        <div className="w-full max-w-sm bg-brand-green rounded-2xl p-6 text-white shadow-xl relative overflow-hidden shrink-0">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-thai-lime opacity-10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-thai-lime opacity-10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 flex flex-col items-center">
                <div className="flex items-center gap-2 mb-6 self-start">
                     <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                        <span className="text-pink-400 text-sm">🪷</span>
                     </div>
                     <span className="font-sans font-bold text-lg tracking-wider">Thai express</span>
                </div>

                <div className="bg-white p-4 rounded-xl mb-6 shadow-inner w-48 h-48 flex items-center justify-center">
                     <img 
                        src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ThaiExpressRewardsMember123&color=1b422a" 
                        alt="Member QR Code" 
                        className="w-full h-full"
                    />
                </div>

                <div className="text-center mb-2">
                    <p className="text-thai-lime text-xs uppercase tracking-widest font-bold mb-1">Member ID</p>
                    <div className="flex items-center justify-center gap-2">
                        <p className="font-mono text-xl tracking-widest">{memberId}</p>
                        <button className="text-thai-lime opacity-70 hover:opacity-100">
                            <Copy size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Scan Buttons */}
        <div className="w-full max-w-sm space-y-3 mt-6">
            <button 
                onClick={() => setShowScanner(true)}
                className="w-full bg-white border-2 border-dashed border-brand-green/30 rounded-xl p-4 flex items-center justify-center gap-3 hover:bg-brand-green/5 transition-colors group"
            >
                <div className="bg-brand-green/10 p-2 rounded-full group-hover:bg-brand-green group-hover:text-white transition-colors text-brand-green">
                    <ScanLine size={20} />
                </div>
                <div className="text-left">
                    <span className="block font-bold text-brand-green text-sm">Scan Receipt</span>
                    <span className="block text-xs text-gray-500">Add points from paper receipt</span>
                </div>
            </button>
            
            <button 
                onClick={() => setShowScanner(true)}
                className="w-full bg-[#333] text-white rounded-xl p-4 flex items-center justify-center gap-3 hover:bg-black transition-colors shadow-lg"
            >
                <div className="bg-white/10 p-2 rounded-full text-thai-lime">
                    <Users size={20} />
                </div>
                <div className="text-left">
                    <span className="block font-bold text-sm">Scan to Join Party</span>
                    <span className="block text-xs text-gray-400">Join a Group Order Lobby</span>
                </div>
            </button>
        </div>

        {/* Points Summary */}
        <div className="mt-8 text-center px-4 shrink-0 w-full max-w-sm">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex justify-between items-center">
                <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Current Balance</p>
                    <p className="text-2xl font-bold text-brand-green">50 pts</p>
                </div>
                <div className="h-10 w-px bg-gray-200"></div>
                <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase font-bold">Next Reward</p>
                    <p className="text-sm font-bold text-gray-800">$5 Off (75 pts)</p>
                </div>
            </div>
        </div>
      </div>
  );

  const OffersView = () => (
      <div className="flex-1 px-4 pt-4 pb-20 animate-in slide-in-from-right duration-300 w-full max-w-md mx-auto">
          {/* Active Offers Section */}
          <h3 className="font-bold text-gray-900 mb-4 px-2">Available Rewards</h3>
          <div className="space-y-4">
              {activeOffers.map((offer) => (
                  <div key={offer.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-4 relative overflow-hidden group">
                      {/* Left Icon Strip */}
                      <div className={`w-20 rounded-lg flex items-center justify-center shrink-0 ${
                          offer.type === 'food' ? 'bg-orange-50 text-orange-500' :
                          offer.type === 'money' ? 'bg-green-50 text-brand-green' :
                          'bg-purple-50 text-purple-500'
                      }`}>
                          {offer.type === 'food' && <Gift size={32} />}
                          {offer.type === 'money' && <Ticket size={32} />}
                          {offer.type === 'promo' && <Percent size={32} />}
                      </div>

                      {/* Content */}
                      <div className="flex-1 py-1">
                          <h4 className="font-bold text-gray-900">{offer.title}</h4>
                          <p className="text-xs text-gray-500 mb-3 leading-relaxed">{offer.description}</p>
                          
                          <div className="flex justify-between items-end">
                              <p className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                                  <Clock size={10} /> {offer.expiry}
                              </p>
                              <button className="text-xs font-bold text-white bg-brand-green px-4 py-1.5 rounded-full shadow-sm hover:bg-[#143320] transition-colors">
                                  USE NOW
                              </button>
                          </div>
                      </div>
                  </div>
              ))}
          </div>

          {/* Promo Code Input */}
          <div className="mt-8 px-2">
              <h3 className="font-bold text-gray-900 mb-3">Add Promo Code</h3>
              <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter code" 
                    className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-green"
                  />
                  <button className="bg-gray-900 text-white font-bold px-6 py-3 rounded-xl text-sm">
                      APPLY
                  </button>
              </div>
          </div>
      </div>
  );

  return (
    <div className="flex flex-col min-h-screen pb-24 bg-brand-cream">
      {/* Header */}
      <header className="px-6 pt-12 pb-2 bg-brand-cream sticky top-0 z-10">
        <h1 className="text-center font-bold text-xl text-brand-green font-serif mb-4">Rewards</h1>
        
        {/* Toggle Switch */}
        <div className="bg-gray-200 p-1 rounded-xl flex shadow-inner max-w-sm mx-auto">
            <button 
                onClick={() => setActiveView('membership')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                    activeView === 'membership' 
                    ? 'bg-white text-brand-green shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                My Card
            </button>
            <button 
                onClick={() => setActiveView('offers')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                    activeView === 'offers' 
                    ? 'bg-white text-brand-green shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                Offers
            </button>
        </div>
      </header>

      {/* Content */}
      {activeView === 'membership' ? <MembershipView /> : <OffersView />}

      {/* Scanner Overlay */}
      {showScanner && <ScanTab onClose={() => setShowScanner(false)} />}
    </div>
  );
};

// Helper for Offers View
import { Users } from 'lucide-react';

export default RewardsTab;
