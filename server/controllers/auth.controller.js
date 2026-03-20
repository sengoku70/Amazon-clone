import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  console.log("Registering user");
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json("User already exists");

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    seller: user.seller || false,
    sellerProfile: user.sellerProfile || null,
    addresses: user.addresses || [],
    token,
  });
};

export const login = async (req, res) => {

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  console.log("Logging in user:", email, password);

  if (!user) return res.status(400).json("Invalid credentials");

  const match = await bcrypt.compare(password, user.password);

  if (!match) return res.status(400).json("Invalid credentials");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // true in production (HTTPS)
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    seller: user.seller || false,
    sellerProfile: user.sellerProfile || null,
    addresses: user.addresses || [],
    token,
  });
};

export const becomeSeller = async (req, res) => {
  try {
    const { companyName, category, description, phone } = req.body;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Not authenticated' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.seller = true;
    user.sellerProfile = { companyName, category, description, phone };

    await user.save();

    const { password, ...rest } = user.toObject();
    res.json({ user: rest });
  } catch (err) {
    console.error('becomeSeller error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
    });
    return res.json({ message: 'Logged out' });
  } catch (err) {
    console.error('logout error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
