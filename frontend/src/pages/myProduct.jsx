import React, { useEffect, useState } from "react";
import NavBar from "../components/auth/nav";
import MyProduct from "../components/auth/myProduct";
import { useSelector } from "react-redux";
import API_BASE from "../api";
import { Package, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MyProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const email = useSelector((state) => state.user.email);
    const navigate = useNavigate();

    useEffect(() => {
        if (!email) { setLoading(false); return; }
        fetch(`${API_BASE}/api/v2/product/my-products?email=${email}`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load products");
                return res.json();
            })
            .then((data) => {
                setProducts(data.products || []);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [email]);

    return (
        <div className="min-h-screen gradient-bg">
            <NavBar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                            <Package size={20} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">My Products</h1>
                            <p className="text-slate-400 text-sm">{products.length} listed</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate("/create-product")}
                        className="btn-primary flex items-center gap-2 text-sm"
                    >
                        <Plus size={18} /> New Product
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-3 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-400">Loading your products...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="text-red-400 text-lg mb-4">{error}</p>
                        <button onClick={() => window.location.reload()} className="btn-primary">Retry</button>
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {products.map((product, index) => (
                            <div key={product._id} className="animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                                <MyProduct {...product} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-6">
                            <Package size={40} className="text-slate-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No products yet</h3>
                        <p className="text-slate-400 mb-6">Start selling by creating your first product.</p>
                        <button onClick={() => navigate("/create-product")} className="btn-primary">
                            Create Product
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}