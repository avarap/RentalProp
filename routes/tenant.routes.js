const router = require("express").Router();

const User = require("../models/User.model");
const Property = require("../models/Property.model");
const Tenant = require("../models/Tenant.model");

// const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

let templatePath = "./tenant";
let redirectPath = "/tenant";
let errorRender = "error";


router.get("/", isLoggedIn, async (req, res, next) => {
  try {
    const data = await Tenant.find({ Owner: req.user._id });

    if (req.user.role === "Owner") {
      res.render(templatePath + "/tenants", {
        tenants: data,
        userInSession: req.user,
      });
      return;
    } else {
      res.render(templatePath + "/tenants", {
        tenants: data,
        userInSession: req.user,
      });
    }
  } catch (err) {
    console.log(err);
    res.render(errorRender);
  }
});

router.get("/create", isLoggedIn, async (req, res, next) => {
  const properties = await Property.findOne({ Owner: req.user._id });
  // const properties = await Property.aggregate([
  //   {
  //     $lookup: {
  //       from: "Tenants",
  //       localField: "_id",
  //       foreignField: "property",
  //       as: "company_users",
  //     },
  //   },
  //   { $match: { "company_users.0": { $exists: false } } },
  // ]).exec();
  //console.log(properties);
  res.render(templatePath + "/create", { userInSession: req.user, properties });
});

router.post("/create", isLoggedIn, async (req, res, next) => {
  try {
    const data = new Tenant();
    data.email = req.body.email;
    data.firstName = req.body.firstName;
    data.lastName = req.body.lastName;
    data.phone = req.body.phone;
    data.idcard = req.body.idcard;
    data.owner = req.user._id;

    if (req.files) {
      let fileU = await fileUpload(req.files.pictureProfile, req.user._id);
      data.pictureProfile = fileU;
    }

    data.property = req.body.property;

    await data.save();
    return res.redirect(redirectPath);
  } catch (err) {
    console.log(err);
    return res.status(400).render("tenant/create", {
      userInSession: req.user,
      errorMessage: "There was an error.",
    });
  }
});

router.get("/:id/delete", isLoggedIn, (req, res, next) => {
  const id = req.params.id;

  Tenant.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Tenant with id=${id}. Maybe Tenant was not found!`,
        });
      } else {
        res.send({ message: "Tenant was deleted successfully!" });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Could not delete Tenant with id=" + id });
    });
});

router.get("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const data = await Tenant.findOne({ Owner: req.user._id,  _id: req.params.id, });
    const properties = await Property.find({ Owner: req.user._id });
    //console.log("***L1",properties)

    res.render(templatePath + "/tenant-details", {
      tenant: data,
      userInSession: req.user,
      properties,
    });
  } catch (err) {
    res.render(errorRender);
  }
});

router.post("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const data = await Tenant.findOne({
      Owner: req.user._id,
      _id: req.params.id,
    });
    data.email = req.body.email;
    data.firstName = req.body.firstName;
    data.lastName = req.body.lastName;
    data.phone = req.body.phone;
    data.idcard = req.body.idcard;
    data.owner = req.user._id;
    if (req.files) {
      let fileU = await fileUpload(req.files.pictureProfile, req.user._id);
      data.pictureProfile = fileU;
    }
    await data.save();
    return res.redirect(redirectPath);
  } catch (err) {
    console.log(err);
    res.render(errorRender);
  }
});

module.exports = router;
