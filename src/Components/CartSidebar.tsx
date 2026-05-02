import React, { useState } from 'react';
import { useCart, CartItem } from '../context/CartContext';
import '../styles/CartSidebar.css';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const { items, removeFromCart, removeVehicleCart, getTotalPrice } = useCart();

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
  };

  const handleRemoveVehicle = (vehicleVin: string) => {
    removeVehicleCart(vehicleVin);
  };

  // Group items by vehicle VIN
  const groupedByVehicle = items.reduce((acc, item) => {
    const key = item.vehicle.vin || `${item.vehicle.make}-${item.vehicle.model}-${item.vehicle.year}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<string, CartItem[]>);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="cart-overlay" onClick={onClose} />
      )}

      {/* Sidebar */}
      <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="cart-close" onClick={onClose}>×</button>
        </div>

        <div className="cart-content">
          {items.length === 0 ? (
            <div className="cart-empty">
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="cart-items">
              {Object.entries(groupedByVehicle).map(([vehicleKey, vehicleItems]) => {
                const vehicle = vehicleItems[0].vehicle;
                return (
                  <div key={vehicleKey} className="cart-vehicle-group">
                    <div className="vehicle-header">
                      <div className="vehicle-info">
                        <h4>
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </h4>
                        {vehicle.trim && <p className="vehicle-trim">{vehicle.trim}</p>}
                      </div>
                      {vehicleItems[0].imageBase64 && (
                        <img
                          src={vehicleItems[0].imageBase64}
                          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                          className="vehicle-thumbnail"
                        />
                      )}
                    </div>

                    <div className="vehicle-items">
                      {vehicleItems.map((item) => (
                        <div key={item.id} className="cart-item">
                          <div className="item-content">
                            <div className="item-package">
                              {item.packageName && (
                                <span className="package-badge">{item.packageName}</span>
                              )}
                            </div>
                            {item.services.length > 0 && (
                              <div className="item-services">
                                {item.services.map((service, idx) => (
                                  <div key={idx} className="service-detail">
                                    <span className="service-name">{service.title}</span>
                                    <span className="service-price">${service.price}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            <div className="item-total">
                              Total: <strong>${item.totalPrice.toFixed(2)}</strong>
                            </div>
                          </div>
                          <button
                            className="remove-item-btn"
                            onClick={() => handleRemoveItem(item.id)}
                            title="Remove this item"
                          >
                            🗑
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      className="remove-vehicle-btn"
                      onClick={() => handleRemoveVehicle(vehicleKey)}
                    >
                      Remove All for this Vehicle
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-summary">
            <div className="summary-line">
              <span>Total Items:</span>
              <strong>{items.length}</strong>
            </div>
            <div className="summary-line total-line">
              <span>Total Price:</span>
              <strong>${getTotalPrice().toFixed(2)}</strong>
            </div>
          </div>
          <button className="checkout-btn">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
