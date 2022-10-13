const isLoggedIn = require("../middleware/isLoggedIn");
const isLoggedOut = require("../middleware/isLoggedOut");

const router = require("express").Router();

/* GET home page */
router.get("/", isLoggedIn, (req, res, next) => {
  res.redirect("/dashboard");
});

module.exports = router;
