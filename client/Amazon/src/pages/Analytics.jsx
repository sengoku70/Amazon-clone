import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";

const ANALYTICS_KEY = "analytics";

function loadAnalytics() {
  try {
    return JSON.parse(localStorage.getItem(ANALYTICS_KEY)) || { views: {}, favourites: {}, orders: {} };
  } catch (e) {
    return { views: {}, favourites: {}, orders: {} };
  }
}

function BarChart({ data, label, color = "#60a5fa" }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">{label}</h3>
      <div className="space-y-1">
        {data.map((d) => (
          <div key={d.id} className="flex items-center gap-3">
            <div className="w-40 text-sm text-gray-700">{d.name}</div>
            <div className="flex-1 bg-gray-200 h-6 rounded overflow-hidden">
              <div
                style={{ width: `${(d.value / max) * 100}%`, background: color }}
                className="h-6"
                title={`${d.value}`}
              />
            </div>
            <div className="w-12 text-right text-sm">{d.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Analytics() {
  const dispatch = useDispatch();
  const { products } = useSelector((s) => s.products);
  const [analytics, setAnalytics] = useState(loadAnalytics());

  useEffect(() => {
    if (!products || products.length === 0) dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    const handler = () => setAnalytics(loadAnalytics());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const merged = (key) => {
    const map = analytics[key] || {};
    return (products || []).map((p) => ({ id: p._id, name: p.title, value: map[p._id] || 0 }));
  };

  const viewsData = merged("views");
  const favsData = merged("favourites").map((d) => ({ ...d, value: d.value ? 1 : 0 }));
  const ordersData = merged("orders");

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setAnalytics(loadAnalytics())}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-white rounded shadow">
          <BarChart data={viewsData} label="Product Views" color="#60a5fa" />
        </div>
        <div className="p-4 bg-white rounded shadow">
          <BarChart data={favsData} label="Favourites (count)" color="#fb7185" />
        </div>
        <div className="p-4 bg-white rounded shadow">
          <BarChart data={ordersData} label="Orders" color="#34d399" />
        </div>
      </div>
    </div>
  );
}
