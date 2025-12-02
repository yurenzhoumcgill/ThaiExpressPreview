
import React, { useState } from 'react';
import { 
  User, MapPin, CreditCard, FileText, Gift, Users, Mail, HelpCircle, LogOut, ChevronRight, ChevronLeft, Calendar, Trash2, Edit2, Plus, AlertTriangle, CheckCircle, AlertCircle
} from 'lucide-react';
import { ALLERGENS } from '../constants';

type AccountView = 'main' | 'profile' | 'addresses' | 'payments' | 'history' | 'gift' | 'refer' | 'contact' | 'faq' | 'allergies';

interface AccountTabProps {
    userAllergies?: string[];
    onToggleAllergy?: (allergen: string) => void;
}

const AccountTab: React.FC<AccountTabProps> = ({ userAllergies = [], onToggleAllergy }) => {
  const [currentView, setCurrentView] = useState<AccountView>('main');
  const [direction, setDirection] = useState<'forward' | 'backward' | 'none'>('none');

  const navigateTo = (view: AccountView) => {
    setDirection('forward');
    setCurrentView(view);
  };

  const handleBack = () => {
    setDirection('backward');
    setCurrentView(currentView === 'allergies' ? 'profile' : 'main');
  };

  // Helper to render header for sub-pages
  const Header = ({ title }: { title: string }) => (
    <div className="px-4 pt-12 pb-4 flex items-center relative border-b border-gray-100 bg-white sticky top-0 z-10">
      <button 
        onClick={handleBack}
        className="absolute left-4 p-1 text-brand-green hover:bg-gray-50 rounded-full transition-colors"
      >
        <ChevronLeft size={28} />
      </button>
      <h1 className="w-full text-center font-bold text-base tracking-widest uppercase text-gray-800">
        {title}
      </h1>
    </div>
  );

  // --- SUB-PAGES ---

  const AllergiesView = () => (
    <div className="flex flex-col min-h-screen bg-brand-cream pb-24 animate-in slide-in-from-right duration-300">
        <Header title="Allergies & Dietary" />
        <div className="p-6">
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex gap-3 items-start">
                <AlertCircle className="text-orange-500 shrink-0 mt-0.5" size={20} />
                <div>
                    <h3 className="font-bold text-orange-700 text-sm">Menu Warning</h3>
                    <p className="text-xs text-orange-600 leading-relaxed">
                        Selecting allergens here will highlight menu items that contain them with a red outline. Please always inform restaurant staff of severe allergies.
                    </p>
                </div>
            </div>

            <h3 className="font-bold text-gray-900 mb-4">Select Your Allergies</h3>
            <div className="grid grid-cols-2 gap-3">
                {ALLERGENS.map((allergen) => {
                    const isSelected = userAllergies.includes(allergen);
                    return (
                        <button 
                            key={allergen} 
                            onClick={() => onToggleAllergy && onToggleAllergy(allergen)}
                            className={`p-4 rounded-xl border-2 flex items-center justify-between transition-all duration-200 ${
                                isSelected 
                                ? 'bg-red-50 border-red-500 shadow-sm' 
                                : 'bg-white border-transparent hover:border-gray-200 shadow-sm'
                            }`}
                        >
                            <span className={`font-medium ${isSelected ? 'text-red-700 font-bold' : 'text-gray-700'}`}>{allergen}</span>
                            {isSelected && <CheckCircle className="text-red-500" size={18} />}
                        </button>
                    );
                })}
            </div>
        </div>
    </div>
  );

  const ProfileView = () => (
    <div className="flex flex-col min-h-screen bg-brand-cream pb-24 animate-in slide-in-from-right duration-300">
      <Header title="Profile" />
      <div className="p-6 space-y-6">
         <div className="space-y-4">
            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">First Name</label>
                <input type="text" defaultValue="Yuren" className="w-full bg-transparent border-b border-gray-300 py-2 text-gray-900 focus:border-brand-green focus:outline-none" />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Last Name</label>
                <input type="text" defaultValue="Zhou" className="w-full bg-transparent border-b border-gray-300 py-2 text-gray-900 focus:border-brand-green focus:outline-none" />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                <input type="email" defaultValue="zyr1076201044@gmail.com" className="w-full bg-transparent border-b border-gray-300 py-2 text-gray-900 focus:border-brand-green focus:outline-none" />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                <input type="tel" defaultValue="514-212-7585" className="w-full bg-transparent border-b border-gray-300 py-2 text-gray-900 focus:border-brand-green focus:outline-none" />
            </div>
            <div className="space-y-1 relative">
                <label className="text-xs font-bold text-gray-500 uppercase">Zip Code</label>
                <input type="text" className="w-full bg-transparent border-b border-gray-300 py-2 text-gray-900 focus:border-brand-green focus:outline-none" />
                <MapPin className="absolute right-0 bottom-2 text-gray-400" size={20} />
            </div>
            <div className="space-y-1 relative">
                <label className="text-xs font-bold text-gray-500 uppercase">Birthday</label>
                <input type="text" className="w-full bg-transparent border-b border-gray-300 py-2 text-gray-900 focus:border-brand-green focus:outline-none" />
                <Calendar className="absolute right-0 bottom-2 text-gray-400" size={20} />
            </div>
         </div>

         {/* Allergies Button */}
         <button 
            onClick={() => navigateTo('allergies')}
            className="w-full py-4 flex justify-between items-center border-b border-gray-200 text-gray-800"
         >
            <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-full text-orange-600">
                    <AlertTriangle size={18} />
                </div>
                <span className="font-medium">Allergies & Dietary</span>
            </div>
            <div className="flex items-center gap-2">
                {userAllergies.length > 0 && <span className="text-xs font-bold text-red-500">{userAllergies.length} Selected</span>}
                <ChevronRight size={20} className="text-gray-400" />
            </div>
         </button>

         <button className="w-full py-4 flex justify-between items-center border-b border-gray-200 text-gray-800">
            <span className="font-medium">Communication preferences</span>
            <ChevronRight size={20} className="text-gray-400" />
         </button>

         <button className="w-full py-4 flex justify-between items-center text-red-600 mt-4">
            <span className="font-medium">Delete profile</span>
            <ChevronRight size={20} className="text-red-300" />
         </button>
         
         <button className="w-full mt-8 bg-brand-green text-white font-bold py-3 rounded-md shadow-md">
            SAVE CHANGES
         </button>
      </div>
    </div>
  );

  const AddressesView = () => (
    <div className="flex flex-col min-h-screen bg-brand-cream pb-24 animate-in slide-in-from-right duration-300">
      <Header title="Delivery Addresses" />
      <div className="p-4 space-y-4">
         <button className="w-full bg-white border border-gray-200 p-4 rounded-lg flex items-center gap-3 text-gray-600 hover:bg-gray-50 transition-colors">
            <Plus size={20} />
            <span className="font-medium">Add new address</span>
         </button>

         {/* Saved Address Card */}
         <div className="bg-[#333] text-white p-6 rounded-lg shadow-md">
             <p className="font-medium text-lg mb-1">1201-950 Rue St-Antoine O</p>
             <p className="text-gray-300 text-sm">Montréal, H3C 1B3</p>
             <p className="text-gray-300 text-sm mb-6">QC, CA</p>
             
             <div className="flex justify-end gap-6 text-sm font-bold tracking-wide text-thai-lime">
                 <button>EDIT</button>
                 <button>DELETE</button>
             </div>
         </div>
      </div>
    </div>
  );

  const PaymentsView = () => (
    <div className="flex flex-col min-h-screen bg-brand-cream pb-24 animate-in slide-in-from-right duration-300">
      <Header title="Payment Methods" />
      <div className="p-4 space-y-3">
          <button className="w-full bg-[#333] text-white p-4 rounded-lg flex justify-between items-center shadow-md">
             <div className="flex items-center gap-3">
                <CreditCard size={20} className="text-gray-300" />
                <span>Add credit / debit card</span>
             </div>
             <span className="text-thai-lime font-bold text-sm">ADD</span>
          </button>
          
          <button className="w-full bg-[#333] text-white p-4 rounded-lg flex justify-between items-center shadow-md">
             <div className="flex items-center gap-3">
                <Gift size={20} className="text-gray-300" />
                <span>Add Thai Express gift card</span>
             </div>
             <span className="text-thai-lime font-bold text-sm">ADD</span>
          </button>

          <div className="mt-8">
             <p className="text-xs font-bold text-gray-500 uppercase mb-2 border-b border-gray-300 pb-2">Payment Methods</p>
             <div className="flex items-center gap-3 py-4">
                <div className="bg-black text-white px-2 py-1 rounded text-xs font-bold border border-gray-600"> Pay</div>
                <span className="text-gray-800 font-medium">Apple Pay</span>
             </div>
          </div>
      </div>
    </div>
  );

  const HistoryView = () => (
    <div className="flex flex-col min-h-screen bg-brand-cream pb-24 animate-in slide-in-from-right duration-300">
      <Header title="Order History" />
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center -mt-20">
         {/* Empty State Icon */}
         <div className="w-24 h-24 bg-thai-lime rounded-xl flex items-center justify-center mb-6 rotate-3 shadow-lg relative">
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-brand-green rounded-full flex items-center justify-center border-2 border-white">
                <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            </div>
            <FileText size={48} className="text-brand-green" />
         </div>
         
         <p className="text-gray-800 font-medium mb-2">You do not have any past orders yet.</p>
         <p className="text-gray-500 text-sm mb-8">Your online orders will appear here.</p>
         
         <button className="bg-brand-green text-white font-bold py-3 px-12 rounded-full shadow-md hover:bg-[#143320] transition-all">
            ORDER NOW
         </button>
      </div>
    </div>
  );

  // Placeholder for other pages
  const GenericPage = ({ title, icon: Icon }: { title: string, icon: any }) => (
    <div className="flex flex-col min-h-screen bg-brand-cream pb-24 animate-in slide-in-from-right duration-300">
        <Header title={title} />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
            <Icon size={64} className="mb-4 opacity-20" />
            <p>This feature is coming soon.</p>
        </div>
    </div>
  );


  // --- MAIN LIST VIEW ---

  const MenuRow = ({ icon: Icon, label, onClick, isRed = false }: { icon: any, label: string, onClick: () => void, isRed?: boolean }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center justify-between p-4 bg-white border-b border-gray-50 hover:bg-gray-50 transition-colors group`}
    >
        <div className="flex items-center gap-4">
            <div className={`p-2 rounded-full ${isRed ? 'bg-red-50' : 'bg-gray-50'} group-hover:scale-110 transition-transform`}>
                <Icon size={20} className={isRed ? 'text-red-500' : 'text-brand-green'} />
            </div>
            <span className={`font-medium ${isRed ? 'text-red-600' : 'text-gray-800'}`}>{label}</span>
        </div>
        <ChevronRight size={18} className="text-gray-300" />
    </button>
  );

  if (currentView === 'main') {
    return (
        <div className={`flex flex-col min-h-screen bg-brand-cream pb-24 ${direction === 'backward' ? 'animate-in slide-in-from-left duration-300' : ''}`}>
            {/* Header */}
            <div className="px-6 pt-14 pb-8 bg-brand-cream">
                <h1 className="text-3xl font-serif font-bold text-brand-green mb-1">Account</h1>
                <p className="text-gray-500 text-sm">Manage your profile and preferences</p>
            </div>

            <div className="flex-1">
                {/* Group 1 */}
                <div className="mb-6 border-t border-b border-gray-100 shadow-sm">
                    <MenuRow icon={User} label="Profile" onClick={() => navigateTo('profile')} />
                    <MenuRow icon={MapPin} label="Delivery addresses" onClick={() => navigateTo('addresses')} />
                    <MenuRow icon={CreditCard} label="Payment methods" onClick={() => navigateTo('payments')} />
                </div>

                {/* Group 2 */}
                <div className="mb-6 border-t border-b border-gray-100 shadow-sm">
                    <MenuRow icon={FileText} label="Order history" onClick={() => navigateTo('history')} />
                </div>

                {/* Group 3 */}
                <div className="mb-6 border-t border-b border-gray-100 shadow-sm">
                    <MenuRow icon={Gift} label="Send gift" onClick={() => navigateTo('gift')} />
                    <MenuRow icon={Users} label="Refer a friend" onClick={() => navigateTo('refer')} />
                    <MenuRow icon={Mail} label="Contact us" onClick={() => navigateTo('contact')} />
                    <MenuRow icon={HelpCircle} label="FAQ" onClick={() => navigateTo('faq')} />
                </div>

                {/* Legal & Logout */}
                <div className="px-4 space-y-4 mb-8">
                    <button className="text-sm text-gray-500 hover:text-brand-green block">Privacy policy</button>
                    <button className="text-sm text-gray-500 hover:text-brand-green block">Terms & Conditions</button>
                    <button className="text-sm text-gray-500 hover:text-brand-green block">Franchising</button>
                </div>

                <div className="border-t border-gray-100 shadow-sm mb-8">
                    <MenuRow icon={LogOut} label="Log out" onClick={() => {}} isRed />
                </div>
                
                <div className="text-center text-xs text-gray-300 pb-4 font-mono">
                    v2.4.0 (Build 2023)
                </div>
            </div>
        </div>
    );
  }

  // Render sub-views
  switch (currentView) {
    case 'profile': return <ProfileView />;
    case 'allergies': return <AllergiesView />;
    case 'addresses': return <AddressesView />;
    case 'payments': return <PaymentsView />;
    case 'history': return <HistoryView />;
    case 'gift': return <GenericPage title="Send Gift" icon={Gift} />;
    case 'refer': return <GenericPage title="Refer a Friend" icon={Users} />;
    case 'contact': return <GenericPage title="Contact Us" icon={Mail} />;
    case 'faq': return <GenericPage title="FAQ" icon={HelpCircle} />;
    default: return null;
  }
};

export default AccountTab;
