const router = require("express").Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const capitalized = require("../utils/capitalized");

const User = require("../models/User.model");

router.get("/userProfile", async (req, res) => {
  try {
    const userData = await User.findById(req.session.user._id);
    const capitalizedRole = capitalized(userData.role);
    res.render("users/user-profile", {
      userInSession: userData,
      capitalizedRole,
    });
  } catch (err) {
    res.render("error");
  }
});

// router.get("/userProfile/edit", async (req, res) => {
//   try {
//     const userData = await User.findById(req.session.user._id);
//   } catch (err) {
//     res.render("error");
//   }
// });

// POST route to actually make updates on the user profile
router.post("/userProfile/edit", async (req, res) => {
  const { firstName, lastName, street, zipCode, city, phone } = req.body;
  const address = { street, zipCode, city };
  console.log(req.body);

  const userId = req.session.user._id;
  // console.log(address);
  try {
    await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        address,
        phone,
      },
      { new: true }
    );
    console.log(userId);
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.render("error");
  }
});

// Dashboard Route
router.get("/dashboard", isLoggedIn, async (req, res, next) => {
  try {
    const userData = await User.findById(req.session.user._id);
    const capitalizedRole = capitalized(userData.role);
    if (userData.role === "owner") {
      res.render("users/dashboard/owner-dashboard", {
        userInSession: userData,
        capitalizedRole,
      });
      return;
    }
    if (userData.role === "tenant") {
      res.render("users/dashboard/tenant-dashboard", {
        userInSession: userData,
        capitalizedRole,
      });
      return;
    }
    throw new Error("User data has wrong role");
  } catch (err) {
    console.log(err);
    res.render("error");
  }
});

module.exports = router;
