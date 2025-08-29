import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import { comparePassword, signToken, setAuthCookie } from "@/lib/auth"

export async function POST(req) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }
    await connectDB()
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 })
    }
    const ok = await comparePassword(password, user.password)
    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 })
    }
    const token = signToken({ id: user._id.toString(), email: user.email })
    const res = NextResponse.json({ user: { id: user._id, name: user.name, email: user.email } })
    setAuthCookie(res, token)
    return res
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
