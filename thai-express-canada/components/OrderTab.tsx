
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Edit2, Heart, ShoppingBag, MapPin, Navigation, ArrowLeft, Search, ShoppingCart, CreditCard, CheckCircle, Plus, Minus, X, Clock, Star, Info, Phone, Truck, Utensils, Home, Store, Users, Share2, ToggleLeft, ToggleRight, Radar, QrCode, Check, AlertTriangle } from 'lucide-react';
import { CATEGORIES, MENU_ITEMS, LOCATIONS, PROTEIN_OPTIONS } from '../constants';
import { MenuItem, StoreLocation, ActiveOrder, ProteinOption, GroupParticipant, CartItem } from '../types';

// Declare Leaflet globally for TypeScript
declare const L: any;

type OrderStep = 'landing' | 'lobby' | 'map' | 'menu' | 'checkout' | 'tracking';
type OrderType = 'pickup' | 'delivery';
type PickupTiming = 'asap' | 'geofenced';

interface OrderTabProps {
    activeOrder?: ActiveOrder | null;
    onPlaceOrder?: (order: ActiveOrder) => void;
    userAllergies?: string[];
}

const OrderTab: React.FC<OrderTabProps> = ({ activeOrder, onPlaceOrder, userAllergies = [] }) => {
  // Navigation State
  const [step, setStep] = useState<OrderStep>('landing');
  const [orderType, setOrderType] = useState<OrderType>('pickup');
  
  // Group Order State
  const [isGroupOrder, setIsGroupOrder] = useState(false);
  const [splitBillMode, setSplitBillMode] = useState(false);
  const [participants, setParticipants] = useState<GroupParticipant[]>([]);
  const [lobbyCode, setLobbyCode] = useState('');

  // Selection State
  const [activeMapLocation, setActiveMapLocation] = useState<StoreLocation>(LOCATIONS[0]); // For map preview
  const [selectedLocation, setSelectedLocation] = useState<StoreLocation | null>(null); // Confirmed location
  const [selectedCategory, setSelectedCategory] = useState('favorites');
  const [pickupTiming, setPickupTiming] = useState<PickupTiming>('asap');
  
  // Customization State
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [selectedProtein, setSelectedProtein] = useState<ProteinOption | null>(null);
  
  // Favorites State
  const [quickFavorites, setQuickFavorites] = useState<string[]>([]);

  // Cart State (Current User)
  const [cart, setCart] = useState<CartItem[]>([]);
  const [deliveryFee, setDeliveryFee] = useState(0);

  // Map Refs
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // Tracking Map Refs
  const trackingMapRef = useRef<any>(null);
  const trackingMapContainerRef = useRef<HTMLDivElement>(null);
  
  // Listen for external active order changes to trigger tracking view
  useEffect(() => {
    if (activeOrder) {
        setStep('tracking');
    }
  }, [activeOrder]);

  // --- SIMULATION LOGIC FOR GROUP LOBBY ---
  useEffect(() => {
      // Phase 1: People Joining (Lobby View)
      if (step === 'lobby') {
          const t1 = setTimeout(() => {
             setParticipants(prev => [...prev, {
                 id: 'sarah', name: 'Sarah', avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
                 items: [], status: 'joining', isHost: false
             }]);
          }, 2000);
          
          const t2 = setTimeout(() => {
             setParticipants(prev => [...prev, {
                 id: 'mike', name: 'Mike', avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
                 items: [], status: 'joining', isHost: false
             }]);
          }, 4000);
          
          return () => { clearTimeout(t1); clearTimeout(t2); };
      }
      
      // Phase 2: People Ordering (Menu View)
      if (step === 'menu' && isGroupOrder) {
          // Change status to ordering
          setParticipants(prev => prev.map(p => p.isHost ? p : { ...p, status: 'ordering' }));

          // Simulate Sarah adding item
          const t1 = setTimeout(() => {
              const padThai = MENU_ITEMS.find(i => i.name === 'Pad Thai');
              if (padThai) {
                  setParticipants(prev => prev.map(p => p.id === 'sarah' ? {
                      ...p, items: [{ ...padThai, quantity: 1, selectedProtein: PROTEIN_OPTIONS[0] }]
                  } : p));
              }
          }, 3000);

          // Simulate Mike adding item
          const t2 = setTimeout(() => {
              const rolls = MENU_ITEMS.find(i => i.name === 'Fresh Spring Roll');
              if (rolls) {
                  setParticipants(prev => prev.map(p => p.id === 'mike' ? {
                      ...p, items: [{ ...rolls, quantity: 1 }]
                  } : p));
              }
          }, 5000);

          // Simulate Sarah Ready
          const t3 = setTimeout(() => {
              setParticipants(prev => prev.map(p => p.id === 'sarah' ? { ...p, status: 'ready' } : p));
          }, 8000);

          // Simulate Mike Ready
          const t4 = setTimeout(() => {
              setParticipants(prev => prev.map(p => p.id === 'mike' ? { ...p, status: 'ready' } : p));
          }, 10000);

          return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
      }
  }, [step, isGroupOrder]);

  // --- AUTO REDIRECT TO CHECKOUT ---
  useEffect(() => {
      if (step === 'menu' && isGroupOrder && participants.length > 0) {
          const allReady = participants.every(p => p.status === 'ready');
          if (allReady) {
              const t = setTimeout(() => {
                  setStep('checkout');
              }, 1500); // Small delay to let user see everyone is ready
              return () => clearTimeout(t);
          }
      }
  }, [participants, step, isGroupOrder]);

  // Sync current user cart to participants state for Host
  useEffect(() => {
      if (isGroupOrder) {
          setParticipants(prev => prev.map(p => p.isHost ? {
              ...p,
              items: cart,
              status: p.status === 'ready' ? 'ready' : (cart.length > 0 ? 'ordering' : 'joining')
          } : p));
      }
  }, [cart, isGroupOrder]);


  // Main Map Initialization (Pickup/Delivery Selection)
  useEffect(() => {
    if (step === 'map' && mapContainerRef.current && typeof L !== 'undefined') {
        // Destroy existing map if it exists
        if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
        }

        // Center on Montreal
        const map = L.map(mapContainerRef.current, { zoomControl: false }).setView([45.5017, -73.5673], 14);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        L.control.zoom({ position: 'topright' }).addTo(map);

        LOCATIONS.forEach((loc) => {
            const isActive = activeMapLocation.id === loc.id;
            
            const iconHtml = `
                <div style="
                    background-color: ${isActive ? '#cedc00' : '#1b422a'};
                    color: ${isActive ? '#1b422a' : 'white'};
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 2px solid white;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    transform: ${isActive ? 'scale(1.2)' : 'scale(1)'};
                    transition: all 0.3s ease;
                ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="${isActive ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
            `;

            const icon = L.divIcon({
                html: iconHtml,
                className: 'leaflet-div-icon',
                iconSize: [32, 32],
                iconAnchor: [16, 32]
            });

            const marker = L.marker([loc.lat, loc.lng], { icon: icon }).addTo(map);
            
            marker.on('click', () => {
                setActiveMapLocation(loc);
                map.flyTo([loc.lat, loc.lng], 15, { duration: 1.5 });
            });
        });

        mapRef.current = map;

        setTimeout(() => {
            map.invalidateSize();
        }, 200);
    }
  }, [step, activeMapLocation]);

  // Tracking Map Initialization
  useEffect(() => {
    if (step === 'tracking' && activeOrder?.orderType === 'delivery' && trackingMapContainerRef.current && typeof L !== 'undefined') {
        if (trackingMapRef.current) {
            trackingMapRef.current.remove();
            trackingMapRef.current = null;
        }
        // ... (Tracking map logic remains same as before)
        // Mock User Location (Customer Home)
        const userLocation = { lat: 45.4950, lng: -73.5750 }; 
        // Find Store Location
        const storeLocation = LOCATIONS.find(l => l.name === activeOrder.locationName) || LOCATIONS[0];
        // Initialize Dark Mode Map
        const map = L.map(trackingMapContainerRef.current, { zoomControl: false }).setView([storeLocation.lat, storeLocation.lng], 14);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { attribution: '&copy; CARTO', subdomains: 'abcd', maxZoom: 20 }).addTo(map);
        L.control.zoom({ position: 'topright' }).addTo(map);

        // Store Marker
        const storeIconHtml = `<div style="background-color: #1b422a; color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #cedc00; box-shadow: 0 4px 10px rgba(0,0,0,0.5);"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg></div>`;
        const storeIcon = L.divIcon({ html: storeIconHtml, className: 'leaflet-div-icon', iconSize: [36, 36], iconAnchor: [18, 18] });
        L.marker([storeLocation.lat, storeLocation.lng], { icon: storeIcon }).addTo(map);

        // User Marker
        const userIconHtml = `<div style="background-color: white; color: #1b422a; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #1b422a; box-shadow: 0 4px 10px rgba(0,0,0,0.5);"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>`;
        const userIcon = L.divIcon({ html: userIconHtml, className: 'leaflet-div-icon', iconSize: [36, 36], iconAnchor: [18, 18] });
        L.marker([45.4950, -73.5750], { icon: userIcon }).addTo(map);

        if (activeOrder.status === 'ontheway' || activeOrder.status === 'delivered') {
            const latlngs = [[storeLocation.lat, storeLocation.lng], [45.4980, -73.5720], [45.4950, -73.5750]];
            L.polyline(latlngs, { color: '#cedc00', weight: 4, opacity: 0.8, dashArray: '10, 10', lineCap: 'round' }).addTo(map);
            if (activeOrder.status === 'ontheway') {
                const driverIconHtml = `<div style="background-color: #cedc00; color: #1b422a; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 15px rgba(206, 220, 0, 0.4); z-index: 100;"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/><circle cx="6.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/></svg></div>`;
                const driverIcon = L.divIcon({ html: driverIconHtml, className: 'leaflet-div-icon', iconSize: [40, 40], iconAnchor: [20, 20] });
                L.marker([45.4980, -73.5720], { icon: driverIcon }).addTo(map);
                map.fitBounds(L.latLngBounds(latlngs), { padding: [50, 50] });
            } else {
                 map.fitBounds(L.latLngBounds([[storeLocation.lat, storeLocation.lng], [45.4950, -73.5750]]), { padding: [80, 80] });
            }
        } else {
             map.setView([storeLocation.lat, storeLocation.lng], 15);
        }
        trackingMapRef.current = map;
        setTimeout(() => map.invalidateSize(), 200);
    }
  }, [step, activeOrder]);

  const filteredItems = selectedCategory === 'favorites' 
    ? MENU_ITEMS.filter(i => i.isPopular) 
    : MENU_ITEMS.filter(item => item.category === selectedCategory);

  const cartTotal = cart.reduce((sum, item) => {
    const proteinPrice = item.selectedProtein ? item.selectedProtein.price : 0;
    return sum + ((item.price + proteinPrice) * item.quantity);
  }, 0);
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const freeDeliveryThreshold = 50;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - cartTotal);

  // --- LOGIC ---

  const toggleFavorite = (e: React.MouseEvent, itemId: string) => {
      e.stopPropagation();
      setQuickFavorites(prev => 
          prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
      );
  };

  const handleItemClick = (item: MenuItem) => {
      const needsProtein = ['noodles', 'rice', 'stir_fries', 'general_thai', 'curries'].includes(item.category);
      if (needsProtein) {
          setCustomizingItem(item);
          setSelectedProtein(null); 
      } else {
          handleAddToCart(item);
      }
  };

  const confirmAddToCart = () => {
      if (customizingItem && selectedProtein) {
          handleAddToCart(customizingItem, selectedProtein);
          setCustomizingItem(null);
          setSelectedProtein(null);
      }
  };

  const handleAddToCart = (item: MenuItem, protein?: ProteinOption) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(i => i.id === item.id && i.selectedProtein?.id === protein?.id);
      if (existingIndex >= 0) {
        const newCart = [...prev];
        newCart[existingIndex].quantity += 1;
        return newCart;
      }
      return [...prev, { ...item, quantity: 1, selectedProtein: protein }];
    });
  };

  const handleQuantityChange = (index: number, delta: number) => {
    setCart(prev => {
        const newCart = [...prev];
        const newQty = newCart[index].quantity + delta;
        if (newQty <= 0) {
            newCart.splice(index, 1);
        } else {
            newCart[index].quantity = newQty;
        }
        return newCart;
    });
  };

  const confirmLocation = () => {
    setSelectedLocation(activeMapLocation);
    if (orderType === 'delivery') setDeliveryFee(3.99); else setDeliveryFee(0);
    setStep('menu');
  };

  const handleStartGroupOrder = (type: OrderType) => {
      setOrderType(type);
      setIsGroupOrder(true);
      setLobbyCode(Math.random().toString(36).substring(2, 7).toUpperCase());
      setParticipants([{ id: 'me', name: 'Me (Host)', avatar: '', items: [], status: 'joining', isHost: true }]);
      setStep('lobby');
  };

  const handleMarkReady = () => {
      setParticipants(prev => prev.map(p => p.isHost ? { ...p, status: 'ready' } : p));
  };

  const handlePlaceOrderClick = () => {
    if (onPlaceOrder && selectedLocation) {
        // If group order, combine all items
        const allItems = isGroupOrder 
            ? participants.flatMap(p => p.items) 
            : cart;

        const totalCost = isGroupOrder 
            ? participants.reduce((acc, p) => acc + p.items.reduce((s, i) => s + ((i.price + (i.selectedProtein?.price||0)) * i.quantity), 0), 0)
            : cartTotal;

        const newOrder: ActiveOrder = {
            id: `ORD-${Math.floor(Math.random() * 10000)}`,
            status: 'confirmed',
            eta: orderType === 'pickup' ? '15-20 min' : '25-35 min',
            total: totalCost * 1.15,
            locationName: selectedLocation.name,
            orderType: orderType, 
            isGroupOrder: isGroupOrder,
            items: allItems.map(c => ({ 
                name: `${c.name} ${c.selectedProtein ? `(${c.selectedProtein.name})` : ''}`, 
                quantity: c.quantity 
            }))
        };
        onPlaceOrder(newOrder);
        setCart([]); 
        setIsGroupOrder(false); 
        setParticipants([]);
    }
  };

  // --- COMPONENTS ---

  const CustomizationModal = () => {
      if (!customizingItem) return null;
      const basePrice = customizingItem.price;
      const currentPrice = basePrice + (selectedProtein?.price || 0);
      return (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center pointer-events-none">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto animate-in fade-in duration-300" onClick={() => setCustomizingItem(null)}></div>
              <div className="bg-[#333] text-white w-full max-w-md h-[80vh] rounded-t-2xl sm:rounded-2xl shadow-2xl z-10 flex flex-col pointer-events-auto animate-in slide-in-from-bottom duration-300 overflow-hidden">
                  <div className="h-48 relative shrink-0">
                      <img src={customizingItem.image} alt={customizingItem.name} className="w-full h-full object-cover opacity-80" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#333] to-transparent"></div>
                      <button onClick={() => setCustomizingItem(null)} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-white hover:text-black transition-colors"><X size={20} /></button>
                      <div className="absolute bottom-4 left-6">
                          <h2 className="text-2xl font-serif font-bold mb-1">{customizingItem.name}</h2>
                          <p className="text-gray-300 text-sm line-clamp-1">{customizingItem.description}</p>
                      </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
                      <div className="flex justify-between items-center mb-4">
                          <h3 className="font-bold text-sm uppercase tracking-wider text-thai-lime">Choose Protein</h3>
                          <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">1 REQUIRED</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                          {PROTEIN_OPTIONS.map((option) => {
                             const isSelected = selectedProtein?.id === option.id;
                             return (
                                 <button key={option.id} onClick={() => setSelectedProtein(option)} className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all relative ${isSelected ? 'bg-thai-lime/10 border-thai-lime' : 'bg-gray-800 border-gray-700 hover:bg-gray-700'}`}>
                                     <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-900 mb-1 relative">
                                         <img src={option.image} alt={option.name} className="w-full h-full object-cover" />
                                         {isSelected && <div className="absolute inset-0 bg-thai-lime/40 flex items-center justify-center"><CheckCircle className="text-white drop-shadow-md" size={24} /></div>}
                                     </div>
                                     <div className="text-center">
                                         <p className={`text-xs font-bold ${isSelected ? 'text-thai-lime' : 'text-white'}`}>{option.name}</p>
                                         <p className="text-[10px] text-gray-400">{option.price > 0 ? `+$${option.price.toFixed(2)}` : 'Included'}</p>
                                     </div>
                                 </button>
                             )
                          })}
                      </div>
                  </div>
                  <div className="p-4 border-t border-gray-800 bg-[#222]">
                      <div className="flex justify-between items-center mb-4 text-sm">
                          <span className="text-gray-400">Item Total</span>
                          <span className="font-bold text-xl">${currentPrice.toFixed(2)}</span>
                      </div>
                      <button onClick={confirmAddToCart} disabled={!selectedProtein} className="w-full bg-thai-lime text-brand-green font-bold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lime-400 transition-colors shadow-lg">ADD TO CART</button>
                  </div>
              </div>
          </div>
      );
  };

  // --- VIEW 1: LANDING ---
  const LandingView = () => (
    <div className="flex flex-col min-h-screen bg-brand-cream pb-24 px-6 pt-20">
       <h1 className="text-3xl font-serif font-bold text-brand-green text-center mb-2">Start Your Order</h1>
       <p className="text-gray-500 text-center mb-10">How would you like to enjoy your meal?</p>

       <div className="space-y-6">
          {/* Group Order Toggle (Now Prominent) */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-brand-green"></div>
              <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${isGroupOrder ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-500'}`}>
                          <Users size={24} />
                      </div>
                      <div>
                          <h3 className="font-bold text-gray-900 text-lg">Group Order Mode</h3>
                          <p className="text-sm text-gray-500">Create a lobby & invite friends</p>
                      </div>
                  </div>
                  <button 
                    onClick={() => setIsGroupOrder(!isGroupOrder)}
                    className={`w-12 h-7 rounded-full transition-colors relative ${isGroupOrder ? 'bg-brand-green' : 'bg-gray-300'}`}
                  >
                      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${isGroupOrder ? 'left-6' : 'left-1'}`}></div>
                  </button>
              </div>
              
              {isGroupOrder && (
                  <div className="animate-in slide-in-from-top fade-in duration-300 border-t border-gray-100 pt-4 mt-2">
                       <p className="text-sm text-gray-600 mb-4">Host a digital lobby. Friends can scan to join and add to the same cart.</p>
                       <div className="grid grid-cols-2 gap-3">
                           <button onClick={() => handleStartGroupOrder('pickup')} className="bg-brand-green text-white font-bold py-3 rounded-lg text-sm">Start Pickup Lobby</button>
                           <button onClick={() => handleStartGroupOrder('delivery')} className="bg-thai-lime text-brand-green font-bold py-3 rounded-lg text-sm">Start Delivery Lobby</button>
                       </div>
                  </div>
              )}
          </div>

          {/* Standard Buttons (Disabled if Group Mode Active just to be safe, or hide them) */}
          {!isGroupOrder && (
            <>
              <button onClick={() => { setOrderType('pickup'); setStep('map'); }} className="w-full bg-white rounded-2xl p-8 shadow-md border-2 border-transparent hover:border-brand-green transition-all group text-left relative overflow-hidden">
                 <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4"><ShoppingBag size={120} /></div>
                 <div className="relative z-10">
                    <div className="bg-brand-green/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-brand-green group-hover:text-white transition-colors"><ShoppingBag size={24} /></div>
                    <h3 className="text-2xl font-bold text-brand-green mb-1">Pick Up</h3>
                    <p className="text-gray-500 text-sm">Order ahead and skip the line.</p>
                 </div>
              </button>
              <button onClick={() => { setOrderType('delivery'); setStep('map'); }} className="w-full bg-white rounded-2xl p-8 shadow-md border-2 border-transparent hover:border-brand-green transition-all group text-left relative overflow-hidden">
                 <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4"><Navigation size={120} /></div>
                 <div className="relative z-10">
                    <div className="bg-thai-lime/20 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-thai-lime group-hover:text-brand-green transition-colors"><Navigation size={24} /></div>
                    <h3 className="text-2xl font-bold text-brand-green mb-1">Delivery</h3>
                    <p className="text-gray-500 text-sm">Fresh Thai food delivered.</p>
                 </div>
              </button>
            </>
          )}
       </div>
    </div>
  );

  // --- VIEW 1.5: LOBBY VIEW ---
  const LobbyView = () => (
      <div className="flex flex-col min-h-screen bg-brand-cream pb-24">
          <div className="px-6 pt-12 pb-6 text-center">
              <h1 className="font-serif font-bold text-2xl text-brand-green mb-1">Digital Lobby</h1>
              <p className="text-gray-500">Scan to join the party!</p>
          </div>

          <div className="flex-1 flex flex-col items-center px-6">
               <div className="bg-white p-6 rounded-2xl shadow-xl mb-8 border border-gray-100 relative">
                   <div className="absolute -top-3 -right-3 bg-thai-lime text-brand-green font-bold px-3 py-1 rounded-full text-xs shadow-md">
                       ID: {lobbyCode}
                   </div>
                   <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ThaiExpressLobby-${lobbyCode}&color=1b422a`}
                        alt="Lobby QR"
                        className="w-64 h-64"
                   />
               </div>

               <div className="w-full max-w-sm mb-8">
                   <h3 className="font-bold text-gray-900 mb-4 flex justify-between items-center">
                       <span>Participants</span>
                       <span className="bg-brand-green/10 text-brand-green px-2 py-0.5 rounded-full text-xs">{participants.length} Joining</span>
                   </h3>
                   <div className="space-y-3">
                       {participants.map((p) => (
                           <div key={p.id} className="bg-white p-3 rounded-xl flex items-center justify-between shadow-sm animate-in slide-in-from-bottom duration-300">
                               <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border-2 border-white shadow-sm">
                                       {p.avatar ? <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" /> : <span className="font-bold text-gray-500">ME</span>}
                                   </div>
                                   <span className="font-bold text-gray-800">{p.name}</span>
                               </div>
                               <div className="flex items-center gap-1.5 text-xs font-bold text-brand-green bg-green-50 px-2 py-1 rounded-full">
                                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                   Joined
                               </div>
                           </div>
                       ))}
                   </div>
               </div>
          </div>
          
          <div className="p-6 bg-white border-t border-gray-100">
               <button 
                  onClick={() => setStep('map')} 
                  className="w-full bg-brand-green text-white font-bold py-4 rounded-xl shadow-lg hover:bg-[#143320] transition-colors flex items-center justify-center gap-2"
               >
                   Start Ordering <ArrowLeft size={18} className="rotate-180" />
               </button>
          </div>
      </div>
  );

  // --- VIEW 2: MAP SELECTION ---
  const MapView = () => (
    <div className="flex flex-col h-screen pb-20 bg-gray-900 relative">
        <div ref={mapContainerRef} className="absolute inset-0 z-0"></div>
        
        {/* Top Header */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 pt-12 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
             <div className="flex items-center gap-3 pointer-events-auto">
                 <button onClick={() => setStep('landing')} className="bg-white/20 p-2 rounded-full text-white backdrop-blur-md hover:bg-white/30 transition-colors">
                     <ArrowLeft size={24} />
                 </button>
                 <div>
                     <h1 className="text-white font-bold text-lg drop-shadow-md">Select Store</h1>
                     <p className="text-gray-200 text-xs drop-shadow-md">{orderType === 'pickup' ? 'Pick up at' : 'Delivery from'}:</p>
                 </div>
             </div>
        </div>

        {/* Location List Overlay */}
        <div className="absolute bottom-[85px] left-0 right-0 z-20 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
             <div className="bg-white rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom duration-300">
                 <div className="flex justify-between items-start mb-4">
                     <div>
                         <h3 className="font-bold text-xl text-gray-900">{activeMapLocation.name}</h3>
                         <p className="text-sm text-gray-500">{activeMapLocation.address}</p>
                         <div className="flex items-center gap-2 mt-2">
                             <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${activeMapLocation.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                 {activeMapLocation.isOpen ? 'OPEN' : 'CLOSED'}
                             </span>
                             <span className="text-xs text-gray-400">• {activeMapLocation.distance} away</span>
                         </div>
                     </div>
                     <div className="bg-brand-green/10 p-2 rounded-full">
                         <MapPin className="text-brand-green" size={24} />
                     </div>
                 </div>
                 
                 <button 
                    onClick={confirmLocation}
                    disabled={!activeMapLocation.isOpen}
                    className="w-full bg-brand-green text-white font-bold py-3 rounded-xl shadow-lg hover:bg-[#143320] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                     CONFIRM LOCATION
                 </button>
             </div>
        </div>
    </div>
  );

  // --- VIEW 3: MENU (with Group Status) ---
  const MenuBrowserView = () => {
    // Current user's readiness state logic is simple: host marks ready manually
    const hostStatus = participants.find(p => p.isHost)?.status;
    const readyCount = participants.filter(p => p.status === 'ready').length;
    
    return (
    <div className="flex flex-col min-h-screen pb-24 bg-brand-cream relative">
        <CustomizationModal />
        
        {/* Menu Header */}
        <div className="bg-white px-4 py-3 shadow-sm border-b border-gray-200 sticky top-0 z-40">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <button onClick={() => setStep('map')} className="p-1 hover:bg-gray-100 rounded-full">
                        <ArrowLeft size={24} className="text-brand-green" />
                    </button>
                    <h2 className="font-bold text-lg text-gray-900">Order</h2>
                </div>
                {isGroupOrder && (
                     <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                            {participants.map(p => (
                                <div key={p.id} className="w-6 h-6 rounded-full border border-white bg-gray-200 overflow-hidden">
                                    {p.avatar ? <img src={p.avatar} className="w-full h-full object-cover"/> : <div className="bg-brand-green w-full h-full"></div>}
                                </div>
                            ))}
                        </div>
                        <span className="bg-brand-green/10 text-brand-green px-3 py-1 rounded-full text-xs font-bold">
                            Lobby: {lobbyCode}
                        </span>
                     </div>
                )}
            </div>
            {/* ... Location info ... */}
            <div className="flex justify-between items-center border border-gray-300 rounded-lg p-3 bg-gray-50">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                         <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${orderType === 'delivery' ? 'bg-thai-lime text-brand-green' : 'bg-brand-green text-white'}`}>{orderType}</span>
                         <p className="text-xs font-bold text-gray-800 uppercase tracking-wide">{selectedLocation?.name}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Categories */}
        <div className="bg-white border-b border-gray-200 sticky top-[105px] z-30 shadow-sm">
            <div className="flex overflow-x-auto no-scrollbar px-4 py-0">
                {CATEGORIES.map((cat) => (
                    <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`whitespace-nowrap py-4 px-4 border-b-4 text-sm font-bold transition-colors ${selectedCategory === cat.id ? 'border-brand-green text-brand-green' : 'border-transparent text-gray-500'}`}>{cat.name}</button>
                ))}
            </div>
        </div>

        {/* Menu Items */}
        <div className="px-4 space-y-4 py-6">
            {filteredItems.map((item) => {
                const hasAllergy = item.allergens?.some(a => userAllergies.includes(a));
                const conflictingAllergens = item.allergens?.filter(a => userAllergies.includes(a));

                return (
                <div 
                    key={item.id} 
                    onClick={() => handleItemClick(item)} 
                    className={`bg-white rounded-lg shadow-sm overflow-hidden flex flex-col sm:flex-row group cursor-pointer transition-all ${
                        hasAllergy 
                        ? 'border-2 border-red-500 relative' 
                        : 'border border-transparent hover:border-brand-green/20'
                    }`}
                >
                    {hasAllergy && (
                        <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg z-20 flex items-center gap-1">
                            <AlertTriangle size={10} />
                            Contains: {conflictingAllergens?.join(', ')}
                        </div>
                    )}

                    <div className="flex p-4 gap-4">
                        <div className="w-28 h-28 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden relative">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className={`font-bold text-lg font-serif ${hasAllergy ? 'text-red-700' : 'text-gray-900'}`}>{item.name}</h3>
                                <p className="text-xs text-gray-500 mt-2 line-clamp-2">{item.description}</p>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-gray-900 font-bold">${item.price.toFixed(2)}</span>
                                <button className="bg-thai-lime text-brand-green font-bold py-1 px-4 rounded-md text-xs uppercase hover:bg-lime-400">Add +</button>
                            </div>
                        </div>
                    </div>
                </div>
            )})}
        </div>

        {/* GROUP STATUS BAR (Replaces Floating Cart in Group Mode) */}
        {isGroupOrder ? (
            <div className="fixed bottom-24 left-4 right-4 bg-[#333] text-white p-4 rounded-2xl shadow-2xl z-50 animate-in slide-in-from-bottom duration-300">
                <div className="flex justify-between items-center mb-3">
                    <div>
                        <p className="font-bold text-thai-lime">Group Status</p>
                        <p className="text-xs text-gray-400">{readyCount} of {participants.length} Ready</p>
                    </div>
                    {/* Avatars Status */}
                    <div className="flex gap-2">
                        {participants.map(p => (
                            <div key={p.id} className={`w-8 h-8 rounded-full border-2 overflow-hidden relative ${p.status === 'ready' ? 'border-thai-lime' : 'border-gray-500'}`}>
                                {p.avatar ? <img src={p.avatar} className="w-full h-full object-cover" /> : <div className="bg-gray-500 w-full h-full flex items-center justify-center text-[10px] font-bold">ME</div>}
                                {p.status === 'ready' && <div className="absolute inset-0 bg-thai-lime/50 flex items-center justify-center"><Check size={14} className="text-white"/></div>}
                            </div>
                        ))}
                    </div>
                </div>
                
                {hostStatus !== 'ready' ? (
                     <button 
                        onClick={handleMarkReady}
                        className="w-full bg-brand-green text-white font-bold py-3 rounded-xl hover:bg-[#143320] transition-colors"
                     >
                        I'M READY
                     </button>
                ) : (
                    <div className="w-full bg-gray-700 text-gray-300 font-bold py-3 rounded-xl text-center flex items-center justify-center gap-2">
                        <Clock size={16} className="animate-spin" /> Waiting for others...
                    </div>
                )}
            </div>
        ) : (
            cart.length > 0 && (
                <div className="fixed bottom-24 right-6 z-50 animate-in slide-in-from-bottom fade-in duration-300">
                    <button onClick={() => setStep('checkout')} className="bg-brand-green text-white p-4 rounded-full shadow-2xl flex items-center justify-center relative hover:bg-[#143320] transition-colors">
                        <ShoppingCart size={24} />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">{totalItems}</span>
                    </button>
                </div>
            )
        )}
    </div>
    );
  };

  // --- VIEW 4: CHECKOUT ---
  const CheckoutView = () => (
      <div className="flex flex-col min-h-screen bg-brand-cream pb-24">
          <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center gap-3">
              <button onClick={() => setStep('menu')} className="p-1 hover:bg-gray-100 rounded-full"><ArrowLeft size={24} className="text-brand-green" /></button>
              <h2 className="font-bold text-lg text-gray-900">Checkout</h2>
          </div>
          
          <div className="p-4 space-y-6">
              {/* Pickup Timing (Shown only for pickup) */}
              {orderType === 'pickup' && (
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                      <h3 className="font-bold text-gray-900 mb-4">Pickup Timing</h3>
                      <div className="space-y-3">
                          {/* Option A: ASAP */}
                          <div 
                              onClick={() => setPickupTiming('asap')}
                              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${pickupTiming === 'asap' ? 'border-brand-green bg-green-50' : 'border-gray-200'}`}
                          >
                              <div>
                                  <p className="font-bold text-brand-green text-sm">Prepare ASAP</p>
                                  <p className="text-xs text-gray-500">Standard Pickup • 15-20 mins</p>
                              </div>
                              {pickupTiming === 'asap' && <div className="w-5 h-5 bg-brand-green rounded-full flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full"></div></div>}
                          </div>

                          {/* Option B: Smart GPS */}
                          <div 
                              onClick={() => setPickupTiming('geofenced')}
                              className={`p-4 rounded-xl border-2 cursor-pointer transition-all relative overflow-hidden ${pickupTiming === 'geofenced' ? 'border-thai-lime bg-lime-50' : 'border-gray-200'}`}
                          >
                              {pickupTiming === 'geofenced' && <div className="absolute top-0 right-0 bg-thai-lime text-brand-green text-[10px] font-bold px-2 py-1 rounded-bl-lg">RECOMMENDED</div>}
                              
                              <div className="flex items-start gap-3">
                                   <div className={`p-2 rounded-full ${pickupTiming === 'geofenced' ? 'bg-thai-lime text-brand-green' : 'bg-gray-100 text-gray-400'}`}>
                                       <Radar size={20} />
                                   </div>
                                   <div>
                                       <p className="font-bold text-brand-green text-sm">Fire on Arrival (Geo-Fenced)</p>
                                       <p className="text-xs text-gray-500 mt-1 leading-snug">We will send order to kitchen only when you are within <span className="font-bold">500m</span> of the store.</p>
                                       <div className="flex items-center gap-1 mt-2 text-[10px] font-bold text-brand-green bg-white/50 px-2 py-1 rounded inline-block">
                                           <CheckCircle size={10} /> Maximum Freshness
                                       </div>
                                   </div>
                              </div>
                          </div>
                      </div>
                  </div>
              )}

              {/* Order Items */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4">Your Items</h3>
                  {cart.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start mb-4 last:mb-0 border-b border-gray-50 last:border-0 pb-4 last:pb-0">
                          <div className="flex gap-3">
                              <div className="bg-gray-100 w-12 h-12 rounded-lg overflow-hidden shrink-0"><img src={item.image} className="w-full h-full object-cover" /></div>
                              <div>
                                  <p className="font-bold text-gray-800 text-sm">{item.quantity}x {item.name}</p>
                                  {item.selectedProtein && <p className="text-xs text-gray-500">{item.selectedProtein.name}</p>}
                              </div>
                          </div>
                          <div className="text-right">
                              <p className="font-bold text-gray-900 text-sm">${((item.price + (item.selectedProtein?.price || 0)) * item.quantity).toFixed(2)}</p>
                              <div className="flex items-center justify-end gap-3 mt-1">
                                   <button onClick={() => handleQuantityChange(idx, -1)} className="text-gray-400 hover:text-red-500"><Minus size={14} /></button>
                                   <button onClick={() => handleQuantityChange(idx, 1)} className="text-gray-400 hover:text-green-500"><Plus size={14} /></button>
                              </div>
                          </div>
                      </div>
                  ))}
                  
                  {isGroupOrder && participants.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                          <h4 className="font-bold text-sm text-gray-500 mb-2">Friends' Items</h4>
                          {participants.filter(p => !p.isHost).map(p => (
                              <div key={p.id} className="flex items-center gap-2 mb-2">
                                  <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden"><img src={p.avatar} className="w-full h-full object-cover"/></div>
                                  <span className="text-xs text-gray-600">{p.items.length} items added by {p.name}</span>
                              </div>
                          ))}
                      </div>
                  )}
              </div>

              {/* Payment Summary */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4">Payment Summary</h3>
                  <div className="flex justify-between text-sm mb-2 text-gray-600">
                      <span>Subtotal</span>
                      <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2 text-gray-600">
                      <span>Delivery Fee</span>
                      <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-4 text-gray-600">
                      <span>Taxes (15%)</span>
                      <span>${((cartTotal + deliveryFee) * 0.15).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-4 border-t border-gray-100">
                      <span>Total</span>
                      <span>${((cartTotal + deliveryFee) * 1.15).toFixed(2)}</span>
                  </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                      <CreditCard className="text-brand-green" size={24} />
                      <div>
                          <p className="font-bold text-sm text-gray-900">Apple Pay</p>
                          <p className="text-xs text-gray-500">**** 1234</p>
                      </div>
                  </div>
                  <span className="text-brand-green text-xs font-bold">CHANGE</span>
              </div>
          </div>

          <div className="p-4 bg-white border-t border-gray-100 mt-auto">
              <button onClick={handlePlaceOrderClick} className="w-full bg-brand-green text-white font-bold py-4 rounded-xl shadow-lg hover:bg-[#143320] transition-colors flex items-center justify-center gap-2">
                  PLACE ORDER - ${((cartTotal + deliveryFee) * 1.15).toFixed(2)}
              </button>
          </div>
      </div>
  );

  // --- VIEW 5: TRACKING ---
  const TrackingView = () => (
      <div className="flex flex-col h-screen relative bg-gray-900">
         {/* ... Map Background ... */}
         {activeOrder?.orderType === 'delivery' ? (
             <div ref={trackingMapContainerRef} className="absolute inset-0 z-0"></div>
         ) : (
             <div className="absolute inset-0 z-0 bg-gray-900 flex items-center justify-center">
                 <div className="text-center p-8">
                     <div className="w-32 h-32 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(206,220,0,0.2)]">
                         <ShoppingBag size={64} className="text-white" />
                     </div>
                     <h2 className="text-white font-bold text-2xl mb-2">{activeOrder?.locationName}</h2>
                     <p className="text-gray-400">Order #{activeOrder?.id}</p>
                 </div>
             </div>
         )}
         
         <div className="absolute top-0 left-0 right-0 z-10 p-4 pt-12 flex justify-between items-start pointer-events-none">
             <div className="pointer-events-auto">
                 <h1 className="text-white font-bold text-2xl drop-shadow-md">
                     {activeOrder?.status === 'delivered' ? 'Enjoy!' : (activeOrder?.orderType === 'pickup' && activeOrder?.status === 'ontheway' ? 'Ready for Pickup!' : 'On the way')}
                 </h1>
                 <p className="text-gray-300 text-sm drop-shadow-md">Order #{activeOrder?.id}</p>
             </div>
             <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold border border-white/20 pointer-events-auto">
                 {activeOrder?.orderType === 'pickup' ? 'Est. Pickup' : 'Est. Arrival'}: {activeOrder?.eta}
             </div>
         </div>

         {/* Status Card */}
         <div className="absolute bottom-24 left-4 right-4 bg-white rounded-2xl p-6 shadow-2xl z-20 animate-in slide-in-from-bottom duration-500">
             {/* Pickup Specific UI (No Map, Simplified Status) */}
             {activeOrder?.orderType === 'pickup' ? (
                 <>
                    {/* Simplified Timeline */}
                    <div className="flex items-center justify-between mb-8 relative px-4">
                        <div className="absolute top-1/2 left-4 right-4 h-1 bg-gray-100 -z-10"></div>
                        
                        {/* Step 1: Confirmed */}
                        <div className={`flex flex-col items-center gap-2 ${['confirmed', 'preparing', 'ontheway', 'delivered'].includes(activeOrder.status) ? 'opacity-100' : 'opacity-30'}`}>
                            <div className="w-8 h-8 rounded-full bg-brand-green text-white flex items-center justify-center border-2 border-brand-green shadow-sm">
                                <Check size={14} />
                            </div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase">Confirmed</span>
                        </div>
                        
                        {/* Step 2: Preparing */}
                        <div className={`flex flex-col items-center gap-2 ${['preparing', 'ontheway', 'delivered'].includes(activeOrder.status) ? 'opacity-100' : 'opacity-30'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${['preparing', 'ontheway', 'delivered'].includes(activeOrder.status) ? 'bg-brand-green border-brand-green text-white' : 'bg-white border-gray-200'}`}>
                                <Utensils size={14} />
                            </div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase">Preparing</span>
                        </div>

                        {/* Step 3: Ready */}
                        <div className={`flex flex-col items-center gap-2 ${['ontheway', 'delivered'].includes(activeOrder.status) ? 'opacity-100' : 'opacity-30'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${['ontheway', 'delivered'].includes(activeOrder.status) ? 'bg-thai-lime border-thai-lime text-brand-green animate-bounce' : 'bg-white border-gray-200'}`}>
                                <ShoppingBag size={18} />
                            </div>
                            <span className="text-[10px] font-bold text-gray-900 uppercase">Ready</span>
                        </div>
                    </div>

                    <div className="text-center mb-6">
                        <h2 className="font-bold text-xl text-gray-900 mb-1">
                            {activeOrder.status === 'confirmed' && 'Order Received'}
                            {activeOrder.status === 'preparing' && 'Kitchen is cooking'}
                            {activeOrder.status === 'ontheway' && 'Ready for Pickup!'}
                            {activeOrder.status === 'delivered' && 'Picked Up'}
                        </h2>
                        <p className="text-gray-500 text-sm">
                             {activeOrder.status === 'ontheway' ? 'Head to the counter to grab your food.' : 'We will notify you when it is ready.'}
                        </p>
                    </div>

                    {/* Store Info (Instead of Driver) */}
                    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl mb-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-2xl">
                            🏪
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-gray-900 text-sm">{activeOrder.locationName}</p>
                            <p className="text-xs text-gray-500">Store • Open until 9 PM</p>
                        </div>
                        <button className="bg-white p-2 rounded-full text-brand-green shadow-sm border border-gray-100 hover:bg-brand-green hover:text-white transition-colors">
                            <Navigation size={20} />
                        </button>
                    </div>
                 </>
             ) : (
                 // Delivery UI (Standard)
                 <>
                    {/* ... (Existing Delivery Progress Bar & Driver UI) ... */}
                    <div className="flex items-center justify-between mb-6 relative">
                         <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10"></div>
                         {['confirmed', 'preparing', 'ontheway', 'delivered'].map((s, i) => {
                             const isCompleted = ['confirmed', 'preparing', 'ontheway', 'delivered'].indexOf(activeOrder?.status || '') >= i;
                             return (
                                 <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${isCompleted ? 'bg-brand-green border-brand-green text-white' : 'bg-white border-gray-200 text-gray-300'}`}>
                                     {isCompleted ? <Check size={14} /> : <div className="w-2 h-2 rounded-full bg-gray-200"></div>}
                                 </div>
                             );
                         })}
                     </div>
                     <div className="text-center mb-6">
                         <h2 className="font-bold text-xl text-gray-900 mb-1">
                             {activeOrder?.status === 'confirmed' && 'Order Confirmed'}
                             {activeOrder?.status === 'preparing' && 'Preparing your food'}
                             {activeOrder?.status === 'ontheway' && 'Driver is nearby'}
                             {activeOrder?.status === 'delivered' && 'Delivered'}
                         </h2>
                     </div>
                     <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                         <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-2xl">🛵</div>
                         <div className="flex-1">
                             <p className="font-bold text-gray-900 text-sm">{activeOrder?.locationName}</p>
                             <p className="text-xs text-gray-500">Your Driver</p>
                         </div>
                         <button className="bg-white p-2 rounded-full text-brand-green shadow-sm border border-gray-100 hover:bg-brand-green hover:text-white transition-colors"><Phone size={20} /></button>
                     </div>
                 </>
             )}

             {/* Always visible Start New Order button */}
             <div className="mt-4 pt-4 border-t border-gray-100">
                 <button 
                    onClick={() => setStep('landing')}
                    className="w-full text-gray-500 font-bold py-3 hover:text-brand-green transition-colors text-sm uppercase tracking-wide"
                 >
                     Start New Order
                 </button>
             </div>
         </div>
      </div>
  );

  // Main Render
  return (
      <>
        {step === 'landing' && <LandingView />}
        {step === 'lobby' && <LobbyView />}
        {step === 'map' && <MapView />}
        {step === 'menu' && <MenuBrowserView />}
        {step === 'checkout' && <CheckoutView />}
        {step === 'tracking' && <TrackingView />}
      </>
  );
};

export default OrderTab;
