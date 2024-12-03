import jwt, { decode } from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config();

const authMiddleware = (req, res, next) => {
  
  const token = req.cookies.token;
  if (!token) {
    req.flash("error", "You must be logged in to access this page.");
    req.user = null;
    console.log("token not found ")

    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // Add the user to the request object
    req.user = decoded.user;
    console.log(decoded.user);
    next();
  } catch (err) {
    req.flash("error", "Session expired. Please log in again.");
    res.clearCookie("token"); // Clear invalid/expired token
    console.log("Session expired");
     return res.redirect("/auth/login");
    

    
  
  }
};

export default authMiddleware;
