const router = require("express").Router();

const User = require("../models/User.model");
const Property = require("../models/Property.model");
//const Incident = require("../models/Incident.model");

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

const fileUpload = require("../utils/fileUpload");

let templatePath = "./incident";
let redirectPath = "/incident";
let errorRender = "error";
/*
 subject,description, status,
    property,
    user,
 */

module.exports = router;
