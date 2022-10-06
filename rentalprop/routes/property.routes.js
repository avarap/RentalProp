const router = require("express").Router();

const User = require("../models/User.model");
const Property = require("../models/Property.model");
//const Incident = require("../models/Incident.model");

// Require necessary (isLoggedOut and isLoggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

let templatePath = "./property";
let redirectPath = "/property";
let errorRender = "error";

router.get("/", isLoggedIn, async (req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  const data = await Property.find();
  res.render(templatePath + "/properties", { properties: data, user2: req.session.user });
  //   try {
  //     const data = await Property.find();
  //     res.render(templatePath + "/properties", { properties: data });
  //   } catch (err) {
  //     res.render(errorRender);
  //   }
});

router.post("/create", isLoggedIn, async (req, res, next) => {
  try {
    const data = new Property({ ...req.body });
    await data.save();
    res.redirect(redirectPath);
  } catch (err) {
    res.render(errorRender);
  }
});

router.get("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const data = await Property.findById(req.params.id);
    await data.populate("Owner");
    res.render(templatePath + "/property-details", { property: data });
  } catch (err) {
    res.render(errorRender);
  }
});


module.exports = router;