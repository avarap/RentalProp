const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const tenantSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["tenant"],
      default: "tenant",
    },
    firstName: String,
    lastName: String,
    pictureProfile: String,
    phone: String,
    idcard: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

// tenantSchema.index({ referenceID: 1, Owner: 1 }, { unique: true });

const Tenant = model("Tenant", tenantSchema);

module.exports = Tenant;
