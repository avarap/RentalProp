const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    referenceID: {
      type: String,
      required: true,
      unique: true,
    },
    propertyType: String,
    address: String,
    description: String,
    sizeM2: Number,
    roomNumber: Number,
    price: Number,
    rented: Boolean,
    gallery: [String],
    Owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    Tenant: [String],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
