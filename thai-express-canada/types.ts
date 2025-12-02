
export type Tab = 'Home' | 'Rewards' | 'Order' | 'Account';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  calories: number;
  category: string;
  isPopular?: boolean;
  allergens?: string[];
}

export interface Category {
  id: string;
  name: string;
}

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  distance: string;
  isOpen: boolean;
  lat: number;
  lng: number;
}

export interface ProteinOption {
  id: string;
  name: string;
  price: number;
  image: string;
  calories?: number;
}

export type OrderStatus = 'confirmed' | 'preparing' | 'ontheway' | 'delivered';

export interface CartItem extends MenuItem {
  quantity: number;
  selectedProtein?: ProteinOption;
}

export interface GroupParticipant {
  id: string;
  name: string;
  avatar: string;
  items: CartItem[];
  status: 'joining' | 'ordering' | 'ready';
  isHost: boolean;
}

export interface ActiveOrder {
  id: string;
  status: OrderStatus;
  eta: string;
  total: number;
  locationName: string;
  orderType: 'pickup' | 'delivery';
  isGroupOrder?: boolean;
  items: { name: string; quantity: number }[];
}
