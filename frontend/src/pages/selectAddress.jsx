import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Nav from '../components/auth/nav';
import API_BASE from '../api';

const SelectAddress = () => {
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const email = useSelector((state) => state.user.email);

    useEffect(() => {
        if (!email) return;
        const fetchAddresses = async () => {
            try {
                const response = await fetch(`${API_BASE}/api/v2/user/addresses?email=${email}`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setAddresses(data.addresses);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchAddresses();
    }, [email]);

    const handleSelectAddress = (addressId) => {
        setSelectedAddress(addressId);
    };

    const handleContinue = () => {
        if (!selectedAddress) {
            alert('Please select an address');
            return;
        }
        navigate('/order-confirmation', {
            state: { addressId: selectedAddress, email }
        });
    };

    if (loading) {
        return (
            <>
                <Nav />
                <div className="w-full min-h-screen flex justify-center items-center">
                    <p className="text-lg">Loading addresses...</p>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Nav />
                <div className="w-full min-h-screen flex flex-col justify-center items-center">
                    <p className="text-red-500 text-lg mb-4">Error: {error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                        Retry
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <Nav />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">Select Shipping Address</h2>
                    {addresses.length > 0 ? (
                        <div className="space-y-4">
                            {addresses.map((address) => (
                                <div
                                    key={address._id}
                                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedAddress === address._id
                                            ? 'border-blue-500 bg-blue-50 shadow-lg'
                                            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                                        }`}
                                    onClick={() => handleSelectAddress(address._id)}
                                >
                                    <div className="flex items-start gap-3">
                                        <input
                                            type="radio"
                                            name="address"
                                            checked={selectedAddress === address._id}
                                            onChange={() => handleSelectAddress(address._id)}
                                            className="mt-1"
                                        />
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {address.address1}
                                                {address.address2 ? `, ${address.address2}` : ''}
                                            </p>
                                            <p className="text-gray-600">
                                                {address.city}, {address.country} - {address.zipCode}
                                            </p>
                                            <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-full">
                                                {address.addressType}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-between mt-6">
                                <button
                                    onClick={() => navigate('/create-address')}
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                                >
                                    + Add New Address
                                </button>
                                <button
                                    onClick={handleContinue}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-500 text-lg mb-4">No addresses found. Add one to continue.</p>
                            <button
                                onClick={() => navigate('/create-address')}
                                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                + Add Address
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default SelectAddress;
