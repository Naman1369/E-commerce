import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import NavBar from "../components/auth/nav";
import API_BASE from "../api";
import { Upload, X, Image as ImageIcon, Package } from "lucide-react";

const CATEGORIES = ["Fashion", "Electronics", "Books", "Home & Garden", "Sports", "Toys", "Other"];

const CreateProduct = () => {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const email = useSelector((state) => state.user.email);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEdit) {
            axios.get(`${API_BASE}/api/v2/product/product/${id}`)
                .then((res) => {
                    const p = res.data.product;
                    setName(p.name);
                    setDescription(p.description);
                    setCategory(p.category || "");
                    setPrice(p.price);
                    setPreviewImages(p.images.map((img) => `${API_BASE}${img}`));
                })
                .catch((err) => console.error(err));
        }
    }, [id, isEdit]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(prev => [...prev, ...files]);
        const previews = files.map((file) => URL.createObjectURL(file));
        setPreviewImages(prev => [...prev, ...previews]);
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("price", price);
        formData.append("email", email);
        images.forEach((img) => formData.append("images", img));

        try {
            if (isEdit) {
                await axios.put(`${API_BASE}/api/v2/product/update-product/${id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } else {
                await axios.post(`${API_BASE}/api/v2/product/create-product`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }
            navigate("/my-products");
        } catch (err) {
            console.error(err);
            alert("Failed to save product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen gradient-bg">
            <NavBar />
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                        <Package size={20} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">
                        {isEdit ? "Edit Product" : "Create Product"}
                    </h1>
                </div>

                <div className="card">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Product Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input-field"
                                placeholder="e.g. Premium Wireless Headphones"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                            <textarea
                                rows={4}
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="input-field resize-none"
                                placeholder="Describe your product..."
                            />
                        </div>

                        {/* Category + Price */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="input-field"
                                >
                                    <option value="">Select category</option>
                                    {CATEGORIES.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Price ($)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="input-field"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        {/* Images */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Product Images</label>
                            <div className="border-2 border-dashed border-slate-600/50 rounded-xl p-6 text-center hover:border-indigo-500/50 transition-colors cursor-pointer"
                                onClick={() => document.getElementById("product-images").click()}
                            >
                                <ImageIcon size={32} className="text-slate-500 mx-auto mb-2" />
                                <p className="text-slate-400 text-sm">Click to upload images</p>
                                <p className="text-slate-500 text-xs mt-1">PNG, JPG up to 5MB each</p>
                                <input
                                    id="product-images"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </div>

                            {/* Image Previews */}
                            {previewImages.length > 0 && (
                                <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                                    {previewImages.map((src, i) => (
                                        <div key={i} className="relative flex-shrink-0">
                                            <img src={src} alt="" className="w-20 h-20 rounded-xl object-cover ring-1 ring-slate-700" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(i)}
                                                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary !py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : isEdit ? (
                                "Update Product"
                            ) : (
                                "Create Product"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateProduct;