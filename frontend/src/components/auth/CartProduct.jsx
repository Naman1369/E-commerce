import PropTypes from "prop-types";
import React from "react";
import axios from "axios";
import API_BASE from "../../api";
import { useSelector } from "react-redux";
import { Minus, Plus, Trash2 } from "lucide-react";

const CartProduct = ({ _id, name, images, price, quantity, onQuantityChange, onRemove }) => {
    const email = useSelector((state) => state.user.email);

    const updateQuantity = async (newQty) => {
        if (newQty < 1) return;
        try {
            await axios.put(`${API_BASE}/api/v2/product/cartproduct/quantity`, {
                email,
                productId: _id,
                quantity: newQty,
            });
            onQuantityChange && onQuantityChange(_id, newQty);
        } catch (err) {
            console.error("Error updating quantity:", err);
        }
    };

    const imgSrc = images && images.length > 0 ? `${API_BASE}${images[0]}` : "/default-avatar.png";

    return (
        <div className="card !p-4 flex flex-col sm:flex-row items-center gap-4 group">
            {/* Image */}
            <div className="w-full sm:w-24 h-32 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-slate-800">
                <img src={imgSrc} alt={name} className="w-full h-full object-cover" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 text-center sm:text-left">
                <h4 className="text-white font-semibold truncate">{name}</h4>
                <p className="text-indigo-400 font-bold mt-1">${price.toFixed(2)}</p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-0 bg-slate-800/80 rounded-xl border border-slate-600/30">
                    <button
                        onClick={() => updateQuantity(quantity - 1)}
                        className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 rounded-l-xl transition-colors"
                    >
                        <Minus size={16} />
                    </button>
                    <span className="w-10 text-center text-white font-medium text-sm">{quantity}</span>
                    <button
                        onClick={() => updateQuantity(quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 rounded-r-xl transition-colors"
                    >
                        <Plus size={16} />
                    </button>
                </div>
            </div>

            {/* Subtotal */}
            <div className="text-right min-w-[80px]">
                <p className="text-xs text-slate-500">Subtotal</p>
                <p className="text-white font-bold">${(price * quantity).toFixed(2)}</p>
            </div>

            {/* Remove */}
            {onRemove && (
                <button
                    onClick={() => onRemove(_id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                    <Trash2 size={18} />
                </button>
            )}
        </div>
    );
};

CartProduct.propTypes = {
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.string),
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    onQuantityChange: PropTypes.func,
    onRemove: PropTypes.func,
};

export default CartProduct;
