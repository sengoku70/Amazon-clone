import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaHome, FaUser, FaBox, FaChartBar, FaPlus, FaShoppingCart } from "react-icons/fa";
import { IoSearch, IoLocationOutline } from "react-icons/io5";
import { setSearchTerm, setSearchCategory } from "../redux/slices/productSlice";
import { useNavigate } from "react-router-dom";
import { PRODUCT_CATEGORIES } from "../constants/categories";

export default function Header({ user, userdata }) {
  const { items } = useSelector((s) => s.cart);
  const { searchTerm, searchCategory, products } = useSelector((s) => s.products);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showResults, setShowResults] = useState(false);

  // Autocomplete filtering (case-insensitive)
  const autocompleteResults = searchTerm ? products.filter(p =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 8) : [];

  const handleSearch = (e) => {
    dispatch(setSearchTerm(e.target.value));
    if (window.location.pathname !== "/search") {
      navigate("/search");
    }
  };

  const handleCategoryChange = (e) => {
    dispatch(setSearchCategory(e.target.value));
    if (window.location.pathname !== "/search") {
      navigate("/search");
    }
  };

  const activeAddress = userdata?.addresses?.[0];

  return (
    <header className="bg-[#131921] z-20 fixed w-screen text-white">
      <div className="flex items-center gap-4 px-4 py-2">

        {/* Amazon Logo Section */}
        <Link to="/" className="flex items-center p-2 border border-transparent hover:border-white rounded transition-all">
          <div className="flex flex-col items-start">
            <span className="text-xl font-bold tracking-tight">amazon<span className="text-yellow-400">.in</span></span>
            <div className="h-1 w-full bg-orange-400 rounded-full -mt-1 shadow-[0_2px_4px_rgba(0,0,0,0.3)]"></div>
          </div>
        </Link>

        {/* Location Section */}
        <div className="hidden md:flex items-center p-2 border border-transparent hover:border-white rounded cursor-pointer transition-all gap-1">
          <IoLocationOutline className="text-xl self-end mb-1" />
          <div className="flex flex-col text-xs">
            <span className="text-gray-300">Deliver to {user || "Guest"}</span>
            <span className="font-bold whitespace-nowrap">
              {activeAddress
                ? `${activeAddress.city} ${activeAddress.zipCode || ""} `
                : "Select location"}
            </span>
          </div>
        </div>

        {/* Search Bar Section */}
        <div className="relative flex flex-1 items-center bg-white rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-orange-400">
          <select
            className="h-10 px-3 bg-gray-100 text-black border-r outline-none text-xs cursor-pointer hover:bg-gray-200"
            value={searchCategory}
            onChange={handleCategoryChange}
          >
            <option value="All">All Categories</option>
            {PRODUCT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            className="flex-1 px-4 py-2 outline-0 text-black text-sm"
            placeholder="Search Amazon.in"
            value={searchTerm}
            onChange={handleSearch}
            onFocus={() => setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
          />
          <button
            onClick={() => navigate("/search")}
            className="bg-yellow-400 px-4 h-10 text-black hover:bg-yellow-500 transition-colors"
          >
            <IoSearch className="h-6 w-6" />
          </button>

          {/* Autocomplete Results */}
          {showResults && searchTerm && (
            <div className="absolute top-10 left-0 right-0 bg-white text-black shadow-lg rounded-b-md z-50 border border-gray-200 max-h-[400px] overflow-auto">
              {autocompleteResults.length > 0 ? (
                <>
                  {autocompleteResults.map(p => (
                    <div
                      key={p._id}
                      onClick={() => {
                        navigate(`/product/${p._id}`);
                        setShowResults(false);
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer border-b last:border-0"
                    >
                      <img src={p.image} className="w-10 h-10 object-contain" alt="" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium line-clamp-1">{p.title}</span>
                        <span className="text-xs text-gray-500">{p.category}</span>
                      </div>
                    </div>
                  ))}
                  <div
                    onClick={() => navigate("/search")}
                    className="p-2 text-center text-blue-600 font-medium hover:underline text-sm bg-gray-50 border-t cursor-pointer"
                  >
                    See all results
                  </div>
                </>
              ) : (
                <div className="p-4 text-center text-gray-500 italic text-sm">
                  no result for "{searchTerm}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Nav Options */}
        <div className="flex items-center gap-1 md:gap-4 px-2">

          {/* Account & Lists */}
          <Link to={user ? "/settings" : "/login"} className="p-2 border border-transparent hover:border-white rounded flex flex-col items-start leading-tight">
            <span className="text-xs text-gray-300">Hello, {user || "sign in"}</span>
            <span className="text-sm font-bold flex items-center">Account & Lists</span>
          </Link>

          {/* Orders */}
          <Link to="/orders" className="p-2 border border-transparent hover:border-white rounded flex flex-col items-start leading-tight">
            <span className="text-xs text-gray-300">Returns</span>
            <span className="text-sm font-bold">& Orders</span>
          </Link>

          {/* Seller / Analytics */}
          {userdata?.seller && (
            <div className="flex gap-1">
              <Link title="Analytics" to="/analytics" className="p-2 border border-transparent hover:border-white rounded text-lg">
                <FaChartBar />
              </Link>
              <Link title="Create Product" to="/createproduct" className="p-2 border border-transparent hover:border-white rounded text-lg">
                <FaPlus />
              </Link>
            </div>
          )}

          {/* Cart */}
          <Link to="/cart" className="relative p-2 border border-transparent hover:border-white rounded flex items-center gap-1">
            <div className="relative">
              <FaShoppingCart className="text-2xl" />
              <span className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-[#131921] text-orange-400 font-bold text-sm px-1 rounded-full">
                {items.length}
              </span>
            </div>
            <span className="hidden sm:block text-sm font-bold self-end mt-2">Cart</span>
          </Link>

        </div>
      </div>
    </header>
  );
}