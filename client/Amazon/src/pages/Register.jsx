import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";


export default function Register({setuser, setuserData}) {
const [username, setName] = useState("");
const [useremail, setEmail] = useState("");
const [userpassword, setPassword] = useState("");
const navigate = useNavigate();

const signup = async () => {
  try {
    console.log("signup called with:", { username, useremail, userpassword });
    const res = await axios.post(
      "http://localhost:5000/api/auth/register",
      {
        name: username,
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

    setuser(res.data.name);
    setuserData(res.data);
    
    console.log("user Registerd:", res.data);
    navigate("/");
    return res.data;

  } catch (err) {
    console.error(
      err.response?.data?.message || "signup failed"
    );
  }
  }


  return (
    <div className="flex flex-col justify-center items-center  h-[70vh]">
      <form className="bg-white p-6 rounded shadow w-80">
        <h1 className="text-xl font-semibold mb-4">Create Account</h1>
         <input
          className="border w-full mb-3 p-2"
          placeholder="Name"
          value={username}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border w-full mb-3 p-2"
          placeholder="Email"
          value={useremail}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border w-full mb-3 p-2"
          placeholder="Password"
          value={userpassword}
          onChange={(e) => setPassword(e.target.value)}
        />
      </form>
        <button onClick={()=>{signup()}} className="w-80 mt-5 bg-yellow-400 py-2 rounded">
          Register
        </button>

        
        <div className="text-center mt-5">Already have a account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link></div>
    </div>
  );
}
