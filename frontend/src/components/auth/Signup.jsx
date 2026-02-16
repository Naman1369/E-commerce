import { React, useState } from "react";
import { Link } from "react-router-dom";
import { RxAvatar } from "react-icons/rx";
import axios from "axios";
import ValidationFormObject from "../../../validation";
import API_BASE from "../../api";
import { ShoppingBag, Mail, Lock, User, Eye, EyeOff, Upload, CheckCircle } from "lucide-react";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [visible, setVisible] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handelFileSubmit = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
        }
    };

    const validateFields = () => {
        const nameError = ValidationFormObject.validateName(name);
        const emailError = ValidationFormObject.validateEmail(email);
        const passwordError = ValidationFormObject.validatePassword(password);
        const newErrors = {};
        if (nameError !== true) newErrors.name = nameError;
        if (emailError !== true) newErrors.email = emailError;
        if (passwordError !== true) newErrors.password = passwordError;
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handelSubmit = async (e) => {
        e.preventDefault();
        if (!validateFields()) return;

        setLoading(true);
        const newForm = new FormData();
        newForm.append("file", avatar);
        newForm.append("name", name);
        newForm.append("email", email);
        newForm.append("password", password);

        try {
            await axios.post(`${API_BASE}/api/v2/user/create-user`, newForm, {
                headers: { "Content-type": "multipart/form-data" },
            });
            setSuccess(true);
        } catch (err) {
            setErrors({ general: err.response?.data?.message || "Registration failed" });
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
                <div className="card text-center max-w-md animate-slide-up">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} className="text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Account Created!</h2>
                    <p className="text-slate-400 mb-6">You can now sign in to your account.</p>
                    <Link to="/login" className="btn-primary inline-block">
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
            {/* Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-md relative animate-slide-up">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <ShoppingBag size={24} className="text-white" />
                        </div>
                        <span className="text-3xl font-bold text-gradient">ShopNest</span>
                    </div>
                    <p className="text-slate-400">Create your account to get started.</p>
                </div>

                <div className="card">
                    <form className="space-y-4" onSubmit={handelSubmit}>
                        {errors.general && (
                            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                {errors.general}
                            </div>
                        )}

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                            <div className="relative">
                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={`input-field !pl-11 ${errors.name ? "!border-red-500/50 !ring-red-500/20" : ""}`}
                                />
                            </div>
                            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`input-field !pl-11 ${errors.email ? "!border-red-500/50 !ring-red-500/20" : ""}`}
                                />
                            </div>
                            {errors.email && <p className="text-red-400 text-xs mt-1">{typeof errors.email === 'string' ? errors.email : errors.email.error}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type={visible ? "text" : "password"}
                                    placeholder="Min 8 chars, 1 upper, 1 special"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`input-field !pl-11 !pr-11 ${errors.password ? "!border-red-500/50 !ring-red-500/20" : ""}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setVisible(!visible)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                        </div>

                        {/* Avatar */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Profile Picture</label>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-600/50 flex items-center justify-center overflow-hidden">
                                    {avatar ? (
                                        <img
                                            src={URL.createObjectURL(avatar)}
                                            alt="avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <RxAvatar className="w-8 h-8 text-slate-500" />
                                    )}
                                </div>
                                <label
                                    htmlFor="file-input"
                                    className="btn-secondary !py-2 !px-4 text-sm cursor-pointer flex items-center gap-2"
                                >
                                    <Upload size={16} />
                                    Upload
                                    <input
                                        type="file"
                                        name="avatar"
                                        id="file-input"
                                        accept=".jpg,.jpeg,.png"
                                        onChange={handelFileSubmit}
                                        className="sr-only"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary !py-3 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                "Create Account"
                            )}
                        </button>

                        <p className="text-center text-slate-400 text-sm">
                            Already have an account?{" "}
                            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
