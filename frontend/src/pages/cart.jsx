import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import NavBar from "../components/auth/nav";
import CartProduct from "../components/auth/CartProduct";
import API_BASE from "../api";
import { ShoppingCart, ArrowRight, Package } from "lucide-react";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const email = useSelector((state) => state.user.email);
  const navigate = useNavigate();

  const fetchCart = async () => {
    if (!email) { setLoading(false); return; }
    try {
      const response = await axios.get(`${API_BASE}/api/v2/product/cartproducts`, { params: { email } });
      setCartItems(response.data.cart || []);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, [email]);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.productId?.price || 0) * item.quantity, 0
  );

  const handleQuantityChange = (productId, newQty) => {
    setCartItems(prev =>
      prev.map(item =>
        item.productId?._id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  return (
    <div className="min-h-screen gradient-bg">
      <NavBar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <ShoppingCart size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Shopping Cart</h1>
            <p className="text-slate-400 text-sm">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-3 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400">Loading cart...</p>
          </div>
        ) : cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Cart Items */}
            <div className="flex-1 space-y-3">
              {cartItems.map((item) => (
                <CartProduct
                  key={item.productId?._id}
                  _id={item.productId?._id}
                  name={item.productId?.name}
                  images={item.productId?.images}
                  price={item.productId?.price || 0}
                  quantity={item.quantity}
                  onQuantityChange={handleQuantityChange}
                />
              ))}
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-80">
              <div className="card sticky top-24">
                <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-slate-400 text-sm">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span className="text-white">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-sm">
                    <span>Shipping</span>
                    <span className="text-emerald-400">Free</span>
                  </div>
                  <div className="border-t border-slate-700 pt-3 flex justify-between">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-xl font-bold text-gradient">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/select-address")}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  Checkout <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-6">
              <Package size={40} className="text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Your cart is empty</h3>
            <p className="text-slate-400 mb-6">Looks like you haven't added anything yet.</p>
            <button onClick={() => navigate("/")} className="btn-primary">
              Browse Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;