import mongoose from 'mongoose';

const ownerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed
});

export default mongoose.model('Owner', ownerSchema);
