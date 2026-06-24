import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import OryginStar from './OryginStar';

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, total, count, isOpen, closeCart } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black-1/70 backdrop-blur-sm"
        onClick={closeCart}
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-md z-50 bg-black-2 border-l border-black-3 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-black-3">
          <div className="flex items-center gap-3">
            <OryginStar size={20} />
            <span className="text-[9px] tracking-[4px] text-white">PANIER</span>
            {count > 0 && (
              <span className="text-[9px] tracking-[2px] text-gold">({count})</span>
            )}
          </div>
          <button onClick={closeCart} className="text-gray-3 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag size={40} className="text-gray-2" />
              <p className="text-[10px] tracking-[3px] text-gray-1">VOTRE PANIER EST VIDE</p>
              <button
                onClick={closeCart}
                className="text-[8px] tracking-[4px] text-gold border border-gold-dark px-6 py-2 hover:bg-gold hover:text-black-1 transition-all duration-300"
              >
                EXPLORER
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={`${item.product.id}-${item.size}`} className="flex gap-4">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-20 h-24 object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-cormorant italic text-sm text-white leading-tight mb-1">
                    {item.product.name}
                  </div>
                  <div className="text-[9px] tracking-[2px] text-gray-1 mb-3">
                    {item.countryName} · {item.size}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 border border-black-3">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                        className="px-2 py-1 text-gray-3 hover:text-white transition-colors"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="text-xs text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                        className="px-2 py-1 text-gray-3 hover:text-white transition-colors"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                    <div className="font-cormorant italic text-gold text-sm">
                      {item.product.price * item.quantity} €
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id, item.size)}
                    className="text-[8px] tracking-[2px] text-gray-1 hover:text-white mt-2 transition-colors"
                  >
                    RETIRER
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-8 py-6 border-t border-black-3 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[9px] tracking-[4px] text-gray-3">TOTAL</span>
              <span className="font-cormorant italic text-xl text-gold">{total} €</span>
            </div>
            <Link
              to="/checkout"
              onClick={closeCart}
              className="block w-full bg-gold text-black-1 py-3 text-[9px] tracking-[4px] hover:bg-gold-light transition-colors duration-300 text-center"
            >
              PASSER COMMANDE →
            </Link>
            <p className="text-[8px] tracking-[2px] text-gray-2 text-center">
              LIVRAISON MONDIALE · PIÈCES LIMITÉES
            </p>
          </div>
        )}
      </div>
    </>
  );
}
