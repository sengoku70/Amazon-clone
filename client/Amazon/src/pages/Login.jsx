import { useDispatch } from "react-redux";
import { loginUser } from "../redux/slices/authSlice";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { Link } from "react-router-dom";



 export default function Login({setuser, setuserData}) {
 const dispatch = useDispatch();
 const [useremail, setemail] = useState('');
 const [userpassword, setpassword] = useState('');

const navigate = useNavigate();
  
const handleLogin = async () => {
  if (!useremail || !userpassword) {
    alert("Please enter email and password");
    return;
  }
  try {
    console.log("Attempting login with:", { useremail, userpassword });

    const res = await axios.post(
      "http://localhost:5000/api/auth/login",
      {
        email: useremail,
        password: userpassword,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true // important if using cookies / JWT in cookies
      }
    );

    console.log("Login success:", res.data);
    // persist token for clients that use Authorization header
    if (res.data?.token) {
      localStorage.setItem('token', res.data.token);
    }
    setuser(res.data.name);
    setuserData(res.data);
    
    //  dispatch(
    //   loginUser({
    //     name: res.data.name,
    //     email: res.data.email,
        
    //   }));
    setemail('');
    setpassword('');
    navigate("/");
    return res.data;
    

  } catch (err) {
    console.error(
      err.response?.data?.message || "Login failed frontend",
    );
  }
  }


  return (
    <div className="flex flex-col justify-center items-center h-[70vh]">
      <form className="bg-white p-6 rounded shadow w-80">
        <h1 className="text-xl font-semibold mb-4">Login</h1>
        <input className="border w-full mb-3 p-2" value={useremail} onChange={(e)=>{setemail(e.target.value)}} placeholder="Email" />
        <input className="border w-full mb-3 p-2" value={userpassword} onChange={(e)=>{setpassword(e.target.value)}} placeholder="Password" />
      </form>
        <button onClick={()=>{handleLogin()}} className="w-80 mt-5 bg-yellow-400 py-2 rounded">
          Login
        </button>

          <div className="text-center mt-5">dont have an account? <Link to="/register" className="text-blue-500 hover:underline">Register</Link></div>
    </div>
  );

}
