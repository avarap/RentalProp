// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");
const path = require("path");

hbs.registerHelper("log", function (something) {
  console.log(something);
});

hbs.registerHelper("isIncluded", function (val1, val2) {
  const newVal1 = val1.toString();
  const newVal2 = val2.map((val) => val.toString());
  if (newVal2.indexOf(newVal1) > -1) {
    return true;
  }
  return false;
});

hbs.registerPartials(path.join(__dirname, "views/partials"));

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

const fileUpload = require("express-fileupload");
app.use(fileUpload({ createParentPath: true }));

const capitalized = require("./utils/capitalized");
const projectName = "rentalProp";

app.locals.appTitle = `${capitalized(projectName)}`;

// 👇 Start handling routes here
const index = require("./routes/index.routes");
app.use("/", index);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const propertyRoutes = require("./routes/property.routes");
app.use("/property", propertyRoutes);

const incidentRoutes = require("./routes/incident.routes");
app.use("/incident", incidentRoutes);

const tenantRoutes = require("./routes/tenant.routes");
app.use("/tenant", tenantRoutes);

const userProfileRoutes = require("./routes/user.routes");
app.use("/", userProfileRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
