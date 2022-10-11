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
  const data = await Property.find({ Owner: req.user._id }, {}, { rented: -1 });
  Property.count(data);
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
  const data = await Property.find();
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
      return res.status(400).render("property/create", {
        userInSession: req.user,
        errorMessage:
          "ReferenceId need to be unique. The ReferenceId you chose is already in use.",
      });
    }
    // if (err.message.includes("duplicate key")) //Ask how to send a error message without cleaning the page
    //   return res.status(400).render(templatePath + "/create", { userInSession: req.user, errorMessage: "ReferenceId already exists!" });
    //console.log(err);
    //console.log(req.body);
  }
});

router.post("/:id/delete", isLoggedIn, (req, res, next) => {
  const id = req.params.id;

  Property.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Property with id=${id}. Maybe Property was not found!`,
        });
      } else {
        res.send({
          message: "Property was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Property with id=" + id,
      });
    });
});

router.get("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const data = await Property.findOne({ Owner: req.user._id, _id: req.params.id });
    res.render(templatePath + "/property-details", { property: data, userInSession: req.user });
  } catch (err) {
    res.render(errorRender);
  }
});

router.post("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const data = await Property.findOne({ Owner: req.user._id, _id: req.params.id });
    console.log(data);
    console.log(req.body,"body");
    console.log(req.params,"params");
    data.propertyType = req.body.propertyType;
    data.address = req.body.address;
    data.description = req.body.description;
    data.sizeM2 = req.body.sizeM2;
    data.roomNumber = req.body.roomNumber;
    data.price = req.body.price;

    if (!req.body.rented) data.rented = false;
    else data.rented = true;

    data.gallery = [];
    data.gallery.push(req.body.gallery);
    // data.Owner = req.user._id;
    data.Tenant = [];
    data.Tenant.push(req.body.Tenant);
    // console.log(data.toJSON());

    await data.save();

    //await Property.updateOne({ Owner: req.user._id, _id: req.params.id }, data.toJSON());
    res.redirect(redirectPath);

    //res.render(templatePath + "/property-details", { property: data, userInSession: req.user });
  } catch (err) {
    console.log(err);
    res.render(errorRender);
  }

  // try {
  //   const data = new Property();
  //   data.referenceID = req.body.referenceID;
  //   data.propertyType = req.body.propertyType;
  //   data.address = req.body.address;
  //   data.description = req.body.description;
  //   data.sizeM2 = req.body.sizeM2;
  //   data.roomNumber = req.body.roomNumber;
  //   data.price = req.body.price;

  //   if (!req.body.rented) data.rented = false;
  //   else data.rented = true;

  //   data.gallery.push(req.body.gallery);
  //   data.Owner = req.user._id;
  //   data.Tenant.push(req.body.Tenant);

  //   await data.save();
  //   res.redirect(redirectPath);
  // } catch (err) {
  //   if (err.code === 11000) {
  //     //Ask how to send a error message without cleaning the page
  //     return res.status(400).render("property/create", { userInSession: req.user, errorMessage: "ReferenceId need to be unique. The ReferenceId you chose is already in use." });
  //   }
  //   // if (err.message.includes("duplicate key")) //Ask how to send a error message without cleaning the page
  //   //   return res.status(400).render(templatePath + "/create", { userInSession: req.user, errorMessage: "ReferenceId already exists!" });
  //   console.log(err);
  //   console.log(req.body);
  // }
});

module.exports = router;
