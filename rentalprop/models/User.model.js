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
    password: String,
    role: String,
    firstName: String,
    lastName: String,
    address: String,
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
