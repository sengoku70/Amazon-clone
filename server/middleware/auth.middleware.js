import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    // ✅ Get token from cookie
    const token = req.cookies.token;
    
    if (!token) {
      console.log("No token provided");

      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );

    req.user = decoded; // trusted user data
    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({

      
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;