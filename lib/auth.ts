CLAUDITED\lib\auth.ts
```
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-change-this";

export async function verifyPassword(password: string): Promise<boolean> {
  if (!ADMIN_PASSWORD) {
    console.error("ADMIN_PASSWORD not configured");
    return false;
  }
  return password === ADMIN_PASSWORD;
}

export function generateToken(): string {
  return jwt.sign(
    {
      role: "admin",
    },
    JWT_SECRET,
    { expiresIn: "24h" }
  );
}

export function verifyToken(token: string): boolean {
  try {
    jwt.verify(token, JWT_SECRET);
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
