const router = require("express").Router();

const User = require("../models/User.model");
const Property = require("../models/Property.model");
const Incident = require("../models/Incident.model");

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

const fileUpload = require("../utils/fileUpload");

let templatePath = "./incident";
let redirectPath = "/incident";
let errorRender = "error";

router.get("/", isLoggedIn, async (req, res, next) => {
  try {
    const data = await Incident.find({ Owner: req.user._id });

    if (req.user.role === "owner") {
      res.render(templatePath + "/incidents", {
        incidents: data,
        userInSession: req.user,
      });
      return;
    } else {
      res.render(templatePath + "/incidents", {
        incidents: data,
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
  res.render(templatePath + "/create", { userInSession: req.user, properties });
});

router.post("/create", isLoggedIn, async (req, res, next) => {
  try {
    /* 
 subject,description, status,
    property,
    user,
 */
    const data = new Incident();
    data.subject = req.body.subject;
    data.description = req.body.description;
    data.status = req.body.status;
    data.user = req.user._id;
    data.property = req.body.property;

    await data.save();
    return res.redirect(redirectPath);
  } catch (err) {
    console.log(err);
    return res.status(400).render("incident/create", {
      userInSession: req.user,
      errorMessage: "There was an error.",
    });
  }
});

router.get("/:id/delete", isLoggedIn, (req, res, next) => {
  const id = req.params.id;

  Incident.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Incident with id=${id}. Maybe Incident was not found!`,
        });
      } else {
        res.send({ message: "Incident was deleted successfully!" });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Could not delete Incident with id=" + id });
    });
});

router.get("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const data = await Incident.findOne({
      Owner: req.user._id,
      _id: req.params.id,
    });
    const properties = await Property.find({ Owner: req.user._id });

    res.render(templatePath + "/incident-details", {
      Incident: data,
      userInSession: req.user,
      properties,
    });
  } catch (err) {
    res.render(errorRender);
  }
});

router.post("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const data = await Incident.findOne({
      Owner: req.user._id,
      _id: req.params.id,
    });
    data.subject = req.body.subject;
    data.description = req.body.description;
    data.status = req.body.status;
    data.property = req.body.property;

    await data.save();
    return res.redirect(redirectPath);
  } catch (err) {
    console.log(err);
    res.render(errorRender);
  }
});

module.exports = router;
