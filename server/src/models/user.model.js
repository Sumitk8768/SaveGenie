import mongoose from "mongoose";
import bcrypt from "bcrypt"

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
      role: {               
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    refreshToken: {
      type: String,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationOtpHash: String,
    emailVerificationOtpExpires: Date,
    passwordResetOtpHash: String,
    passwordResetOtpExpires: Date,
  },
  { timestamps: true },
);

userSchema.pre("save", function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = bcrypt.hashSync(this.password, 10);
});

userSchema.methods.comparePass = async function (password) {
  return await bcrypt.compare(password, this.password)
}
const UserModel = mongoose.model("User", userSchema);

export default UserModel;