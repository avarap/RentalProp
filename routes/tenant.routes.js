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
  console.log("helllooo from tenants");

  try {
    const data = await Tenant.find({ Owner: req.user._id });
    //Property.count(data);
    if (req.user.role === "owner") {
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
  res.render(templatePath + "/create", { userInSession: req.user });
});

/*
email,firstName,lastName,pictureProfile,phone,idcard,owner,property,
*/
router.post("/create", isLoggedIn, async (req, res, next) => {
  try {
    const data = new Tenant();
    data.email = req.body.email;
    data.firstName = req.body.firstName;
    data.lastName = req.body.lastName;
    data.phone = req.body.phone;
    data.idcard = req.body.idcard;
    data.owner = req.user._id;

    // try {
    //   if (req.files.pictureProfile) {
    //     const fileName = req.files.pictureProfile.name;
    //     const fileNameExt = fileName.split(".").slice(-1);
    //     const newFilename = uuidv4();
    //     const fileLoc = path.join("public", "uploads", newFilename + "." + fileNameExt);
    //     await req.files.pictureProfile.mv(fileLoc);
    //     data.pictureProfile=newFilename + "." + fileNameExt;
    //   }
    // } catch (err) {
    //   data.pictureProfile="";
    // }

    await data.save();
    return res.redirect(redirectPath);
  } catch (err) {
    return res.status(400).render("property/create", {
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
    const data = await Tenant.findOne({
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
    await data.save();
    return res.redirect(redirectPath);
  } catch (err) {
    console.log(err);
    res.render(errorRender);
  }
});

module.exports = router;
