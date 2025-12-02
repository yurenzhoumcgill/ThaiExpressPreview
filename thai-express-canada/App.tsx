
import React, { useState, useEffect } from 'react';
import BottomNav from './components/BottomNav';
import HomeTab from './components/HomeTab';
import OrderTab from './components/OrderTab';
import AccountTab from './components/AccountTab';
import RewardsTab from './components/RewardsTab';
import { Tab, ActiveOrder, OrderStatus } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Home');
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(null);
  const [userAllergies, setUserAllergies] = useState<string[]>([]);

  // Simulation for order progress
  useEffect(() => {
    if (activeOrder && activeOrder.status !== 'delivered') {
      let timer: ReturnType<typeof setTimeout>;
      
      if (activeOrder.status === 'confirmed') {
        timer = setTimeout(() => {
            updateOrderStatus('preparing');
        }, 4000);
      } else if (activeOrder.status === 'preparing') {
        timer = setTimeout(() => {
            updateOrderStatus('ontheway');
        }, 8000);
      } else if (activeOrder.status === 'ontheway') {
        timer = setTimeout(() => {
            updateOrderStatus('delivered');
        }, 10000);
      }

      return () => clearTimeout(timer);
    }
  }, [activeOrder]);

  const updateOrderStatus = (status: OrderStatus) => {
    setActiveOrder(prev => prev ? { ...prev, status } : null);
  };

  const handlePlaceOrder = (order: ActiveOrder) => {
    setActiveOrder(order);
    // Automatically switch to Order tab to show tracking if not already there
    if (activeTab !== 'Order') {
        setActiveTab('Order');
    }
  };

  const handleTrackOrder = () => {
    setActiveTab('Order');
  };

  const toggleAllergy = (allergen: string) => {
      setUserAllergies(prev => 
          prev.includes(allergen) 
              ? prev.filter(a => a !== allergen)
              : [...prev, allergen]
      );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return <HomeTab 
          activeOrder={activeOrder} 
          onTrackOrder={handleTrackOrder} 
          onStartOrder={() => setActiveTab('Order')}
        />;
      case 'Rewards':
        return <RewardsTab />;
      case 'Order':
        return <OrderTab 
            activeOrder={activeOrder} 
            onPlaceOrder={handlePlaceOrder}
            userAllergies={userAllergies}
        />;
      case 'Account':
        return <AccountTab 
            userAllergies={userAllergies} 
            onToggleAllergy={toggleAllergy} 
        />;
      default:
        return <HomeTab 
          activeOrder={activeOrder} 
          onTrackOrder={handleTrackOrder} 
          onStartOrder={() => setActiveTab('Order')}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream text-gray-900 font-sans selection:bg-thai-lime selection:text-brand-green">
      <main className="max-w-md mx-auto min-h-screen bg-brand-cream relative shadow-2xl overflow-hidden">
        {renderContent()}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </main>
    </div>
  );
};

export default App;
