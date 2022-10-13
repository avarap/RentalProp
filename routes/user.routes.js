const router = require("express").Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const capitalized = require("../utils/capitalized");

const User = require("../models/User.model");

router.get("/userProfile", async (req, res) => {
  try {
    const data = await User.findById(req.session.user._id);
    res.render("users/user-profile-edit", { userInSession: data });
  } catch (err) {
    res.render("error");
  }
});

router.get("/userProfile/edit", async (req, res) => {
  try {
    const userData = await User.findById(req.session.user._id);
    const capitalizedRole = capitalized(userData.role);
    res.render("users/user-profile-edit", {
      userInSession: userData,
      capitalizedRole,
    });
  } catch (err) {
    res.render("error");
  }
});

// POST route to actually make updates on the user profile
router.post("/userProfile/edit", async (req, res, next) => {
  const { firstName, lastName, address, phone } = req.body;
  const userId = req.session.user._id;
  try {
    await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, address, phone },
      { new: true }
    );
    res.redirect("/dashboard");
  } catch (err) {
    res.render("error");
  }
});

// Dashboard Route
router.get("/dashboard", isLoggedIn, async (req, res, next) => {
  try {
    const userData = await User.findById(req.session.user._id);
    if (userData.role === "owner") {
      res.render("users/owner/owner-dashboard", { userInSession: userData });
      return;
    }
    if (userData.role === "tenant") {
      res.render("users/owner/tenant-dashboard", { userInSession: userData });
      return;
    }
    throw new Error("User data has wrong property");
  } catch (err) {
    console.log(err);
    res.render("error");
  }
});

module.exports = router;
