const isLoggedIn = require("../middleware/isLoggedIn");
const isLoggedOut = require("../middleware/isLoggedOut");

const router = require("express").Router();

/* GET home page */
router.get("/", isLoggedIn, (req, res, next) => {
  if (!req.user) {
    res.render("index");
  } else {
    res.redirect("/property");
  }
});

module.exports = router;
