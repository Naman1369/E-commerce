import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/auth/nav";
import { useSelector } from "react-redux";
import API_BASE from "../api";
import { MapPin, Home, Briefcase, MoreHorizontal } from "lucide-react";

const CreateAddress = () => {
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [addressType, setAddressType] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const email = useSelector((state) => state.user.email);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API_BASE}/api/v2/user/add-address`, {
                email, country, city, address1, address2,
                zipCode: Number(zipCode), addressType,
            });
            navigate("/profile");
        } catch (err) {
            console.error(err);
            alert("Failed to add address");
        } finally {
            setLoading(false);
        }
    };

    const types = [
        { value: "Home", icon: Home, label: "Home" },
        { value: "Office", icon: Briefcase, label: "Office" },
        { value: "Other", icon: MoreHorizontal, label: "Other" },
    ];

    return (
        <div className="min-h-screen gradient-bg">
            <NavBar />
            <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                        <MapPin size={20} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Add Address</h1>
                </div>

                <div className="card">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Country</label>
                                <input required value={country} onChange={(e) => setCountry(e.target.value)} className="input-field" placeholder="Country" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">City</label>
                                <input required value={city} onChange={(e) => setCity(e.target.value)} className="input-field" placeholder="City" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Address Line 1</label>
                            <input required value={address1} onChange={(e) => setAddress1(e.target.value)} className="input-field" placeholder="Street address" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Address Line 2 <span className="text-slate-500">(optional)</span></label>
                            <input value={address2} onChange={(e) => setAddress2(e.target.value)} className="input-field" placeholder="Apt, suite, etc." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Zip Code</label>
                            <input required type="number" value={zipCode} onChange={(e) => setZipCode(e.target.value)} className="input-field" placeholder="12345" />
                        </div>

                        {/* Address Type */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Address Type</label>
                            <div className="grid grid-cols-3 gap-3">
                                {types.map(({ value, icon: Icon, label }) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => setAddressType(value)}
                                        className={`py-3 rounded-xl flex flex-col items-center gap-1.5 text-sm font-medium transition-all border ${addressType === value
                                                ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                                                : "border-slate-600/50 text-slate-400 hover:border-slate-500 hover:bg-slate-800/50"
                                            }`}
                                    >
                                        <Icon size={20} />
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary !py-3 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                "Save Address"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateAddress;
