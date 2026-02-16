import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../components/auth/nav";
import { useLocation, useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import API_BASE from "../api";
import { CheckCircle, CreditCard, Truck, Package } from "lucide-react";

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || "test";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addressId, email } = location.state || {};

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  useEffect(() => {
    if (!addressId || !email) { navigate("/select-address"); return; }
    const fetchData = async () => {
      try {
        const [addrRes, cartRes] = await Promise.all([
          axios.get(`${API_BASE}/api/v2/user/addresses`, { params: { email } }),
          axios.get(`${API_BASE}/api/v2/product/cartproducts`, { params: { email } }),
        ]);
        const addr = addrRes.data.addresses.find((a) => a._id === addressId);
        setSelectedAddress(addr || {});
        const items = cartRes.data.cart.map((item) => ({
          _id: item.productId._id,
          name: item.productId.name,
          price: item.productId.price,
          images: item.productId.images.map((p) => `${API_BASE}${p}`),
          quantity: item.quantity,
        }));
        setCartItems(items);
        setTotalPrice(items.reduce((a, i) => a + i.price * i.quantity, 0));
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [addressId, email, navigate]);

  const handlePlaceOrder = async (paymentType = "cod", paypalData = null) => {
    try {
      const orderItems = cartItems.map((item) => ({
        product: item._id, name: item.name, quantity: item.quantity,
        price: item.price, image: item.images?.[0] || "/default-avatar.png",
      }));
      const res = await axios.post(`${API_BASE}/api/v2/orders/place-order`, {
        email, shippingAddress: selectedAddress, orderItems,
        paymentMethod: paymentType, paypalOrderData: paypalData,
      });
      setOrderDetails(res.data.orders);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg">
        <NavBar />
        <div className="flex items-center justify-center py-32">
          <div className="w-12 h-12 border-3 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen gradient-bg">
        <NavBar />
        <div className="flex flex-col items-center justify-center py-32">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <NavBar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-white mb-8 text-center">Order Confirmation</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left — items & address */}
          <div className="flex-1 space-y-4">
            {/* Address */}
            <div className="card">
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Truck size={16} className="text-indigo-400" /> Shipping Address
              </h3>
              <p className="text-white">{selectedAddress?.address1}</p>
              <p className="text-slate-400 text-sm">
                {selectedAddress?.city}, {selectedAddress?.state || selectedAddress?.country} — {selectedAddress?.zipCode}
              </p>
            </div>

            {/* Items */}
            <div className="card">
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Package size={16} className="text-indigo-400" /> Cart Items ({cartItems.length})
              </h3>
              <div className="divide-y divide-slate-700/50">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-4 py-3">
                    <img src={item.images?.[0] || "/default-avatar.png"} alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">{item.name}</p>
                      <p className="text-slate-500 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-white font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — payment & summary */}
          <div className="w-full lg:w-80 space-y-4">
            {/* Payment */}
            <div className="card">
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <CreditCard size={16} className="text-indigo-400" /> Payment
              </h3>
              <div className="space-y-2">
                {[
                  { value: "cod", label: "Cash on Delivery", icon: Truck },
                  { value: "paypal", label: "PayPal", icon: CreditCard },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setPaymentMethod(value)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all border ${paymentMethod === value
                        ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                        : "border-slate-600/50 text-slate-400 hover:border-slate-500"
                      }`}
                  >
                    <Icon size={18} /> {label}
                  </button>
                ))}
              </div>

              {paymentMethod === "paypal" && (
                <div className="mt-4">
                  <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID }}>
                    <PayPalButtons
                      style={{ layout: "vertical", color: "blue", shape: "pill" }}
                      createOrder={(_, actions) =>
                        actions.order.create({ purchase_units: [{ amount: { value: totalPrice.toFixed(2) } }] })
                      }
                      onApprove={async (_, actions) => {
                        const order = await actions.order.capture();
                        handlePlaceOrder("paypal", order);
                      }}
                    />
                  </PayPalScriptProvider>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="card">
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-slate-400 text-sm">
                  <span>Subtotal</span><span className="text-white">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-sm">
                  <span>Shipping</span><span className="text-emerald-400">Free</span>
                </div>
                <div className="border-t border-slate-700 pt-3 flex justify-between">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-xl font-bold text-gradient">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              {paymentMethod === "cod" && (
                <button onClick={() => handlePlaceOrder("cod")} className="w-full btn-success !py-3">
                  Place Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Overlay */}
      {orderDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="card max-w-md w-full text-center animate-slide-up">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={36} className="text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Order Placed!</h2>
            <p className="text-slate-400 mb-6">Your order has been placed successfully.</p>
            <button onClick={() => navigate("/myorders")} className="btn-primary w-full">
              View My Orders
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmation;
