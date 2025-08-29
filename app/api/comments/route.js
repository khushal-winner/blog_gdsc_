import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Comment from "@/models/Comment"
import { getUserFromCookies } from "@/lib/auth"
import Post from "@/models/Post"

export async function POST(req) {
  try {
    const user = await getUserFromCookies()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    await connectDB()
    const { postId, content } = await req.json()
    if (!postId || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }
    const post = await Post.findById(postId)
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 })
    const created = await Comment.create({ post: postId, author: user._id, content })
    return NextResponse.json({ comment: created })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
