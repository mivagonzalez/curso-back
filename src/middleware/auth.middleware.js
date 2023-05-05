const authMdw = (req, res, next) => {
  if (req.user) {
    console.log('estoy aca')
    return next();
  }

  return res.redirect("/login");
};

module.exports = authMdw;
