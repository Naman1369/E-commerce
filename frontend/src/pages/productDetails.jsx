import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import NavBar from "../components/auth/nav";
import API_BASE from "../api";
import { ShoppingCart, Check, ChevronLeft, ChevronRight, Star } from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const email = useSelector((state) => state.user.email);
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/v2/product/product/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data.product);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = async () => {
    if (!email) {
      navigate("/login");
      return;
    }
    setAdding(true);
    try {
      await axios.post(`${API_BASE}/api/v2/product/cart`, {
        email,
        productId: id,
        quantity: 1,
      });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    } catch (err) {
      console.error("Error adding to cart:", err);
    } finally {
      setAdding(false);
    }
  };

  const nextImage = () => {
    if (product.images?.length > 0) {
      setCurrentImage((prev) => (prev + 1) % product.images.length);
    }
  };
  const prevImage = () => {
    if (product.images?.length > 0) {
      setCurrentImage((prev) => (prev - 1 + product.images.length) % product.images.length);
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

  if (error || !product) {
    return (
      <div className="min-h-screen gradient-bg">
        <NavBar />
        <div className="flex flex-col items-center justify-center py-32">
          <p className="text-red-400 text-lg mb-4">{error || "Product not found"}</p>
          <button onClick={() => navigate("/")} className="btn-primary">Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <NavBar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-slate-400 hover:text-white text-sm mb-6 transition-colors"
        >
          <ChevronLeft size={16} /> Back
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Image Gallery */}
          <div className="flex-1">
            <div className="card !p-0 overflow-hidden relative">
              <div className="aspect-square w-full">
                {product.images?.length > 0 ? (
                  <img
                    src={`${API_BASE}${product.images[currentImage]}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                    <span className="text-slate-600 text-lg">No Image</span>
                  </div>
                )}
              </div>
              {/* Nav arrows */}
              {product.images?.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl glass flex items-center justify-center text-white hover:bg-white/20 transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl glass flex items-center justify-center text-white hover:bg-white/20 transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>
            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${i === currentImage
                        ? "border-indigo-500 ring-2 ring-indigo-500/30"
                        : "border-slate-700 hover:border-slate-500"
                      }`}
                  >
                    <img src={`${API_BASE}${img}`} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 lg:max-w-md">
            <div className="card">
              {/* Category badge */}
              {product.category && (
                <span className="badge bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
                  {product.category}
                </span>
              )}

              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                {product.name}
              </h1>

              {/* Rating placeholder */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < 4 ? "text-amber-400 fill-amber-400" : "text-slate-600"} />
                ))}
                <span className="text-slate-400 text-sm ml-2">4.0</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-3xl font-bold text-gradient">${product.price.toFixed(2)}</span>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-300 mb-2">Description</h3>
                <p className="text-slate-400 leading-relaxed">{product.description}</p>
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span className="text-sm text-emerald-400">In Stock</span>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={adding || addedToCart}
                className={`w-full py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 ${addedToCart
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "btn-primary disabled:opacity-50"
                  }`}
              >
                {addedToCart ? (
                  <>
                    <Check size={20} /> Added to Cart
                  </>
                ) : adding ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <ShoppingCart size={20} /> Add to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;