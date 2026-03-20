import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts, setSearchCategory } from "../redux/slices/productSlice";
import ProductCard from "../components/ProductCard";
import { PRODUCT_CATEGORIES } from "../constants/categories";

export default function SearchResults() {
    const dispatch = useDispatch();
    const { products, loading, searchTerm, searchCategory } = useSelector((s) => s.products);

    const [maxPrice, setMaxPrice] = useState(1000000);
    const [sortBy, setSortBy] = useState("newest");

    useEffect(() => {
        if (products.length === 0) {
            dispatch(fetchProducts());
        }
    }, [dispatch, products.length]);

    if (loading) return <div className="p-6">Loading...</div>;

    // Multi-tier filtering
    let filteredProducts = products.filter((p) => {
        const titleMatch = p.title?.toLowerCase().includes(searchTerm?.toLowerCase() || "");
        const descMatch = p.description?.toLowerCase().includes(searchTerm?.toLowerCase() || "");
        const categoryMatch = searchCategory === "All" || p.category === searchCategory;
        const priceMatch = p.price <= maxPrice;

        return (titleMatch || descMatch) && categoryMatch && priceMatch;
    });

    // Sorting
    if (sortBy === "priceLow") filteredProducts.sort((a, b) => a.price - b.price);
    else if (sortBy === "priceHigh") filteredProducts.sort((a, b) => b.price - a.price);
    else filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <div className="bg-white min-h-screen mt-[80px] flex flex-col md:flex-row">

            {/* Sidebar Filters */}
            <aside className="w-full md:w-64 p-6 border-r shrink-0">
                <h2 className="font-bold text-lg mb-4 border-b pb-2">Filters</h2>

                {/* Category Filter */}
                <div className="mb-6">
                    <h3 className="font-semibold text-sm mb-2">Category</h3>
                    <div className="space-y-1">
                        <label className="flex items-center gap-2 cursor-pointer hover:text-orange-700 text-sm">
                            <input
                                type="radio"
                                checked={searchCategory === "All"}
                                onChange={() => dispatch(setSearchCategory("All"))}
                                className="accent-orange-500"
                            />
                            All
                        </label>
                        {PRODUCT_CATEGORIES.map(cat => (
                            <label key={cat} className="flex items-center gap-2 cursor-pointer hover:text-orange-700 text-sm">
                                <input
                                    type="radio"
                                    checked={searchCategory === cat}
                                    onChange={() => dispatch(setSearchCategory(cat))}
                                    className="accent-orange-500"
                                />
                                {cat}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Price Filter */}
                <div className="mb-6">
                    <h3 className="font-semibold text-sm mb-2">Price Limit: <span className="text-orange-700 underline">₹{maxPrice}</span></h3>
                    <input
                        type="range"
                        min="0"
                        max="200000"
                        step="500"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className="w-full accent-orange-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-gray-500 mt-1 uppercase tracking-tight">
                        <span>₹0</span>
                        <span>₹2L+</span>
                    </div>
                </div>

                {/* Sort By */}
                <div className="mb-6">
                    <h3 className="font-semibold text-sm mb-2">Sort By</h3>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full border p-2 rounded text-sm outline-none focus:ring-1 focus:ring-orange-500"
                    >
                        <option value="newest">Featured</option>
                        <option value="priceLow">Price: Low to High</option>
                        <option value="priceHigh">Price: High to Low</option>
                    </select>
                </div>
            </aside>

            {/* Main Results Section */}
            <main className="grow p-4 md:p-6 bg-gray-50">
                <div className="mb-6 border-b pb-4 bg-white p-4 rounded shadow-sm flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        {filteredProducts.length} results for <span className="text-orange-700 font-bold italic">"{searchTerm || "All Products"}"</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((p) => (
                            <ProductCard key={p._id} product={p} />
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center flex flex-col items-center justify-center">
                            <h2 className="text-2xl font-bold text-gray-800">
                                no result for <span className="text-orange-700 italic">"{searchTerm}"</span>
                            </h2>
                            <p className="text-gray-500 mt-4 max-w-md">
                                Try adjusting your filters or checking for spelling errors.
                            </p>
                            <img
                                src="https://m.media-amazon.com/images/G/01/gno/images/general/not-found-image._CB485926524_.png"
                                className="w-40 mt-8 opacity-50 grayscale hover:grayscale-0 transition-all shadow-inner rounded-full"
                                alt="Not found"
                            />
                        </div>
                    )}
                </div>
            </main>

        </div>
    );
}
