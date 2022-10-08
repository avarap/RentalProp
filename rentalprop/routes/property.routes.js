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
  //console.log(req.session);
  //console.log(req.user);
  const data = await Property.find({ Owner: req.user._id },{},{rented:-1});
  Property.count(data);
  console.log(data.length);
  if (req.user.role === "owner") {
    res.render(templatePath + "/properties", { properties: data, userInSession: req.user });
    return;
  }

  //   try {
  //     const data = await Property.find();
  //     res.render(templatePath + "/properties", { properties: data });
  //   } catch (err) {
  //     res.render(errorRender);
  //   }
});

router.get("/all", isLoggedIn, async (req, res, next) => {
  //console.log(req.session);
  //console.log(req.user);
  const data = await Property.find();
  //Property.count(data)
  console.log(data.length);
  if (req.user.role === "owner") {
    res.render(templatePath + "/properties", { properties: data, userInSession: req.user });
    return;
  }

  //   try {
  //     const data = await Property.find();
  //     res.render(templatePath + "/properties", { properties: data });
  //   } catch (err) {
  //     res.render(errorRender);
  //   }
});

router.get("/create", isLoggedIn, async (req, res, next) => {
  res.render(templatePath + "/create", { userInSession: req.user });
});

router.post("/create", isLoggedIn, async (req, res, next) => {
  try {
    const data = new Property();
    data.referenceID = req.body.referenceID;
    data.propertyType = req.body.propertyType;
    data.address = req.body.address;
    data.description = req.body.description;
    data.sizeM2 = req.body.sizeM2;
    data.roomNumber = req.body.roomNumber;
    data.price = req.body.price;

    if (!req.body.rented) data.rented = false;
    else data.rented = true;

    data.gallery.push(req.body.gallery);
    data.Owner = req.user._id;
    data.Tenant.push(req.body.Tenant);

    await data.save();
    res.redirect(redirectPath);
  } catch (err) {
    if (err.code === 11000) {
      //Ask how to send a error message without cleaning the page
      return res.status(400).render("property/create", { userInSession: req.user, errorMessage: "ReferenceId need to be unique. The ReferenceId you chose is already in use." });
    }
    // if (err.message.includes("duplicate key")) //Ask how to send a error message without cleaning the page
    //   return res.status(400).render(templatePath + "/create", { userInSession: req.user, errorMessage: "ReferenceId already exists!" });
    console.log(err);
    console.log(req.body);
  }
});

router.get("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const data = await Property.find({ Owner: req.user._id, _id:req.id });
    //findById(req.params.id);
    //await data.populate("Owner");

    res.render(templatePath + "/property-details", { property: data, userInSession: req.user });
  } catch (err) {
    res.render(errorRender);
  }
});

module.exports = router;
