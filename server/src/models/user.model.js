import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", function(){
    this.password = bcrypt.hashSync(this.password, 10)
})

// generateJWT is a private function in userSchema class
userSchema.methods.generateJWT =  function(){
    return jwt.sign({ id: this._id}, process.env.JWT_SECRET, { expiresIn: "1h"},)
}

const UserModel = mongoose.model("User", userSchema);

export default UserModel;