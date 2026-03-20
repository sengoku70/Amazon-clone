import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { PRODUCT_CATEGORIES } from "../constants/categories";


const Settings = ({ userdata }) => {

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [countryQuery, setCountryQuery] = useState('');
  const [countrySuggestions, setCountrySuggestions] = useState([]);
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false);
  const countryFetchRef = useRef(null);
  const [showSellerForm, setShowSellerForm] = useState(false);
  const [sellerData, setSellerData] = useState({ companyName: '', category: '', description: '', phone: '' });
  const [sellerSubmitting, setSellerSubmitting] = useState(false);
  const [sellerSuccess, setSellerSuccess] = useState(null);
  useEffect(() => {
    if (!countryQuery || countryQuery.trim().length === 0) {
      setCountrySuggestions([]);
      return;
    }

    if (countryFetchRef.current) clearTimeout(countryFetchRef.current);

    countryFetchRef.current = setTimeout(async () => {
      try {
        const resp = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryQuery)}?fields=name`);
        if (!resp.ok) {
          setCountrySuggestions([]);
          return;
        }
        const data = await resp.json();
        const names = data
          .map((c) => c?.name?.common)
          .filter(Boolean)
          .slice(0, 10);
        setCountrySuggestions(names);
      } catch (err) {
        setCountrySuggestions([]);
      }
    }, 300);

    return () => {
      if (countryFetchRef.current) clearTimeout(countryFetchRef.current);
    };
  }, [countryQuery]);


  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setAddresses(data.user?.addresses || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const dispatch = useDispatch();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      (async () => {
        try {
          await fetch('http://localhost:5000/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
          });
        } catch (err) {
          // ignore network errors, still proceed to clear client state
        }
        try {
          localStorage.removeItem('token');
        } catch (err) {
          // ignore localStorage errors
        }
        dispatch(logout());
        window.location.href = '/';
      })();
    }
  };

  const handleBecomeSeller = async (e) => {
    e.preventDefault();
    setSellerSubmitting(true);
    setSellerSuccess(null);
    try {
      const response = await fetch('http://localhost:5000/api/auth/become-seller', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(sellerData),
      });

      if (!response.ok) {
        const txt = await response.text();
        throw new Error(txt || 'Failed to become seller');
      }

      setSellerSuccess('You are now a seller');
      setShowSellerForm(false);
      // refresh page or user data
      window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setSellerSubmitting(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/user/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(newAddress)
      });

      if (!response.ok) {
        throw new Error('Failed to add address');
      }

      const data = await response.json();
      setAddresses([...addresses, data.address]);
      setNewAddress({ street: '', city: '', state: '', zipCode: '', country: '' });
      setShowAddAddress(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/user/addresses/${addressId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete address');
      }

      setAddresses(addresses.filter(addr => (addr._id || addr.id) !== addressId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const response = await fetch('http://localhost:5000/api/user/account', {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete account');
        }

        dispatch(logout());
        window.location.href = '/';
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleDeleteData = async () => {
    if (window.confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      try {
        const response = await fetch('http://localhost:5000/api/user/data', {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete data');
        }

        setAddresses([]);
        setError('All data has been deleted successfully');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p>Loading...</p></div>;
  }

  if (error && !userdata) {
    return <div className="flex justify-center items-center h-screen"><p className="text-red-500">{error}</p></div>;
  }

  if (!userdata) {
    return <div className="flex justify-center items-center h-screen"><p>Please login to view settings</p></div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Account Settings</h1>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Sell on Marketplace</h2>
        {userdata?.seller ? (
          <div className="p-4 border rounded">
            <p className="font-medium">You are a seller</p>
            <p className="text-sm">{userdata?.sellerProfile?.companyName}</p>
            <p className="text-sm">{userdata?.sellerProfile?.category}</p>
          </div>
        ) : (
          <div>
            {!showSellerForm ? (
              <button
                className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                onClick={() => setShowSellerForm(true)}
              >
                Become a Seller
              </button>
            ) : (
              <form className="space-y-3 mt-4" onSubmit={handleBecomeSeller}>
                {sellerSuccess && <p className="text-green-600">{sellerSuccess}</p>}
                <input
                  type="text"
                  placeholder="Company / Seller Name"
                  value={sellerData.companyName}
                  onChange={(e) => setSellerData({ ...sellerData, companyName: e.target.value })}
                  required
                  className="w-full p-2 border rounded"
                />
                <select
                  value={sellerData.category}
                  onChange={(e) => setSellerData({ ...sellerData, category: e.target.value })}
                  required
                  className="w-full p-2 border rounded bg-white shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                >
                  <option value="" disabled>Select Category</option>
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Phone"
                  value={sellerData.phone}
                  onChange={(e) => setSellerData({ ...sellerData, phone: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <textarea
                  placeholder="Short description"
                  value={sellerData.description}
                  onChange={(e) => setSellerData({ ...sellerData, description: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <div className="flex space-x-3">
                  <button type="submit" disabled={sellerSubmitting} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">{sellerSubmitting ? 'Submitting...' : 'Submit'}</button>
                  <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" onClick={() => setShowSellerForm(false)}>Cancel</button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      {/* {error && <div className="text-red-500 mb-4">{error}</div>} */}

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <label className="w-32 font-medium">Name:</label>
            <p>{userdata.name || 'Not provided'}</p>
          </div>
          <div className="flex items-center">
            <label className="w-32 font-medium">Email:</label>
            <p>{userdata.email || 'Not provided'}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Addresses</h2>
        {addresses.length === 0 ? (
          <p className="text-gray-500">No addresses saved</p>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div key={address._id || address.id} className="p-4 border rounded shadow-sm">
                <div className="mb-2">
                  <p>{address.street}</p>
                  <p>{address.city}, {address.state} {address.zipCode}</p>
                  <p>{address.country}</p>
                </div>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => handleDeleteAddress(address._id || address.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        {!showAddAddress ? (
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => setShowAddAddress(true)}
          >
            + Add Address
          </button>
        ) : (
          <form className="space-y-4 mt-4" onSubmit={handleAddAddress}>
            <input
              type="text"
              placeholder="Street Address"
              value={newAddress.street}
              onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="City"
              value={newAddress.city}
              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="State"
              value={newAddress.state}
              onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Zip Code"
              value={newAddress.zipCode}
              onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
              required
              className="w-full p-2 border rounded"
            />
            <div className="relative">
              <input
                type="text"
                placeholder="Country"
                value={newAddress.country}
                onChange={(e) => {
                  const val = e.target.value;
                  setNewAddress({ ...newAddress, country: val });
                  setCountryQuery(val);
                  setShowCountrySuggestions(!!val);
                }}
                onFocus={() => setShowCountrySuggestions(!!countryQuery)}
                required
                className="w-full p-2 border rounded"
                autoComplete="off"
              />
              {showCountrySuggestions && countrySuggestions.length > 0 && (
                <ul className="absolute z-50 left-0 right-0 bg-white border rounded mt-1 max-h-48 overflow-auto">
                  {countrySuggestions.map((c) => (
                    <li
                      key={c}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onMouseDown={() => {
                        setNewAddress({ ...newAddress, country: c });
                        setCountryQuery('');
                        setCountrySuggestions([]);
                        setShowCountrySuggestions(false);
                      }}
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex space-x-4">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Save Address</button>
              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={() => setShowAddAddress(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Account</h2>
        <div className="space-y-4 mb-4">
          <button
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
        <h2 className="text-2xl font-semibold mb-4 text-red-600">Danger Zone</h2>
        <div className="space-y-4">
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            onClick={handleDeleteData}
          >
            Delete All Data
          </button>
          <button
            className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
