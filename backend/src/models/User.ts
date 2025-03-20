import mongoose, { Document, Schema, Model, Types } from "mongoose";
import bcrypt from "bcrypt";


export interface IUser extends Document {
  _id: Types.ObjectId; 
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  image?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}


const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    image: { type: String },
  },
  { timestamps: true } 
);

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as any);
  }
});


userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};


const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
