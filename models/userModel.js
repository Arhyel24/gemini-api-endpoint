import mongoose from "mongoose";
import argon2 from "argon2";

// Define the User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: [true, "Username already exists"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email already exists"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    // validate: {
    //   validator: (value) => {
    //     return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value);
    //   },
    //   message:
    //     "Password must be at least 8 characters long and contain at least one letter and one number",
    // },
  },
});
// Hash password before saving to database
userSchema.pre("save", async function (next) {
  console.log("fired");
  if (this.isModified("password")) {
    console.log("2 fire");
    this.password = await argon2.hash(this.password);
  }
  next();
});

// Compare password during login
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await argon2.verify(this.password, candidatePassword);
  } catch (err) {
    return false;
  }
};

// Create the User model
const User = mongoose.model("User", userSchema);

export default User;
