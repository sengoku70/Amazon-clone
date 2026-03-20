import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../redux/slices/cartSlice";

const ANALYTICS_KEY = "analytics";

function loadAnalytics() {
  try {
    return JSON.parse(localStorage.getItem(ANALYTICS_KEY)) || { views: {}, favourites: {}, orders: {} };
  } catch (e) {
    return { views: {}, favourites: {}, orders: {} };
  }
}

function saveAnalytics(obj) {
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(obj));
}

export default function Checkout() {
  const { items } = useSelector((s) => s.cart);
  const dispatch = useDispatch();

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
      <p className="text-gray-600">Items: {items.length}</p>
      <button
        onClick={() => {
          const analytics = loadAnalytics();
          analytics.orders = analytics.orders || {};
          items.forEach((it) => {
            const id = it._id || it.id;
            const qty = it.qty || 1;
            analytics.orders[id] = (analytics.orders[id] || 0) + qty;
          });
          saveAnalytics(analytics);
          dispatch(clearCart());
          alert("Order placed — analytics updated (local)");
        }}
        className="mt-6 bg-green-600 text-white px-6 py-2 rounded"
      >
        Place Order
      </button>
    </div>
  );
}
