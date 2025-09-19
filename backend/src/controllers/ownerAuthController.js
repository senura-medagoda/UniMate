import Owner from '../models/owner.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Secret for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'pzUuguyJKW';

// Register new owner (optional)
export const registerOwner = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existing = await Owner.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Owner already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newOwner = new Owner({ fullName, email, password: hashedPassword });
    await newOwner.save();

    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to register', error: err });
  }
};

// Login owner
export const loginOwner = async (req, res) => {
  try {
    const { email, password } = req.body;

    const owner = await Owner.findOne({ email });
    if (!owner) return res.status(404).json({ message: 'Owner not found' });

    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: owner._id, email: owner.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ token, ownerId: owner._id, fullName: owner.fullName });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err });
  }
};
