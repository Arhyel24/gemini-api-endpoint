const authMiddleware = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    // res.status(401).send("Please login to access the route");
    res.redirect("/login");
  }
};

export default authMiddleware;
