import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import NavBar from "../components/auth/nav";
import AddressCard from "../components/auth/AddressCard";
import API_BASE from "../api";
import { User, Mail, Phone, MapPin, Plus, LogOut } from "lucide-react";

const Profile = () => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const email = useSelector((state) => state.user.email);
	const navigate = useNavigate();

	useEffect(() => {
		if (!email) { setLoading(false); return; }
		const fetchProfile = async () => {
			try {
				const response = await axios.get(`${API_BASE}/api/v2/user/profile`, { params: { email } });
				setUser(response.data.user);
			} catch (err) {
				console.error("Error fetching profile:", err);
			} finally {
				setLoading(false);
			}
		};
		fetchProfile();
	}, [email]);

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

	if (!email || !user) {
		return (
			<div className="min-h-screen gradient-bg">
				<NavBar />
				<div className="flex flex-col items-center justify-center py-32">
					<p className="text-slate-400 text-lg mb-4">Please log in to view your profile.</p>
					<button onClick={() => navigate("/login")} className="btn-primary">Sign In</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen gradient-bg">
			<NavBar />
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Profile Header */}
				<div className="card mb-6">
					<div className="flex flex-col sm:flex-row items-center gap-6">
						{/* Avatar */}
						<div className="w-24 h-24 rounded-2xl overflow-hidden ring-2 ring-indigo-500/30 ring-offset-2 ring-offset-slate-900 flex-shrink-0">
							{user.avatar ? (
								<img
									src={`${API_BASE}${user.avatar}`}
									alt={user.name}
									className="w-full h-full object-cover"
								/>
							) : (
								<div className="w-full h-full gradient-primary flex items-center justify-center text-3xl font-bold text-white">
									{user.name?.charAt(0).toUpperCase()}
								</div>
							)}
						</div>
						{/* Info */}
						<div className="text-center sm:text-left flex-1">
							<h1 className="text-2xl font-bold text-white mb-1">{user.name}</h1>
							<div className="flex flex-col sm:flex-row gap-3 text-sm text-slate-400">
								<span className="flex items-center gap-1.5 justify-center sm:justify-start">
									<Mail size={14} className="text-indigo-400" /> {user.email}
								</span>
								<span className="flex items-center gap-1.5 justify-center sm:justify-start">
									<Phone size={14} className="text-indigo-400" /> {user.phoneNumber || "Not set"}
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Addresses */}
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-lg font-semibold text-white flex items-center gap-2">
						<MapPin size={18} className="text-indigo-400" />
						Saved Addresses
					</h2>
					<button
						onClick={() => navigate("/create-address")}
						className="btn-secondary !py-2 !px-3 text-sm flex items-center gap-1.5"
					>
						<Plus size={16} /> Add
					</button>
				</div>

				{user.addresses && user.addresses.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						{user.addresses.map((addr) => (
							<AddressCard key={addr._id} {...addr} />
						))}
					</div>
				) : (
					<div className="card text-center py-12">
						<MapPin size={32} className="text-slate-600 mx-auto mb-3" />
						<p className="text-slate-400">No addresses saved yet.</p>
						<button
							onClick={() => navigate("/create-address")}
							className="btn-primary mt-4 text-sm"
						>
							Add Your First Address
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default Profile;