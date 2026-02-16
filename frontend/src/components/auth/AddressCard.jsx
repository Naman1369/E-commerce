import React from "react";
import PropTypes from "prop-types";
import { MapPin, Home, Briefcase, MoreHorizontal } from "lucide-react";

const iconMap = {
    Home: Home,
    Office: Briefcase,
    Other: MoreHorizontal,
};

const AddressCard = ({ address1, address2, city, country, zipCode, addressType }) => {
    const Icon = iconMap[addressType] || MapPin;

    return (
        <div className="card !p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-indigo-400" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className="badge bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {addressType || "Address"}
                    </span>
                </div>
                <p className="text-white text-sm font-medium">{address1}</p>
                {address2 && <p className="text-slate-400 text-sm">{address2}</p>}
                <p className="text-slate-400 text-sm">
                    {city}, {country} — {zipCode}
                </p>
            </div>
        </div>
    );
};

AddressCard.propTypes = {
    address1: PropTypes.string,
    address2: PropTypes.string,
    city: PropTypes.string,
    country: PropTypes.string,
    zipCode: PropTypes.number,
    addressType: PropTypes.string,
};

export default AddressCard;