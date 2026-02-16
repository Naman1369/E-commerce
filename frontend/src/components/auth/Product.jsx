import PropTypes from "prop-types";
import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE from "../../api";
import { Eye } from "lucide-react";

const Product = ({ _id, name, images, description, price }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!images || images.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [images]);

  const currentImage =
    images && images.length > 0 ? images[currentIndex] : null;

  return (
    <div
      className="card group cursor-pointer overflow-hidden !p-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/product/${_id}`)}
    >
      {/* Image */}
      <div className="relative w-full h-52 overflow-hidden">
        {currentImage ? (
          <img
            src={`${API_BASE}${currentImage}`}
            alt={name}
            className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? "scale-110" : "scale-100"
              }`}
          />
        ) : (
          <div className="w-full h-full bg-slate-800 flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-slate-600" />
          </div>
        )}
        {/* Overlay on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent 
          flex items-end justify-center pb-4 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"
            }`}
        >
          <span className="flex items-center gap-2 text-white text-sm font-medium bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <Eye size={16} /> View Details
          </span>
        </div>
        {/* Image dots */}
        {images && images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentIndex
                    ? "bg-indigo-400 w-4"
                    : "bg-white/40"
                  }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-white font-semibold text-base truncate mb-1">
          {name}
        </h3>
        <p className="text-slate-400 text-sm line-clamp-2 mb-3 leading-relaxed">
          {description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gradient">
            ${price.toFixed(2)}
          </span>
          <button
            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${_id}`);
            }}
          >
            More Info →
          </button>
        </div>
      </div>
    </div>
  );
};

Product.propTypes = {
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
};

export default Product;