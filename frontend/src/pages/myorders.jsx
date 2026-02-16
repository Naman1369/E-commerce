import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Nav from '../components/auth/nav'
import API_BASE from '../api';

const MyOrders = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const email = useSelector((state) => state.user.email)

    useEffect(() => {
        if (!email) return;
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${API_BASE}/api/v2/orders/my-orders`, {
                    params: { email }
                })
                setOrders(response.data.orders)
                setLoading(false)
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'An unexpected error occurred.')
                setLoading(false)
            }
        }
        fetchOrders()
    }, [email])

    const handleCancelOrder = async (orderId) => {
        try {
            await axios.put(`${API_BASE}/api/v2/orders/cancel-order/${orderId}`)
            setOrders(orders.map(order =>
                order._id === orderId
                    ? { ...order, orderStatus: 'Cancelled' }
                    : order
            ))
        } catch (err) {
            console.error('Error cancelling order:', err)
            alert('Failed to cancel order')
        }
    }

    if (loading) {
        return (
            <>
                <Nav />
                <div className="w-full min-h-screen flex justify-center items-center">
                    <p className="text-lg">Loading orders...</p>
                </div>
            </>
        )
    }

    if (error) {
        return (
            <>
                <Nav />
                <div className="w-full min-h-screen flex flex-col justify-center items-center">
                    <p className="text-red-500 text-lg mb-4">Error: {error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                        Retry
                    </button>
                </div>
            </>
        )
    }

    return (
        <>
            <Nav />
            <div className="w-full min-h-screen bg-gray-50">
                <div className="max-w-5xl mx-auto p-6">
                    <h2 className="text-3xl font-bold text-center mb-8">My Orders</h2>
                    {orders.length > 0 ? (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div key={order._id} className="bg-white p-6 rounded-lg shadow-lg">
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                                            <p className="text-sm text-gray-500">
                                                Date: {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.orderStatus === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                                                    order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                        order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                            'bg-blue-100 text-blue-700'
                                                }`}>
                                                {order.orderStatus}
                                            </span>
                                            {order.orderStatus === 'Processing' && (
                                                <button
                                                    onClick={() => handleCancelOrder(order._id)}
                                                    className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="border-t pt-4">
                                        {order.orderItems.map((item, i) => (
                                            <div key={i} className="flex items-center justify-between py-2">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={item.image ? `${API_BASE}${item.image}` : '/default-avatar.png'}
                                                        alt={item.name}
                                                        className="w-16 h-16 object-cover rounded-md"
                                                    />
                                                    <div>
                                                        <p className="font-medium">{item.name}</p>
                                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                    </div>
                                                </div>
                                                <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-t pt-2 mt-2 text-right">
                                        <p className="text-lg font-bold">Total: ${order.totalAmount?.toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-10 text-lg">
                            No orders found.
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default MyOrders;
