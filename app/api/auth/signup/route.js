import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import { hashPassword, signToken, setAuthCookie } from "@/lib/auth"

export async function POST(req) {
  try {
    const { name, email, password } = await req.json()
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }
    await connectDB()
    const existing = await User.findOne({ email })
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 })
    }
    const hashed = await hashPassword(password)
    const user = await User.create({ name, email, password: hashed })
    const token = signToken({ id: user._id.toString(), email: user.email })
    const res = NextResponse.json({ user: { id: user._id, name: user.name, email: user.email } })
    setAuthCookie(res, token)
    return res
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
