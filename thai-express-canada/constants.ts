
import { Category, MenuItem, StoreLocation, ProteinOption } from "./types";

export const ALLERGENS = [
    "Peanuts",
    "Gluten",
    "Shellfish",
    "Soy",
    "Eggs",
    "Dairy",
    "Onions",
    "Scallions",
    "Fish",
    "Sesame"
];

export const CATEGORIES: Category[] = [
  { id: 'favorites', name: 'Favorites' },
  { id: 'appetizers', name: 'Appetizers' },
  { id: 'soups_salads', name: 'Soups & Salads' },
  { id: 'noodles', name: 'Noodles' },
  { id: 'general_thai', name: 'General Thai™' },
  { id: 'rice', name: 'Rice' },
  { id: 'curries', name: 'Curries' },
  { id: 'stir_fries', name: 'Stir-Fries' },
  { id: 'drinks', name: 'Drinks' },
];

export const MENU_ITEMS: MenuItem[] = [
  // --- Appetizers ---
  {
    id: 'app_1',
    name: 'Imperial Roll',
    description: 'Crispy fried roll filled with vegetables, served with our signature plum sauce.',
    price: 3.00,
    image: 'https://images.unsplash.com/photo-1548507299-8855b8eb955c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    calories: 180,
    category: 'appetizers',
    allergens: ['Gluten', 'Soy', 'Sesame']
  },
  {
    id: 'app_2',
    name: 'Fresh Spring Roll',
    description: 'Rice paper roll with lettuce, bean sprouts, carrots, coriander, mint, and vermicelli. Served with peanut sauce.',
    price: 6.68,
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    calories: 140,
    category: 'appetizers',
    allergens: ['Peanuts']
  },
  {
    id: 'app_3',
    name: 'Steamed Chicken Dumplings',
    description: '4 pcs. Tender chicken dumplings served with peanut sauce, green onions, and crushed peanuts.',
    price: 6.55,
    image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c423c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    calories: 220,
    category: 'appetizers',
    allergens: ['Gluten', 'Peanuts', 'Soy', 'Scallions']
  },
  {
    id: 'app_4',
    name: 'Thai Chicken Wings',
    description: '3 pcs. Crispy fried chicken wings tossed in traditional Thai seasoning.',
    price: 6.95,
    image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    calories: 350,
    category: 'appetizers',
    allergens: ['Gluten', 'Soy']
  },
  {
    id: 'app_5',
    name: 'General Thai™ Bok Bok Bag',
    description: 'Snack-sized portion of our famous crispy General Thai chicken bites.',
    price: 7.50,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    calories: 410,
    category: 'appetizers',
    allergens: ['Gluten', 'Soy', 'Sesame', 'Eggs']
  },

  // --- Soups & Salads ---
  {
    id: 'soup_1',
    name: 'Tom Yum Soup',
    description: 'Spicy & sour lemongrass broth with noodles, lime leaves, galangal, mushrooms, and tomatoes.',
    price: 16.49,
    image: 'https://images.unsplash.com/photo-1548943487-a2e4e43b485c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    calories: 320,
    category: 'soups_salads',
    allergens: ['Shellfish', 'Fish', 'Soy']
  },
  {
    id: 'soup_2',
    name: 'Thai Soup',
    description: 'Fragrant chicken broth with noodles, fresh vegetables, and crispy fried shallots.',
    price: 16.49,
    image: 'https://images.unsplash.com/photo-1603082009693-59044c97f30f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    calories: 290,
    category: 'soups_salads',
    allergens: ['Gluten', 'Soy', 'Onions']
  },
  {
    id: 'salad_1',
    name: 'Mango Salad',
    description: 'Fresh mango strips, lettuce, coriander, shallots, red pepper, mint, and Thai dressing.',
    price: 7.18,
    image: 'https://images.unsplash.com/photo-1601356616077-6957281733aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    calories: 180,
    category: 'soups_salads',
    allergens: ['Fish', 'Onions']
  },

  // --- Noodles ---
  {
    id: 'noodle_1',
    name: 'Pad Thai',
    description: 'Thin rice noodles stir-fried with sweet-and-sour sauce, eggs, bean sprouts, green onions, and salted radish. Topped with peanuts.',
    price: 16.49,
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    calories: 680,
    category: 'noodles',
    isPopular: true,
    allergens: ['Peanuts', 'Eggs', 'Soy', 'Fish', 'Scallions']
  },
  {
    id: 'noodle_2',
    name: 'Pad See Ew',
    description: 'Large rice noodles served with house brand soy sauce, eggs, and Chinese broccoli (Gai Lan).',
    price: 16.49,
    image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    calories: 620,
    category: 'noodles',
    allergens: ['Gluten', 'Eggs', 'Soy', 'Shellfish']
  },
  {
    id: 'noodle_3',
    name: 'Golden Crispy Noodle',
    description: 'Crispy egg noodles topped with stir-fried seasonal vegetables and savory sauce.',
    price: 16.99,
    image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    calories: 710,
    category: 'noodles',
    allergens: ['Gluten', 'Eggs', 'Soy', 'Sesame']
  },

  // --- General Thai ---
  {
    id: 'gen_1',
    name: 'General Thai™ Pineapple',
    description: 'Battered chicken/beef pieces tossed in sweet & sour sauce with pineapple, tomatoes, peppers, and onions.',
    price: 18.29,
    image: 'https://images.unsplash.com/photo-1626804475297-411d863b5285?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    calories: 850,
    category: 'general_thai',
    isPopular: true,
    allergens: ['Gluten', 'Soy', 'Onions']
  },
  {
    id: 'gen_2',
    name: 'General Thai™ Mango',
    description: 'Battered protein tossed in sweet chili sauce with fresh mango slices, peppers, and onions.',
    price: 18.29,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    calories: 820,
    category: 'general_thai',
    allergens: ['Gluten', 'Soy', 'Onions']
  },
  {
    id: 'gen_3',
    name: 'General Curry™',
    description: 'Battered protein topped with your choice of rich red, green, or yellow curry sauce.',
    price: 18.29,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    calories: 880,
    category: 'general_thai',
    allergens: ['Gluten', 'Soy', 'Shellfish', 'Dairy']
  },

  // --- Rice ---
  {
    id: 'rice_1',
    name: 'Thai Fried Rice',
    description: 'Signature fried rice with egg, green onions, carrots, and pineapple/tomato flavor base.',
    price: 16.49,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb74b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    calories: 650,
    category: 'rice',
    allergens: ['Eggs', 'Soy', 'Scallions']
  },
  {
    id: 'rice_2',
    name: 'Basil Fried Rice',
    description: 'Aromatic fried rice with Thai basil, egg, green onions, and carrots.',
    price: 16.49,
    image: 'https://images.unsplash.com/photo-1598215439210-d814d498733e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    calories: 630,
    category: 'rice',
    allergens: ['Eggs', 'Soy', 'Scallions']
  },

  // --- Curries ---
  {
    id: 'curry_1',
    name: 'Green Curry',
    description: 'Spicy coconut milk curry with green chili base, bamboo shoots, and fresh basil. Served with steamed rice.',
    price: 16.49,
    image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    calories: 720,
    category: 'curries',
    isPopular: true,
    allergens: ['Shellfish', 'Fish', 'Soy']
  },
  {
    id: 'curry_2',
    name: 'Red Curry',
    description: 'Medium spice coconut milk curry with red chili base, peppers, and bamboo shoots. Served with steamed rice.',
    price: 16.49,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    calories: 720,
    category: 'curries',
    allergens: ['Shellfish', 'Fish', 'Soy']
  },
  
  // --- Stir Fries ---
  {
    id: 'stir_1',
    name: 'Cashew Stir-Fry',
    description: 'Roasted cashews tossed with vegetables in a savory house sauce. Served with steamed rice.',
    price: 16.49,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    calories: 580,
    category: 'stir_fries',
    allergens: ['Peanuts', 'Soy', 'Gluten', 'Sesame'] // Cashews related to nuts/peanuts often handled together
  },
  {
    id: 'stir_2',
    name: 'Pad Basil',
    description: 'Stir-fry with fresh Thai basil, chilies, and vegetables in a spicy sauce.',
    price: 16.49,
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    calories: 550,
    category: 'stir_fries',
    allergens: ['Soy', 'Shellfish', 'Fish']
  },

  // --- Drinks ---
  {
    id: 'drink_1',
    name: 'Pandan Thai Iced Tea',
    description: 'Sweet and creamy Thai iced tea infused with aromatic pandan leaf.',
    price: 6.00,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    calories: 240,
    category: 'drinks',
    allergens: ['Dairy']
  }
];

