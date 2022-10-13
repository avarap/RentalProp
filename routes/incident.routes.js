const router = require("express").Router();

const User = require("../models/User.model");
const Property = require("../models/Property.model");
//const Incident = require("../models/Incident.model");

let templatePath = "./incident";
let redirectPath = "/incident";
let errorRender = "error";
/*
 subject,description, status,
    property,
    user,
 */

module.exports = router;
