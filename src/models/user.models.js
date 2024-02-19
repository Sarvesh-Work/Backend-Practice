import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // Cloudinary url
      required: true,
    },
    coverImage: {
      type: String, // Cloudinary url
    },
    watchHistory: [
      {
        type: Schema.Type.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save",async function(next){
  if(this.isModified("password")) return next()

   this.password= await bcrypt.hash(this.password,10)
   next()
})

userSchema.methods.isPasswordCorrect=async function (password)
{
  return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=function () {
    jwt.sign({
      _id:this._id,
      userName:this.username,
      fullName:this.fullName,
      email:this.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn:process.env.ACCESS_TOKEN_SECRET
    }
    )
}

userSchema.methods.generateRefreshToken=function () {
  jwt.sign({
    _id:this._id,

  },
  process.env.REFRESH_TOKEN_SECRET,
  {
    expiresIn:process.env.REFRESH_TOKEN_EXPIRY
  }
  )
}

export const user = mongoose.model("User", userSchema);
