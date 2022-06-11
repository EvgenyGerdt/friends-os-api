import * as bcrypt from 'bcrypt';

export async function encodePassword(rawPassword: string) {
  const salt = await bcrypt.genSalt(+process.env.SALT);
  return bcrypt.hash(rawPassword, salt);
}

export async function comparePasswords(rawPassword: string, hash: string) {
  return bcrypt.compare(rawPassword, hash);
}
