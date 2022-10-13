const { Schema, model } = require("mongoose");

/*

phone
pictureProfile
*/
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["owner", "tenant", "admin"],
      default: "owner",
    },
    firstName: String,
    lastName: String,
    address: {
      street: String,
      zip: String,
      city: String,
    },
    pictureProfile: String,
    phone: String,
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
