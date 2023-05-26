const handlePolicies = (policies = []) => (req, res, next) => {
  if(policies.length === 0){
    return next();
  }
  if (policies.length > 0 && policies.includes("public")) {
    return next();
  }
  if(!req.user) {
    return res.redirect("/login");
  }
  if (policies.includes(req.user.role)) {
    return next();
  } else {
    return res
      .status(403)
      .send({ message: "Acceso denegado. Rol del usuario no autorizado." });
  }
};

module.exports = handlePolicies;
