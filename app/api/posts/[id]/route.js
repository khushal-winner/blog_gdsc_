import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Post from "@/models/Post"
import { getUserFromCookies } from "@/lib/auth"

export async function GET(_req, { params }) {
  try {
    await connectDB()
    const post = await Post.findById(params.id).lean()
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ post })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function PUT(req, { params }) {
  try {
    const user = await getUserFromCookies()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    await connectDB()
    const existing = await Post.findById(params.id)
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })
    if (existing.author.toString() !== user._id.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    const { title, content, category = "", tags = [] } = await req.json()
    existing.title = title ?? existing.title
    existing.content = content ?? existing.content
    existing.category = category ?? existing.category
    existing.tags = Array.isArray(tags) ? tags : existing.tags
    await existing.save()
    return NextResponse.json({ post: existing })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function DELETE(_req, { params }) {
  try {
    const user = await getUserFromCookies()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    await connectDB()
    const existing = await Post.findById(params.id)
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })
    if (existing.author.toString() !== user._id.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    await existing.deleteOne()
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
