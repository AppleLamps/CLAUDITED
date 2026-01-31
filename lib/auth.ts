import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

function getAuthEnv() {
  if (!ADMIN_PASSWORD || !JWT_SECRET) {
    throw new Error("Missing ADMIN_PASSWORD or JWT_SECRET");
  }
  return { adminPassword: ADMIN_PASSWORD, jwtSecret: JWT_SECRET };
}

export async function verifyPassword(password: string): Promise<boolean> {
  const { adminPassword } = getAuthEnv();
  return password === adminPassword;
}

export function generateToken(): string {
  const { jwtSecret } = getAuthEnv();
  return jwt.sign(
    {
      role: "admin",
    },
    jwtSecret,
    { expiresIn: "24h" }
  );
}

export function verifyToken(token: string): boolean {
  const { jwtSecret } = getAuthEnv();
  try {
    jwt.verify(token, jwtSecret);
    return true;
  } catch {
    return false;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (!token) return false;
  return verifyToken(token);
}

export async function requireAuth() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    throw new Error('Unauthorized');
  }
}
