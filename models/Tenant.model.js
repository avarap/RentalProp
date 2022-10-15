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
<<<<<<< HEAD
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
=======
    owner: { type: Schema.Types.ObjectId, ref: "User" },
>>>>>>> 49a801877709588514bfa2e362a2c66b5d79e05b
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

// tenantSchema.index({ referenceID: 1, Owner: 1 }, { unique: true });

const Tenant = model("Tenant", tenantSchema);

module.exports = Tenant;
