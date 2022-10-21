const mongoose = require("mongoose");
const { stringify } = require("uuid");
// const autoIncrement = require("mongoose-auto-increment");

const propertySchema = new mongoose.Schema(
  {
    referenceID: {
      type: String,
      required: true,
    },
    propertyType: String,
    address: {
      street: String,
      zipCode: String,
      city: String,
    },
    description: String,
    sizeM2: Number,
    roomNumber: Number,
    price: Number,
    rented: Boolean,
    // gallery: String,
    imageUrl: String,
    Owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

// propertySchema.plugin(autoIncrement.plugin, {
//   model: "Property",
//   field: "referenceID",
// });
propertySchema.index({ referenceID: 1, Owner: 1 }, { unique: true });

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
