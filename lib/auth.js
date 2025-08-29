import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { connectDB } from "./db"
import User from "@/models/User"

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET environment variable")
}

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash)
}

export async function getUserFromCookies() {
  const store = cookies()
  const token = store.get("token")?.value
  if (!token) return null
  const decoded = verifyToken(token)
  if (!decoded) return null
  await connectDB()
  const user = await User.findById(decoded.id).select("-password")
  return user || null
}

export function setAuthCookie(res, token) {
  // Uses NextResponse to set a HTTP-only cookie
  res.cookies.set("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
  return res
}

export function clearAuthCookie(res) {
  res.cookies.set("token", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  })
  return res
}
