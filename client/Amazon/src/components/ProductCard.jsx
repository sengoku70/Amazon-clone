import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/product/${product._id}`}
      className="bg-white p-4 rounded shadow hover:shadow-lg transition"
    >
      <img
        src={product.image}
        className="h-40 w-full object-contain mb-4"
      />
      <h3 className="text-sm font-medium line-clamp-2">
        {product.title}
      </h3>
      {product.seller?.name && (
        <p className="text-xs text-gray-500 mt-1 capitalize">
          Seller: {product.seller.name}
        </p>
      )}
      <p className="mt-2 font-bold text-lg text-orange-600">₹{product.price}</p>
    </Link>
  );
}
