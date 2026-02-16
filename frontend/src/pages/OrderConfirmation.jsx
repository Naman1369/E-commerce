// OrderConfirmation.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Nav from '../components/auth/nav';
import { useLocation, useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import API_BASE from '../api';

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
    if (!addressId || !email) {
      navigate('/select-address');
      return;
    }

    const fetchData = async () => {
      try {
        const [addressResponse, cartResponse] = await Promise.all([
          axios.get(`${API_BASE}/api/v2/user/addresses`, { params: { email } }),
          axios.get(`${API_BASE}/api/v2/product/cartproducts`, { params: { email } })
        ]);

        const address = addressResponse.data.addresses.find(addr => addr._id === addressId);
        setSelectedAddress(address || {});

        const processedCartItems = cartResponse.data.cart.map(item => ({
          _id: item.productId._id,
          name: item.productId.name,
          price: item.productId.price,
          images: item.productId.images.map(imagePath => `${API_BASE}${imagePath}`),
          quantity: item.quantity,
        }));
        setCartItems(processedCartItems);
        setTotalPrice(processedCartItems.reduce((acc, item) => acc + item.price * item.quantity, 0));
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [addressId, email, navigate]);

  const handlePlaceOrder = async (paymentType = "cod", paypalOrderData = null) => {
    try {
      const orderItems = cartItems.map((item) => ({
        product: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.images && item.images.length > 0 ? item.images[0] : "/default-avatar.png",
      }));

      const payload = {
        email,
        shippingAddress: selectedAddress,
        orderItems,
        paymentMethod: paymentType,
        paypalOrderData,
      };

      const response = await axios.post(
        `${API_BASE}/api/v2/orders/place-order`,
        payload
      );
      setOrderDetails(response.data.orders);
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p className="text-lg">Processing...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center">
        <p className="text-red-500 text-lg mb-4">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  const closePopup = () => {
    navigate('/myorders');
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-100 to-blue-200">
      <Nav />
      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-center mb-8">
          Order Confirmation
        </h2>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Shipping Address</h3>
            <p>
              {selectedAddress?.address1}, {selectedAddress?.city},{" "}
              {selectedAddress?.state}, {selectedAddress?.zipCode}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Cart Items</h3>
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between p-4 border-b"
                >
                  <img
                    src={item.images[0] || "/default-avatar.png"}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 ml-4">
                    <h4 className="font-medium">{item.name}</h4>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-bold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-red-500">No items in cart</p>
            )}
          </div>

          {/* Total */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">Total: <span className="text-green-600">${totalPrice.toFixed(2)}</span></h3>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-medium mb-2">Payment Method</h3>
            <div className="p-4 border rounded-md space-x-4">
              <label className="mr-4 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                <span className="ml-2">Cash on Delivery</span>
              </label>
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={() => setPaymentMethod("paypal")}
                />
                <span className="ml-2">Pay Online (PayPal)</span>
              </label>
            </div>
            {paymentMethod === "paypal" && (
              <div className="mt-4" style={{ maxWidth: "500px" }}>
                <PayPalScriptProvider
                  options={{
                    "client-id": PAYPAL_CLIENT_ID,
                  }}
                >
                  <PayPalButtons
                    style={{ layout: "vertical" }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: totalPrice.toFixed(2),
                            },
                          },
                        ],
                      });
                    }}
                    onApprove={async (data, actions) => {
                      const order = await actions.order.capture();
                      console.log("PayPal order success:", order);
                      handlePlaceOrder("paypal", order);
                    }}
                    onError={(err) => {
                      console.error("PayPal checkout error:", err);
                    }}
                  />
                </PayPalScriptProvider>
              </div>
            )}
          </div>

          {/* COD Button */}
          {paymentMethod === "cod" && (
            <div className="flex justify-center">
              <button
                onClick={() => handlePlaceOrder("cod", null)}
                className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors"
              >
                Place Order
              </button>
            </div>
          )}
        </div>

        {/* Order Success Popup */}
        {orderDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl relative">
              <h2 className="text-2xl font-bold mb-4">
                Order Placed Successfully!
              </h2>
              {orderDetails.map((order, index) => (
                <div key={index} className="mb-6">
                  <h3 className="text-xl font-semibold">Order #{index + 1}</h3>
                  <p>Total Amount: ${order.totalAmount}</p>
                  <h4 className="font-medium mt-4">Items:</h4>
                  <ul className="list-disc ml-6">
                    {order.orderItems.map((item, i) => (
                      <li key={i}>
                        {item.name} - {item.quantity} x ${item.price}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <button
                onClick={closePopup}
                className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                View My Orders
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmation;
