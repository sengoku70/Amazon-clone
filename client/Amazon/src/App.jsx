import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import "./App.css";

// Layout
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useDispatch } from "react-redux";

// Pages
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Orders from "./pages/Orders";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";
import CreateProduct from "./pages/CreateProduct";
import SearchResults from "./pages/SearchResults";


function App() {
  const [user, setuser] = useState(null);
  const [userdata, setuserData] = useState(null);

  const dispatch = useDispatch();


  useEffect(() => {

    const checkAuth = async () => {
      try {
        // Call /api/auth/me and rely on the httpOnly cookie set by the server
        //console.log("Checking auth status...",localStorage.getItem("token") );
        const res = await fetch("http://localhost:5000/api/auth/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include"
        });

        if (res.ok) {
          const data = await res.json();
          // /api/auth/me returns { user: { id, name, email } }
          setuser(data.user?.name || null);
          setuserData(data.user || null);
          console.log("Authenticated user:", data);
        } else {
          setuser(null);
        }
      } catch (err) {
        setuser(null);
      }
    };

    checkAuth();
  }, [dispatch]);

  return (

    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-gray-100">
        {/* HEADER */}
        <Header user={user} userdata={userdata} />

        {/* MAIN CONTENT */}
        <main className="grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/search" element={<SearchResults />} />

            {/* Auth */}

            <Route
              path="/login"
              element={!user ? <Login setuser={setuser} setuserData={setuserData} /> : <Navigate to="/" />}
            />
            <Route
              path="/Register"
              element={!user ? <Register setuser={setuser} setuserData={setuserData} /> : <Navigate to="/" />}
            />


            {/* Protected Routes */}
            <Route
              path="/checkout"
              element={user ? <Checkout /> : <Navigate user to="/login" />}
            />
            <Route
              path="/orders"
              element={user ? <Orders /> : <Navigate to="/login" />}
            />
            <Route
              path="/analytics"
              element={user ? <Analytics /> : <Navigate to="/login" />}
            />
            <Route
              path="/createproduct"
              element={user ? <CreateProduct /> : <Navigate to="/login" />}
            />
            <Route
              path="/settings"
              element={user ? <Settings userdata={userdata} /> : <Navigate to="/login" />}
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* FOOTER */}
        <Footer />
      </div>
    </BrowserRouter>

  );
}

export default App;
