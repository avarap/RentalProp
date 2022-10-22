const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema(
  {
    subject: String,
    description: String,
    status: String,
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Incident = mongoose.model("Incident", incidentSchema);

module.exports = Incident;
