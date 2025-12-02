
import React from 'react';
import { Home, Utensils, User, QrCode } from 'lucide-react';
import { Tab } from '../types';

interface BottomNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const navItems: { id: Tab; label: string; icon: React.FC<any> }[] = [
    { id: 'Home', label: 'Home', icon: Home },
    { id: 'Rewards', label: 'Rewards', icon: QrCode },
    { id: 'Order', label: 'Order', icon: Utensils },
    { id: 'Account', label: 'Account', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe pt-2 px-4 z-50 h-[85px] flex justify-between items-start shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`flex flex-col items-center justify-center flex-1 pt-1 ${
            activeTab === item.id 
              ? 'text-brand-green' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {/* For the "Order" tab, simulate the filled style if active, otherwise outline */}
          <div className={`p-1 rounded-md transition-all duration-200 ${activeTab === item.id && item.id === 'Order' ? 'bg-brand-green text-white' : ''}`}>
             <item.icon 
                size={24} 
                strokeWidth={activeTab === item.id ? 2.5 : 2} 
                className={activeTab === item.id && item.id === 'Order' ? 'text-white' : ''}
            />
          </div>
          <span className={`text-[11px] mt-1 font-medium ${activeTab === item.id ? 'font-bold' : ''}`}>
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;