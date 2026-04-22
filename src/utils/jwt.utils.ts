import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

interface IPayload {
  name: string;
  email: string;
  role: string;
  restaurant: mongoose.Types.ObjectId;
}

// Environment variables
const secretKey = process.env.JWT_SECRET_KEY ?? '236f5ts46h7bhtwr3eb35hbt90';
const expiryDate = process.env.JWT_EXPIRY_DATE ?? '15d';

// Generate token
export const generateToken = (data: IPayload) => {
  return jwt.sign(data, secretKey, { expiresIn: expiryDate as any });
};

// Decode token and check expiry date
export const verifyToken = (token: string) => {
  const decoded = jwt.verify(token, secretKey) as jwt.JwtPayload;

  if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) return null;

  return decoded;
};