export const LOCATIONS: StoreLocation[] = [
  { 
    id: '1', 
    name: 'Thai Express Eaton Centre', 
    address: '705 Rue Saint-Catherine O', 
    distance: '0.4 km', 
    isOpen: true,
    lat: 45.5029,
    lng: -73.5707
  },
  { 
    id: '2', 
    name: 'Thai Express Place Ville Marie', 
    address: '1 Place Ville Marie', 
    distance: '0.6 km', 
    isOpen: true,
    lat: 45.5003,
    lng: -73.5683
  },
  { 
    id: '3', 
    name: 'Thai Express Complex Desjardins', 
    address: '150 Rue Saint-Catherine O', 
    distance: '0.9 km', 
    isOpen: true,
    lat: 45.5074,
    lng: -73.5658
  },
  { 
    id: '4', 
    name: 'Thai Express Faubourg', 
    address: '1616 Rue Saint-Catherine O', 
    distance: '1.5 km', 
    isOpen: true,
    lat: 45.4939,
    lng: -73.5786
  },
  { 
    id: '5', 
    name: 'Thai Express Gare Centrale', 
    address: '895 Rue De la Gauchetière O', 
    distance: '0.8 km', 
    isOpen: false,
    lat: 45.5000,
    lng: -73.5664
  },
];

export const PROTEIN_OPTIONS: ProteinOption[] = [
  {
    id: 'chicken',
    name: 'Chicken',
    price: 0,
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    calories: 150
  },
  {
    id: 'beef',
    name: 'Beef',
    price: 2.00,
    image: 'https://images.unsplash.com/photo-1604908177453-7462950a6a3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    calories: 200
  },
  {
    id: 'shrimp',
    name: 'Shrimp',
    price: 3.00,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    calories: 100
  },
  {
    id: 'tofu',
    name: 'Tofu',
    price: 0,
    image: 'https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    calories: 120
  },
  {
    id: 'veg',
    name: 'Vegetables',
    price: 0,
    image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    calories: 80
  }
];
