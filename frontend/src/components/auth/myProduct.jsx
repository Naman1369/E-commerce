import PropTypes from "prop-types";
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import API_BASE from "../../api";
import { Edit3, Trash2 } from "lucide-react";

const MyProduct = ({ _id, name, images, description, price }) => {
    const navigate = useNavigate();
    const email = useSelector((state) => state.user.email);

    const handleDelete = async () => {
        if (!window.confirm("Delete this product permanently?")) return;
        try {
            await axios.delete(`${API_BASE}/api/v2/product/delete-product/${_id}`, {
                data: { email },
            });
            window.location.reload();
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const imgSrc = images && images.length > 0 ? `${API_BASE}${images[0]}` : "/default-avatar.png";

    return (
        <div className="card !p-0 overflow-hidden group">
            {/* Image */}
            <div className="relative w-full h-48 overflow-hidden">
                <img
                    src={imgSrc}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Action buttons overlay */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={() => navigate(`/create-product/${_id}`)}
                        className="w-9 h-9 rounded-xl bg-slate-900/80 backdrop-blur-sm border border-slate-600/30 flex items-center justify-center text-indigo-400 hover:text-white hover:bg-indigo-500 transition-all"
                    >
                        <Edit3 size={16} />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="w-9 h-9 rounded-xl bg-slate-900/80 backdrop-blur-sm border border-slate-600/30 flex items-center justify-center text-red-400 hover:text-white hover:bg-red-500 transition-all"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="text-white font-semibold truncate mb-1">{name}</h3>
                <p className="text-slate-400 text-sm line-clamp-2 mb-3">{description}</p>
                <p className="text-lg font-bold text-gradient">${price.toFixed(2)}</p>
            </div>
        </div>
    );
};

MyProduct.propTypes = {
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.string,
    price: PropTypes.number.isRequired,
};

export default MyProduct;
