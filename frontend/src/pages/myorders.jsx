import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import NavBar from "../components/auth/nav";
import API_BASE from "../api";
import { Package, Clock, CheckCircle, XCircle, Truck } from "lucide-react";

const statusConfig = {
    Processing: { icon: Clock, bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
    Delivered: { icon: CheckCircle, bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
    Cancelled: { icon: XCircle, bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
    Shipped: { icon: Truck, bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
};

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const email = useSelector((state) => state.user.email);

    useEffect(() => {
        if (!email) return;
        axios.get(`${API_BASE}/api/v2/orders/my-orders`, { params: { email } })
            .then(res => { setOrders(res.data.orders || []); setLoading(false); })
            .catch(err => { setError(err.message); setLoading(false); });
    }, [email]);

    const handleCancel = async (orderId) => {
        if (!confirm("Cancel this order?")) return;
        try {
            await axios.put(`${API_BASE}/api/v2/orders/cancel-order/${orderId}`);
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: "Cancelled" } : o));
        } catch (err) {
            alert("Failed to cancel order");
        }
    };

    return (
        <div className="min-h-screen gradient-bg">
            <NavBar />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                        <Package size={20} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">My Orders</h1>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-12 h-12 border-3 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="text-red-400 mb-4">{error}</p>
                        <button onClick={() => window.location.reload()} className="btn-primary">Retry</button>
                    </div>
                ) : orders.length > 0 ? (
                    <div className="space-y-4">
                        {orders.map((order, i) => {
                            const cfg = statusConfig[order.orderStatus] || statusConfig.Processing;
                            const StatusIcon = cfg.icon;
                            return (
                                <div key={order._id} className="card animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                                        <div>
                                            <p className="text-xs text-slate-500 font-mono">#{order._id.slice(-8).toUpperCase()}</p>
                                            <p className="text-xs text-slate-500">
                                                {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`badge ${cfg.bg} ${cfg.text} border ${cfg.border} flex items-center gap-1`}>
                                                <StatusIcon size={12} /> {order.orderStatus}
                                            </span>
                                            {order.orderStatus === "Processing" && (
                                                <button onClick={() => handleCancel(order._id)} className="btn-danger !py-1 !px-3 text-xs">
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="divide-y divide-slate-700/50">
                                        {order.orderItems.map((item, j) => (
                                            <div key={j} className="flex items-center gap-3 py-3">
                                                <img
                                                    src={item.image ? (item.image.startsWith("http") ? item.image : `${API_BASE}${item.image}`) : "/default-avatar.png"}
                                                    alt={item.name}
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white text-sm font-medium truncate">{item.name}</p>
                                                    <p className="text-slate-500 text-xs">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                                                </div>
                                                <span className="text-white text-sm font-semibold">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-t border-slate-700/50 pt-3 mt-1 text-right">
                                        <span className="text-slate-400 text-sm mr-2">Total:</span>
                                        <span className="text-lg font-bold text-gradient">${order.totalAmount?.toFixed(2)}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="card text-center py-16">
                        <Package size={40} className="text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2">No orders yet</h3>
                        <p className="text-slate-400">Your orders will appear here after checkout.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
