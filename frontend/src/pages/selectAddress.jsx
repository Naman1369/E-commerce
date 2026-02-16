import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import NavBar from "../components/auth/nav";
import API_BASE from "../api";
import { MapPin, Plus, ChevronRight, Home, Briefcase, MoreHorizontal } from "lucide-react";

const iconMap = { Home, Office: Briefcase, Other: MoreHorizontal };

const SelectAddress = () => {
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const email = useSelector((state) => state.user.email);

    useEffect(() => {
        if (!email) return;
        fetch(`${API_BASE}/api/v2/user/addresses?email=${email}`)
            .then(res => res.json())
            .then(data => { setAddresses(data.addresses || []); setLoading(false); })
            .catch(() => setLoading(false));
    }, [email]);

    const handleContinue = () => {
        if (!selectedAddress) { alert("Please select an address"); return; }
        navigate("/order-confirmation", { state: { addressId: selectedAddress, email } });
    };

    return (
        <div className="min-h-screen gradient-bg">
            <NavBar />
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                        <MapPin size={20} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Select Address</h1>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-12 h-12 border-3 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                    </div>
                ) : addresses.length > 0 ? (
                    <div className="space-y-3">
                        {addresses.map((addr) => {
                            const Icon = iconMap[addr.addressType] || MapPin;
                            return (
                                <div
                                    key={addr._id}
                                    onClick={() => setSelectedAddress(addr._id)}
                                    className={`card !p-4 cursor-pointer flex items-center gap-4 transition-all ${selectedAddress === addr._id
                                            ? "!border-indigo-500 ring-2 ring-indigo-500/20"
                                            : ""
                                        }`}
                                >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${selectedAddress === addr._id ? "border-indigo-500" : "border-slate-600"
                                        }`}>
                                        {selectedAddress === addr._id && (
                                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                        )}
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                                        <Icon size={18} className="text-indigo-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-medium text-sm">{addr.address1}</p>
                                        <p className="text-slate-400 text-sm truncate">
                                            {addr.city}, {addr.country} — {addr.zipCode}
                                        </p>
                                    </div>
                                    <span className="badge bg-slate-700 text-slate-300 text-xs">{addr.addressType}</span>
                                </div>
                            );
                        })}

                        <div className="flex justify-between pt-4">
                            <button onClick={() => navigate("/create-address")} className="btn-secondary flex items-center gap-1.5 text-sm">
                                <Plus size={16} /> New Address
                            </button>
                            <button onClick={handleContinue} className="btn-primary flex items-center gap-1.5">
                                Continue <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="card text-center py-16">
                        <MapPin size={40} className="text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2">No addresses found</h3>
                        <p className="text-slate-400 mb-6">Add a shipping address to continue.</p>
                        <button onClick={() => navigate("/create-address")} className="btn-primary">
                            Add Address
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SelectAddress;
