import React, { useEffect, useState } from "react";
import MyProduct from "../components/auth/myProduct";
import NavBar from '../components/auth/nav';
import { useSelector } from 'react-redux';
import API_BASE from '../api';

export default function MyProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const email = useSelector((state) => state.user.email)

    useEffect(() => {
        if (!email) {
            setLoading(false);
            return;
        }
        fetch(`${API_BASE}/api/v2/product/my-products?email=${email}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                setProducts(data.products);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching products:", err);
                setError(err.message);
                setLoading(false);
            });
    }, [email]);

    if (loading) {
        return (
            <>
                <NavBar />
                <div className="w-full min-h-screen bg-neutral-800 flex items-center justify-center">
                    <div className="text-center text-white text-lg">Loading products...</div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <NavBar />
                <div className="w-full min-h-screen bg-neutral-800 flex items-center justify-center">
                    <div className="text-center text-red-500 text-lg">Error: {error}</div>
                </div>
            </>
        );
    }

    return (
        <>
            <NavBar />
            <div className="w-full min-h-screen bg-neutral-800">
                <h1 className="text-3xl text-center text-white py-6">My Products</h1>
                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
                        {products.map((product) => (
                            <MyProduct key={product._id} {...product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-neutral-400 py-10 text-lg">
                        No products found. Create your first product!
                    </div>
                )}
            </div>
        </>
    );
}