import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../redux/slices/productSlice";
import { addToCart } from "../redux/slices/cartSlice";
import ProductCard from "../components/ProductCard";

const ANALYTICS_KEY = "analytics";

function loadAnalytics() {
  try {
    return JSON.parse(localStorage.getItem(ANALYTICS_KEY)) || {
      views: {},
      favourites: {},
      orders: {},
    };
  } catch (e) {
    return { views: {}, favourites: {}, orders: {} };
  }
}

function saveAnalytics(obj) {
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(obj));
}

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, products, loading } = useSelector((s) => s.products);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (!product) return;

    const analytics = loadAnalytics();

    // increment views
    analytics.views[product._id] =
      (analytics.views[product._id] || 0) + 1;

    saveAnalytics(analytics);

    setIsFav(Boolean(analytics.favourites?.[product._id]));
  }, [product]);

  if (loading || !product)
    return <div className="p-6">Loading...</div>;

  // 🔥 similar products
  const similarProducts =
    products?.filter(
      (p) =>
        p.category === product.category &&
        p._id !== product._id
    ) || [];

  return (
    <div className="bg-gray-100 min-h-screen mt-[100px]">

      {/* MAIN PRODUCT SECTION */}
      <div className="mx-auto max-w-6xl p-6 grid grid-cols-1 md:grid-cols-2 gap-10 bg-white shadow rounded">

        <div className="flex justify-center items-center">
          <img
            src={product.image}
            alt={product.title}
            className="max-h-[400px] object-contain"
          />
        </div>

        <div>
          <h1 className="text-3xl font-semibold">
            {product.title}
          </h1>

          <p className="text-sm text-gray-500 mt-1 capitalize">
            Category: {product.category}
          </p>

          <p className="mt-4 text-gray-700">
            {product.description}
          </p>

          <p className="mt-6 text-3xl font-bold text-green-600">
            ₹{product.price}
          </p>

          <p className="mt-2 text-sm text-green-500">
            In Stock
          </p>

          <div className="flex gap-4 mt-6">

            <button
              onClick={() => dispatch(addToCart(product))}
              className="bg-yellow-400 px-6 py-3 rounded hover:bg-yellow-500 font-semibold"
            >
              Add to Cart
            </button>

            <button
              onClick={() => {
                const analytics = loadAnalytics();
                const next =
                  !Boolean(analytics.favourites?.[product._id]);

                analytics.favourites = analytics.favourites || {};
                analytics.favourites[product._id] = next;

                saveAnalytics(analytics);
                setIsFav(next);
              }}
              className={`px-5 py-3 rounded font-medium ${isFav
                  ? "bg-red-500 text-white"
                  : "bg-gray-200"
                }`}
            >
              {isFav ? "Unfavourite" : "Favourite"}
            </button>

          </div>
        </div>
      </div>

      {/* SIMILAR PRODUCTS SECTION */}
      {similarProducts.length > 0 && (
        <div className="max-w-7xl mx-auto p-6 mt-10">

          <h2 className="text-2xl font-semibold mb-6">
            More from {product.category} {product.seller?.name && `by ${product.seller.name}`}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {similarProducts.slice(0, 8).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}