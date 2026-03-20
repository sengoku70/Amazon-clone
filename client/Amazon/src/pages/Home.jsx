import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((s) => s.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return <div className="p-6">Loading...</div>;

  const filteredProducts = products;

  // 🔥 Group by category
  const groupedProducts = filteredProducts.reduce((acc, product) => {
    const category = product.category || "Others";

    if (!acc[category]) {
      acc[category] = [];
    }

    acc[category].push(product);
    return acc;
  }, {});

  return (
    <div className="bg-gradient-to-b  from-orange-500  via-orange-100 via-white to-white  min-h-screen">

      {/* HERO BANNER */}
      <div className="relative w-full h-[450px] flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Starting ₹199</h1>
          <p className="text-xl mt-2">Deals on fashion & beauty</p>
        </div>
      </div>

      {/* CATEGORY BOXES */}
      <div className="max-w-7xl mx-auto px-6 -mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {Object.keys(groupedProducts).map((category) => (
          <div key={category} className="bg-white p-4 z-10 shadow-md rounded">

            <h2 className="text-lg font-semibold mb-3 capitalize">
              {category}
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {groupedProducts[category].slice(0, 4).map((product) => (
                <img
                  key={product._id}
                  src={product.image}
                  alt={product.name}
                  className="h-28 w-full object-cover rounded"
                />
              ))}
            </div>

            <button className="text-blue-600 text-sm mt-3 hover:underline">
              See more
            </button>
          </div>
        ))}

      </div>

      {/* ALL PRODUCTS SECTION */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
        {filteredProducts.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>

    </div>
  );
}