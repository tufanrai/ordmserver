import bcrypt from 'bcryptjs';

// Hash password
export const hashPassword = async (password: string) => {
  const Salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, Salt);
};

// Verify Password
export const verifyPassword = async (password: string, hash: string) => {
  const result = await bcrypt.compare(password, hash);
  return result;
};
