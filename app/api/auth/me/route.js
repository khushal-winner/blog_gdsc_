import { NextResponse } from "next/server"
import { getUserFromCookies } from "@/lib/auth"

export async function GET() {
  const user = await getUserFromCookies()
  if (!user) return NextResponse.json({ user: null }, { status: 200 })
  return NextResponse.json({ user: { id: user._id, name: user.name, email: user.email } })
}
