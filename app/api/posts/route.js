import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Post from "@/models/Post"
import { getUserFromCookies } from "@/lib/auth"

export async function GET(req) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || ""
    const tagsParam = searchParams.get("tags") || ""
    const mine = searchParams.get("mine") === "1"

    const query = {}
    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { content: { $regex: search, $options: "i" } }]
    }
    if (category) {
      query.category = { $regex: `^${category}$`, $options: "i" }
    }
    if (tagsParam) {
      const tags = tagsParam
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
      if (tags.length) query.tags = { $in: tags }
    }
    if (mine) {
      const user = await getUserFromCookies()
      if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      query.author = user._id
    }

    const posts = await Post.find(query).sort({ createdAt: -1 }).lean()
    return NextResponse.json({ posts })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const user = await getUserFromCookies()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectDB()
    const { title, content, category = "", tags = [] } = await req.json()
    if (!title || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }
    const normalizedTags = Array.isArray(tags) ? tags.map((t) => String(t).trim()).filter(Boolean) : []

    const created = await Post.create({
      title,
      content,
      category: String(category || ""),
      tags: normalizedTags,
      author: user._id,
    })
    return NextResponse.json({ post: created })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
