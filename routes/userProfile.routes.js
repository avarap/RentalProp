const router = require("express").Router();

const User = require("../models/User.model");

router.get("/userProfile", async (req, res) => {
  try {
    const data = await User.findById(req.session.user._id);
    res.render("users/user-profile", { userInSession: data });
  } catch (err) {
    res.render("error");
  }
});

router.get("/userProfile/edit", async (req, res) => {
  try {
    const userData = await User.findById(req.session.user._id);
    res.render("users/user-profile-edit", { userInSession: userData });
  } catch (err) {
    res.render("error");
  }
});

// POST route to actually make updates on the user profile
router.post("/userProfile/edit", async (req, res, next) => {
  const { firstName, lastName, address, phone } = req.body;
  const userId = req.session.user._id;

  await User.findByIdAndUpdate(
    userId,
    { firstName, lastName, address, phone },
    { new: true }
  );
  res.redirect("/userProfile");
});

module.exports = router;
