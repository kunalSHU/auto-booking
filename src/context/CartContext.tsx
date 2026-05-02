import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

export interface VehicleData {
  vin: string;
  make: string;
  model: string;
  trim: string;
  year: string;
}

export interface CartService {
  title: string;
  price: string;
  desc: string;
}

export interface CartItem {
  id: string; // unique id for the cart item
  vehicle: VehicleData;
  imageBase64: string | null;
  packageName: string | null; // e.g., 'Bronze', 'Silver', 'Gold', or null if custom services
  services: CartService[]; // selected services
  totalPrice: number; // calculated total
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  removeVehicleCart: (vehicleId: string) => void; // removes all items for a specific vehicle
  updateCartItem: (itemId: string, item: CartItem) => void;
  replacePackageForVehicle: (vehicle: VehicleData, item: CartItem) => void; // replaces package for a vehicle
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (item: CartItem) => {
    const newItem = {
      ...item,
      id: item.id || `${Date.now()}-${Math.random()}`, // Generate unique id if not provided
    };
    setItems([...items, newItem]);
  };

  const removeFromCart = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const removeVehicleCart = (vehicleKey: string) => {
    // vehicleKey can be either a VIN or a "make-model-year" string
    setItems(items.filter(item => {
      const itemKey = item.vehicle.vin || `${item.vehicle.make}-${item.vehicle.model}-${item.vehicle.year}`;
      return itemKey !== vehicleKey;
    }));
  };

  const updateCartItem = (itemId: string, updatedItem: CartItem) => {
    setItems(items.map(item => (item.id === itemId ? updatedItem : item)));
  };

  const replacePackageForVehicle = (vehicle: VehicleData, newItem: CartItem) => {
    // Remove any existing package for this vehicle and add the new one in a single state update
    const filteredItems = items.filter(
      item => !(item.vehicle.make === vehicle.make &&
                item.vehicle.model === vehicle.model &&
                item.vehicle.year === vehicle.year &&
                item.packageName !== null)
    );

    const itemWithId = {
      ...newItem,
      id: newItem.id || `${Date.now()}-${Math.random()}`,
    };

    setItems([...filteredItems, itemWithId]);
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => items.length;

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.totalPrice, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        removeVehicleCart,
        updateCartItem,
        replacePackageForVehicle,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
