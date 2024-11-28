



const authMiddleware = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    req.flash("error", "You must be logged in to access this page.");
    return res.redirect("/auth/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add the user to the request object
    next();
  } catch (err) {
    req.flash("error", "Session expired. Please log in again.");
    return res.redirect("/auth/login");
  }
};

export default authMiddleware;

