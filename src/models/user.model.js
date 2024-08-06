import mongoose  from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      require: true,
      lowercase: true,
      trim: true,
      // if wants to enable searching in  db make index true
      index: true,
    },
    email: {
      type: String,
      unique: true,
      require: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      require: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //cloudnarity url\
      require: true,
    },
    coverimage: {
      type: String, //cloudnarity url\
    },
    watchhistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      require: [true, "password is req"],
    },
    refreshtoken: {
      type: String,
    },
  },
  { timestamps: true }
);




// // middleware pre is used to save pass encrypted

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 8 );
  next();
});

// // custom method

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,

    // EXPIRY take OBJECT
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {    
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,

    // EXPIRY take OBJECT
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};


export  const User = mongoose.model("User", userSchema);
