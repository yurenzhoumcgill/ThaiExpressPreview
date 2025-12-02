
import React, { useState } from 'react';
import { Info, ChevronRight, Clock, CheckCircle, Truck, Utensils, X, HelpCircle, Gift, Lock, Flame, Trophy, Sparkles, ArrowRight, Scroll, Ticket, Scan, Copy, Share2 } from 'lucide-react';
import { ActiveOrder } from '../types';

interface HomeTabProps {
  activeOrder: ActiveOrder | null;
  onTrackOrder: () => void;
  onStartOrder: () => void;
}

const HomeTab: React.FC<HomeTabProps> = ({ activeOrder, onTrackOrder, onStartOrder }) => {
  const [showInfoModal, setShowInfoModal] = useState(false);
  
  // Campaign State
  const [showCampaignDetail, setShowCampaignDetail] = useState(false); // Controls the full vertical view
  const [showCampaignRules, setShowCampaignRules] = useState(false);   // Controls the popup
  const [hasSeenRules, setHasSeenRules] = useState(false);             // Tracks first-time entry
  
  // Assume user has logged in for all 3 days -> All boxes collected
  const [collectionStatus, setCollectionStatus] = useState({
      day1: true,
      day2: true,
      day3: true
  });
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState<{show: boolean, item: string, code: string} | null>(null);
  
  const getStatusConfig = (status: string) => {
    switch(status) {
        case 'confirmed': return { label: 'Order Confirmed', icon: CheckCircle, color: 'text-gray-600' };
        case 'preparing': return { label: 'Preparing your order', icon: Utensils, color: 'text-orange-500' };
        case 'ontheway': return { label: 'Order on the way', icon: Truck, color: 'text-blue-500' };
        case 'delivered': return { label: 'Delivered', icon: CheckCircle, color: 'text-green-600' };
        default: return { label: 'Processing', icon: Clock, color: 'text-gray-500' };
    }
  };

  const handleJoinCampaign = () => {
      setShowCampaignDetail(true);
      // If first time, show rules immediately
      if (!hasSeenRules) {
          setShowCampaignRules(true);
          setHasSeenRules(true);
      }
  };

  const handleShareCampaign = (e: React.MouseEvent) => {
      e.stopPropagation();
      alert("Shared to social media! (Simulation)");
  };

  const openCoupon = (item: string, code: string) => {
      setShowCouponModal({ show: true, item, code });
  };

  return (
    <div className="flex flex-col pb-24 relative bg-brand-cream min-h-screen">
       {/* TOP LOGO - Image Removed */}
       <div className="bg-brand-cream pt-12 pb-2 flex justify-center sticky top-0 z-40 shadow-sm/50 backdrop-blur-sm">
           {/* Logo placeholder if needed, currently empty to remove broken image */}
       </div>

       {/* Info Modal Overlay (General Rewards) */}
       {showInfoModal && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center pointer-events-none">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto animate-in fade-in duration-300"
            onClick={() => setShowInfoModal(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="bg-white w-full max-w-md h-[85vh] sm:h-auto sm:max-h-[80vh] rounded-t-2xl sm:rounded-2xl shadow-2xl z-10 flex flex-col pointer-events-auto animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="font-serif font-bold text-xl text-brand-green">Thai Rewards Info</h2>
              <button 
                onClick={() => setShowInfoModal(false)} 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 space-y-8 no-scrollbar">
              {/* How it works */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="text-thai-lime" size={24} />
                  <h3 className="font-bold text-lg text-gray-900">How it Works</h3>
                </div>
                <ul className="space-y-4 text-sm text-gray-600">
                  <li className="flex gap-3">
                    <span className="font-bold text-brand-green bg-brand-green/10 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">1</span>
                    <span>Earn <strong>1 point</strong> for every $1 spent on eligible purchases at Thai Express locations.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-brand-green bg-brand-green/10 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">2</span>
                    <span>Reach <strong>75 points</strong> to unlock a $5 discount reward.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-brand-green bg-brand-green/10 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">3</span>
                    <span>Scan your member QR code at the register or order via the app to collect points automatically.</span>
                  </li>
                </ul>
              </section>

              {/* Birthday Reward */}
              <section className="bg-pink-50 p-4 rounded-xl border border-pink-100">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🎂</span>
                  <h3 className="font-bold text-brand-green">Birthday Reward</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Celebrate with us! Members receive a <strong>$10 birthday reward</strong> every year. Valid for 30 days starting from your birthday.
                </p>
              </section>

              {/* Facts/Q&A */}
              <section>
                <h3 className="font-bold text-lg text-gray-900 mb-4">Did You Know?</h3>
                 <div className="bg-gray-50 p-4 rounded-lg mb-3">
                    <p className="font-bold text-sm text-brand-green mb-1">Do points expire?</p>
                    <p className="text-xs text-gray-500">Points expire after 12 months of inactivity. Make a purchase to keep them active!</p>
                 </div>
                 <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-bold text-sm text-brand-green mb-1">Can I split payments?</p>
                    <p className="text-xs text-gray-500">Yes! You can redeem rewards and pay the remaining balance with cash or card.</p>
                 </div>
              </section>
            </div>
            
            <div className="p-4 border-t border-gray-100">
               <button 
                 onClick={() => setShowInfoModal(false)}
                 className="w-full bg-brand-green text-white font-bold py-3 rounded-xl hover:bg-[#143320] transition-colors"
               >
                 GOT IT
               </button>
            </div>
          </div>
        </div>
       )}

       {/* Campaign Rules Modal - Z-Index Higher than Campaign Detail */}
       {showCampaignRules && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
             <div 
                className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={() => setShowCampaignRules(false)}
             ></div>
             <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl z-10 overflow-hidden animate-in zoom-in-95 duration-300 relative border-2 border-[#FBBF24]">
                <div className="bg-[#A01D23] p-4 text-white text-center relative">
                    <h2 className="font-serif font-bold text-xl">The Songkran Drop</h2>
                    <p className="text-[#FBBF24] text-xs font-bold uppercase tracking-widest mt-1">Official Rules</p>
                    <button 
                        onClick={() => setShowCampaignRules(false)}
                        className="absolute top-4 right-4 text-white/70 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 bg-[#A01D23]/10 rounded-full flex items-center justify-center shrink-0 text-[#A01D23]">
                            <Gift size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-sm">1. Collect Daily</h3>
                            <p className="text-gray-500 text-xs mt-1">Log in Day 1, 2, and 3 to open your Mystery Boxes. Don't miss a day!</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-10 h-10 bg-[#A01D23]/10 rounded-full flex items-center justify-center shrink-0 text-[#A01D23]">
                            <Flame size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-sm">2. Light the Lanterns</h3>
                            <p className="text-gray-500 text-xs mt-1">Redeem your mystery coupons to "light up" a lantern. You have 7 days to use them.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-10 h-10 bg-[#FBBF24]/20 rounded-full flex items-center justify-center shrink-0 text-[#A01D23]">
                            <Trophy size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-sm">3. Win Grand Prize</h3>
                            <p className="text-gray-500 text-xs mt-1">Light all 3 lanterns to unlock the exclusive Physical Grand Prize.</p>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-100">
                    <button 
                        onClick={() => setShowCampaignRules(false)}
                        className="w-full bg-[#A01D23] text-white font-bold py-3 rounded-xl shadow-md"
                    >
                        GOT IT
                    </button>
                </div>
             </div>
        </div>
       )}

       {/* FULL SCREEN CAMPAIGN DETAIL (VERTICAL LAYOUT) */}
       {showCampaignDetail && (
           <div className="fixed inset-0 z-[70] bg-gray-900 text-white overflow-y-auto animate-in slide-in-from-bottom duration-300">
               {/* Header */}
               <div className="sticky top-0 bg-gray-900/95 backdrop-blur-md z-10 border-b border-white/10 px-4 py-4 flex justify-between items-center">
                   <h2 className="font-serif font-bold text-lg text-[#FBBF24]">The Songkran Drop</h2>
                   <div className="flex gap-3">
                       <button onClick={() => setShowCampaignRules(true)} className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
                           <HelpCircle size={14} /> Rules
                       </button>
                       <button onClick={() => setShowCampaignDetail(false)} className="bg-white/10 p-1 rounded-full">
                           <X size={20} />
                       </button>
                   </div>
               </div>

               {/* Vertical Timeline Content */}
               <div className="p-6 max-w-md mx-auto space-y-8 pb-20">
                    <p className="text-center text-sm text-gray-400">Collect Daily (Day 1-3) & Redeem (Day 1-7)</p>
                    
                    {/* Vertical Step Connector */}
                    <div className="relative space-y-8">
                        {/* Connecting Line */}
                        <div className="absolute top-4 left-4 bottom-4 w-0.5 bg-gradient-to-b from-[#FBBF24] via-[#14b8a6] to-[#ea580c] z-0"></div>

                        {/* --- DAY 1 --- */}
                        <div className="relative z-10 pl-12">
                            <div className="absolute top-0 left-0 w-8 h-8 rounded-full bg-[#fb923c] flex items-center justify-center font-bold text-black text-sm border-4 border-gray-900">1</div>
                            <div className="bg-[#1a1a1a] rounded-xl border border-[#fb923c]/50 p-4 shadow-[0_4px_20px_rgba(251,146,60,0.1)]">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-bold text-[#fb923c] text-lg">Day 1</h3>
                                    <span className="text-[10px] bg-[#fb923c]/20 text-[#fb923c] px-2 py-0.5 rounded font-bold uppercase">Collected</span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3">
                                    {/* Task 1: Box */}
                                    <button 
                                        onClick={() => openCoupon("Free Imperial Roll", "ROLL2025")}
                                        className="bg-[#2a2a2a] p-3 rounded-lg flex flex-col items-center gap-2 hover:bg-[#333] transition-colors"
                                    >
                                        <Gift size={24} className="text-[#fb923c]" />
                                        <span className="text-[10px] text-gray-300">View Coupon</span>
                                    </button>
                                    
                                    {/* Task 2: Lantern */}
                                    <div className="bg-[#2a2a2a] p-3 rounded-lg flex flex-col items-center gap-2 border border-[#14b8a6] relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-2 h-2 bg-[#14b8a6] rounded-full animate-ping"></div>
                                        <Flame size={24} className="text-[#14b8a6]" />
                                        <span className="text-[10px] text-[#14b8a6] font-bold text-center">Redeem to Light</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- DAY 2 --- */}
                        <div className="relative z-10 pl-12">
                            <div className="absolute top-0 left-0 w-8 h-8 rounded-full bg-[#FBBF24] flex items-center justify-center font-bold text-black text-sm border-4 border-gray-900">2</div>
                            <div className="bg-[#1a1a1a] rounded-xl border border-[#FBBF24]/50 p-4 shadow-[0_4px_20px_rgba(251,191,36,0.1)]">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-bold text-[#FBBF24] text-lg">Day 2</h3>
                                    <span className="text-[10px] bg-[#FBBF24]/20 text-[#FBBF24] px-2 py-0.5 rounded font-bold uppercase">Collected</span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3">
                                    <button 
                                        onClick={() => openCoupon("$0 Delivery Fee", "DELIVER0")}
                                        className="bg-[#2a2a2a] p-3 rounded-lg flex flex-col items-center gap-2 hover:bg-[#333] transition-colors"
                                    >
                                        <Gift size={24} className="text-[#FBBF24]" />
                                        <span className="text-[10px] text-gray-300">View Coupon</span>
                                    </button>
                                    <div className="bg-[#2a2a2a] p-3 rounded-lg flex flex-col items-center gap-2 border border-[#14b8a6]">
                                        <Flame size={24} className="text-[#14b8a6]" />
                                        <span className="text-[10px] text-[#14b8a6] font-bold text-center">Redeem to Light</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- DAY 3 --- */}
                        <div className="relative z-10 pl-12">
                            <div className="absolute top-0 left-0 w-8 h-8 rounded-full bg-[#ef4444] flex items-center justify-center font-bold text-white text-sm border-4 border-gray-900">3</div>
                            <div className="bg-[#1a1a1a] rounded-xl border border-[#ef4444]/50 p-4 shadow-[0_4px_20px_rgba(239,68,68,0.1)]">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-bold text-[#ef4444] text-lg">Day 3</h3>
                                    <span className="text-[10px] bg-[#ef4444]/20 text-[#ef4444] px-2 py-0.5 rounded font-bold uppercase">Collected</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <button 
                                        onClick={() => openCoupon("2x Points", "2XPOINTS")}
                                        className="bg-[#2a2a2a] p-3 rounded-lg flex flex-col items-center gap-2 hover:bg-[#333] transition-colors"
                                    >
                                        <Gift size={24} className="text-[#FBBF24]" />
                                        <span className="text-[10px] text-gray-300">View Coupon</span>
                                    </button>
                                    <div className="bg-[#2a2a2a] p-3 rounded-lg flex flex-col items-center gap-2 border border-[#14b8a6]">
                                        <Flame size={24} className="text-[#14b8a6]" />
                                        <span className="text-[10px] text-[#14b8a6] font-bold text-center">Redeem to Light</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                         {/* --- DAY 4-6 (Tasks) --- */}
                         <div className="relative z-10 pl-12 opacity-80">
                            <div className="absolute top-0 left-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center font-bold text-gray-300 text-sm border-4 border-gray-900">4-6</div>
                            <div className="bg-[#1a1a1a] rounded-xl border border-dashed border-gray-700 p-4">
                                <h3 className="font-bold text-gray-400 text-sm mb-3">Redemption Sprint</h3>
                                <div className="flex gap-2">
                                    <div className="flex-1 bg-[#222] p-2 rounded text-center">
                                        <Utensils size={16} className="text-gray-500 mx-auto mb-1" />
                                        <span className="text-[9px] text-gray-400">Visit Store</span>
                                    </div>
                                    <div className="flex-1 bg-[#222] p-2 rounded text-center">
                                        <Gift size={16} className="text-gray-500 mx-auto mb-1" />
                                        <span className="text-[9px] text-gray-400">Gift Coupon</span>
                                    </div>
                                    <div className="flex-1 bg-[#222] p-2 rounded text-center">
                                        <Clock size={16} className="text-gray-500 mx-auto mb-1" />
                                        <span className="text-[9px] text-gray-400">Check Time</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- GRAND PRIZE --- */}
                        <div className="relative z-10 pl-12">
                            <div className="absolute top-0 left-0 w-8 h-8 rounded-full bg-[#f59e0b] flex items-center justify-center font-bold text-white text-sm border-4 border-gray-900">
                                <Trophy size={14} />
                            </div>
                            <div className="bg-gradient-to-br from-[#f59e0b] to-[#ea580c] rounded-xl p-6 text-center shadow-lg relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                                <Trophy size={48} className="text-white mx-auto mb-3 drop-shadow-md" />
                                <h3 className="font-black text-white text-xl uppercase tracking-wide mb-1">Physical Grand Prize</h3>
                                <p className="text-white/80 text-xs font-bold mb-4">Unlock by lighting all 3 lanterns</p>
                                <div className="bg-black/20 rounded-full py-1 px-3 inline-flex items-center gap-2">
                                    <Lock size={12} className="text-white/50" />
                                    <span className="text-white text-[10px] uppercase font-bold">Locked</span>
                                </div>
                            </div>
                        </div>

                    </div>
               </div>
           </div>
       )}

       {/* Coupon Modal */}
       {showCouponModal && (
           <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
               <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowCouponModal(null)}></div>
               <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl z-10 overflow-hidden animate-in slide-in-from-bottom duration-300">
                   <div className="bg-brand-green p-4 flex justify-between items-center text-white">
                       <h3 className="font-bold text-lg">Active Coupon</h3>
                       <button onClick={() => setShowCouponModal(null)}><X size={24} /></button>
                   </div>
                   <div className="p-8 flex flex-col items-center text-center">
                       <div className="w-16 h-16 bg-thai-lime/20 rounded-full flex items-center justify-center mb-4">
                           <Ticket size={32} className="text-brand-green" />
                       </div>
                       <h2 className="text-2xl font-bold text-gray-900 mb-2">{showCouponModal.item}</h2>
                       <p className="text-sm text-gray-500 mb-6">Scan this code at the register or use it during checkout.</p>
                       
                       <div className="bg-gray-100 p-4 rounded-xl w-full mb-6 border-2 border-dashed border-gray-300">
                           {/* Mock Barcode */}
                           <div className="h-16 w-full bg-[url('https://images.unsplash.com/photo-1550989460-0adf9ea622e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-80 mb-2 grayscale"></div>
                           <p className="font-mono font-bold text-lg tracking-widest text-gray-800">{showCouponModal.code}</p>
                       </div>

                       <button 
                           onClick={() => { setShowCouponModal(null); setShowInfoModal(false); }}
                           className="w-full bg-[#A01D23] text-white font-bold py-3 rounded-xl shadow-lg hover:bg-[#80171c] transition-colors mb-3"
                       >
                           USE NOW
                       </button>
                       <p className="text-xs text-gray-400">Valid until April 20, 2025</p>
                   </div>
               </div>
           </div>
       )}

       {/* Reward Reveal Modal (Day 1) */}
       {showRewardModal && (
           <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
               <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-500"></div>
               <div className="relative bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-50 duration-500 text-center">
                   
                   {/* Confetti / Burst Background */}
                   <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
                   <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#FBBF24] to-white/0 opacity-30"></div>

                   <div className="p-8 relative z-10">
                       <div className="mb-4 inline-block relative">
                            <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-40 animate-pulse"></div>
                            <Gift size={64} className="text-[#A01D23] relative z-10 animate-bounce" />
                       </div>
                       
                       <h2 className="font-serif font-bold text-2xl text-[#A01D23] mb-2">You Unlocked a Reward!</h2>
                       <p className="text-gray-500 text-sm mb-6">Day 1 Mystery Box contained:</p>
                       
                       <div className="bg-brand-cream border-2 border-dashed border-[#A01D23]/30 rounded-xl p-4 mb-6 relative overflow-hidden">
                           <div className="flex items-center gap-4">
                               <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                                   <img 
                                        src="https://freepngimg.com/thumb/spring_roll/3-2-spring-roll-png-image.png" 
                                        alt="Imperial Roll" 
                                        className="w-full h-full object-contain" 
                                   />
                               </div>
                               <div className="text-left">
                                   <p className="font-bold text-brand-green text-lg">Free Imperial Roll</p>
                                   <p className="text-xs text-gray-500">With any main dish purchase</p>
                               </div>
                           </div>
                           
                           {/* Corner Ribbon Fix */}
                           <div className="absolute top-[12px] -right-[28px] w-[100px] bg-[#A01D23] text-white text-[10px] font-bold py-1 text-center rotate-45 shadow-sm">
                               FREE
                           </div>
                       </div>

                       <div className="space-y-3">
                           <button 
                                onClick={() => {
                                    setShowRewardModal(false);
                                    openCoupon('Free Imperial Roll', 'ROLL2025');
                                }}
                                className="w-full bg-[#A01D23] text-white font-bold py-3 rounded-xl shadow-lg hover:bg-[#8a181d] transition-colors"
                           >
                               COLLECT & VIEW COUPON
                           </button>
                           <p className="text-xs font-bold text-[#A01D23]">Redeem coupon to light the lantern</p>
                       </div>
                   </div>
               </div>
           </div>
       )}

      {/* Spacer for Top Safe Area */}
      <div className="pt-safe py-4"></div>

      {/* Welcome Message */}
      <div className="px-6 mb-4">
        <h1 className="text-3xl font-bold text-brand-green mb-1">Welcome, Yuren!</h1>
        <p className="text-gray-600">Unbox your luck today.</p>
      </div>

      {/* ACTIVE ORDER CARD (Appears if order exists) */}
      {activeOrder && activeOrder.status !== 'delivered' && (
          <div className="px-6 mb-8 animate-in slide-in-from-top duration-500">
             <button 
                onClick={onTrackOrder}
                className="w-full bg-white border border-brand-green/20 rounded-xl p-4 shadow-lg flex items-center justify-between group hover:border-brand-green transition-all"
             >
                <div className="flex items-center gap-4">
                    <div className="bg-brand-green/10 p-3 rounded-full animate-pulse">
                        {(() => {
                            const config = getStatusConfig(activeOrder.status);
                            const Icon = config.icon;
                            return <Icon size={24} className="text-brand-green" />;
                        })()}
                    </div>
                    <div className="text-left">
                        <p className="font-bold text-brand-green text-sm uppercase tracking-wide mb-0.5">In Progress</p>
                        <h3 className="font-bold text-lg text-gray-900">{getStatusConfig(activeOrder.status).label}</h3>
                        <p className="text-xs text-gray-500 mt-1">ETA: {activeOrder.eta}</p>
                    </div>
                </div>
                <div className="bg-brand-green text-white p-2 rounded-full group-hover:bg-thai-lime group-hover:text-brand-green transition-colors">
                    <ChevronRight size={20} />
                </div>
             </button>
          </div>
      )}

      {/* Loyalty Card */}
      <div className="px-4 mb-4">
        <div className="bg-brand-cream border border-gray-100 rounded-t-xl p-6 shadow-sm relative overflow-hidden">
           {/* Header with Rewards Label (Image Removed) */}
           <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-brand-green">Thai Rewards</h2>
                </div>
                <button 
                    onClick={() => setShowInfoModal(true)}
                    className="text-brand-green hover:bg-brand-green/10 p-2 -mr-2 -mt-2 rounded-full transition-colors cursor-pointer"
                >
                    <Info size={24} />
                </button>
          </div>

          <p className="text-brand-green font-bold text-5xl mt-2 mb-2">50 <span className="text-2xl font-normal">pts</span></p>

          <p className="text-gray-600 text-sm mb-6 max-w-[90%]">
            You have a welcome bonus! You are <strong>25 points</strong> away from a $5 discount.
          </p>

          <div className="relative h-3 bg-gray-200 rounded-full mb-2">
            <div className="absolute top-0 left-0 h-full w-[66.6%] bg-thai-lime rounded-full"></div>
            <div className="absolute top-0 left-0 h-full w-full flex justify-between px-[1px]">
                 <div className="h-full w-0.5 bg-white/50"></div>
                 <div className="h-full w-0.5 bg-white/50"></div>
                 <div className="h-full w-0.5 bg-white/50"></div>
                 <div className="h-full w-0.5 bg-white/50"></div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-400 font-mono mb-6">
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
          </div>

          <div className="flex justify-center">
             <button 
                onClick={() => setShowInfoModal(true)}
                className="bg-brand-green text-white font-bold py-3 px-8 rounded-full text-sm tracking-wide shadow-md hover:bg-[#143320] transition-colors"
             >
               VIEW DETAILS
             </button>
          </div>
        </div>
        <div className="bg-white h-4 rounded-b-xl shadow-sm mx-2"></div>
      </div>

      {/* Conversion CTA: Start Order */}
      <div className="px-4 mb-8">
          <button 
            onClick={onStartOrder}
            className="w-full bg-brand-green text-white font-bold py-4 rounded-xl shadow-lg hover:bg-[#143320] transition-colors flex items-center justify-center gap-2 border border-thai-lime/30"
          >
              <Utensils size={20} />
              START ORDER
          </button>
      </div>

      {/* THE SONGKRAN DROP - CAMPAIGN COVER CARD */}
      <div className="px-4 mb-10">
          <div className="bg-gradient-to-br from-[#A01D23] to-[#7f1318] rounded-2xl shadow-xl overflow-hidden relative">
              {/* Background Patterns */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FBBF24] opacity-20 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>
              
              <div className="p-6 relative z-10 text-center">
                  <div className="inline-flex items-center gap-1 bg-[#FBBF24] px-3 py-1 rounded-full text-[#A01D23] text-[10px] font-bold uppercase tracking-widest mb-3 shadow-md">
                        <Sparkles size={12} />
                        Limited Time
                  </div>
                  
                  <h2 className="font-serif font-bold text-3xl text-white mb-2 leading-tight drop-shadow-md">
                      The Songkran Drop
                  </h2>
                  <p className="text-white/80 text-sm mb-6 max-w-xs mx-auto">
                      Unbox daily mystery coupons & light lanterns to win the Grand Prize!
                  </p>
                  
                  <div className="flex gap-3 justify-center">
                      <button 
                         onClick={handleJoinCampaign}
                         className="bg-[#FBBF24] text-[#A01D23] font-black py-3 px-6 rounded-xl shadow-lg hover:bg-yellow-400 hover:scale-105 transition-all text-sm uppercase tracking-wider flex-1 max-w-[200px]"
                      >
                          Participate
                      </button>
                      <button 
                         onClick={handleShareCampaign}
                         className="bg-white/10 text-white p-3 rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm"
                         aria-label="Share Campaign"
                      >
                          <Share2 size={20} />
                      </button>
                  </div>
              </div>
          </div>
      </div>

    </div>
  );
};

export default HomeTab;
