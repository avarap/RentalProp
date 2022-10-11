const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  console.log(req.oidc.isAuthenticated());
  res.render("index", { title: "Express Demo" });
});

module.exports = router;
