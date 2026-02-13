import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('labcel_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('labcel_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (item) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(
        i => i.product_id === item.product_id && 
             i.phone_model === item.phone_model &&
             i.custom_image_url === item.custom_image_url
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += item.quantity;
        toast.success('Cantidad actualizada en el carrito');
        return updated;
      }

      toast.success('Producto añadido al carrito');
      return [...prev, { ...item, id: Date.now() }];
    });
  };

  const removeItem = (itemId) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
    toast.info('Producto eliminado del carrito');
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity < 1) return;
    setItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotal = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ 
      items, 
      addItem, 
      removeItem, 
      updateQuantity, 
      clearCart, 
      getTotal,
      getItemCount 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
