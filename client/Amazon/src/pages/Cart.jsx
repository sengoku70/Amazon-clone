import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "../redux/slices/cartSlice";
import { Link } from "react-router-dom";

export default function Cart() {
  const dispatch = useDispatch();
  const { items } = useSelector((s) => s.cart);

  const total = items.reduce((a, c) => a + c.price * c.qty, 0);

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>

      {items.map((item) => (
        <div key={item._id} className="flex justify-between border-b py-4">
          <div>
            <p className="font-medium">{item.title}</p>
            <p>₹{item.price}</p>
          </div>
          <button
            onClick={() => dispatch(removeFromCart(item._id))}
            className="text-red-500"
          >
            Remove
          </button>
        </div>
      ))}

      <div className="mt-6 flex justify-between">
        <h2 className="text-xl font-bold">Total: ₹{total}</h2>
        <Link
          to="/checkout"
          className="bg-yellow-400 px-6 py-2 rounded hover:bg-yellow-500"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
