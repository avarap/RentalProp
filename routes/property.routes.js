const router = require("express").Router();
const User = require("../models/User.model");
const Property = require("../models/Property.model");
//const Incident = require("../models/Incident.model");

// Require necessary (isLoggedOut and isLoggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

// const fileUpload = require("../utils/fileUpload");
const fileUploader = require("../config/cloudinary.config");

let templatePath = "./property";
let redirectPath = "/property";
let errorRender = "error";

router.get("/", isLoggedIn, async (req, res, next) => {
  try {
    const userData = await User.findById(req.session.user._id);
    const data = await Property.find(
      { Owner: req.user._id },
      {},
      { rented: -1 }
    );
    //Property.count(data);
    if (userData.role === "owner") {
      res.render(templatePath + "/properties", {
        properties: data,
        userInSession: userData,
      });
      return;
    }
    res.render(templatePath + "/properties", {
      properties: data,
      userInSession: userData,
    });
  } catch (err) {
    console.log(err);
    res.render(errorRender);
  }
});

router.get("/create", isLoggedIn, async (req, res, next) => {
  res.render(templatePath + "/create", { userInSession: req.user });
});

// router.post(
//   "/create",
//   isLoggedIn,
//   fileUploader.single("property-image"),
//   async (req, res) => {
//     const propertyData = new Property();
//     propertyData.referenceID = req.body.referenceID;
//     propertyData.propertyType = req.body.propertyType;

//     await Property.create({ propertyData, imageUrl: req.file.path });
//     console.log(propertyData);
//   }
// );

router.post(
  "/create",
  isLoggedIn,
  fileUploader.single("property-image"),
  async (req, res, next) => {
    try {
      const data = new Property();
      data.referenceID = req.body.referenceID;
      data.propertyType = req.body.propertyType;
      data.address.street = req.body.street;
      data.address.zipCode = req.body.zipCode;
      data.address.city = req.body.city;
      data.description = req.body.description;
      data.sizeM2 = req.body.sizeM2;
      data.roomNumber = req.body.roomNumber;
      data.price = req.body.price;
      data.imageUrl = req.file.path;

      if (!req.body.rented) data.rented = false;
      else data.rented = true;

      // if (req.files) {
      //   let fileU = await fileUpload(req.files.gallery, req.user._id);
      //   data.gallery = [];
      //   data.gallery.push(fileU);
      // }

      data.Owner = req.user._id;
      data.Tenant = req.body.Tenant;

      await data.save();
      console.log(data);
      return res.redirect(redirectPath);
    } catch (err) {
      if (err.code === 11000) {
        //Ask how to send a error message without cleaning the page
        return res.status(400).render("property/create", {
          userInSession: req.user,
          errorMessage:
            "ReferenceId need to be unique. The ReferenceId you chose is already in use.",
        });
      }
      console.log(err);
      //console.log(req.body);
    }
  }
);

router.get("/:id/delete", isLoggedIn, (req, res, next) => {
  const id = req.params.id;

  Property.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Property with id=${id}. Maybe Property was not found!`,
        });
      } else {
        res.send({ message: "Property was deleted successfully!" });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Could not delete Property with id=" + id });
    });
});

router.get("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const data = await Property.findOne({
      Owner: req.user._id,
      _id: req.params.id,
    });
    res.render(templatePath + "/property-details", {
      property: data,
      userInSession: req.user,
    });
  } catch (err) {
    res.render(errorRender);
  }
});

router.post(
  "/:id",
  isLoggedIn,
  fileUploader.single("property-image"),
  async (req, res, next) => {
    try {
      const data = await Property.findOne({
        Owner: req.user._id,
        _id: req.params.id,
      });
      console.log(data);

      // data.propertyType = req.body.propertyType;
      data.address.street = req.body.street;
      data.address.zipCode = req.body.zipCode;
      data.address.city = req.body.city;
      data.description = req.body.description;
      data.sizeM2 = req.body.sizeM2;
      data.roomNumber = req.body.roomNumber;
      data.price = req.body.price;
      data.Tenant = req.body.Tenant;
      data.imageUrl = req.file.path;

      if (!req.body.rented) data.rented = false;
      else data.rented = true;

      // if (req.files) {
      //   let fileU = await fileUpload(req.files.gallery, req.user._id);
      //   data.gallery = [];
      //   data.gallery.push(fileU);
      // }

      await data.save();

      //await Property.updateOne({ Owner: req.user._id, _id: req.params.id }, data.toJSON());
      res.redirect(redirectPath);

      //res.render(templatePath + "/property-details", { property: data, userInSession: req.user });
    } catch (err) {
      console.log(err);
      res.render(errorRender);
    }
  }
);

module.exports = router;
