import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Comment from "@/models/Comment"

export async function GET(_req, { params }) {
  try {
    await connectDB()
    const comments = await Comment.find({ post: params.postId })
      .sort({ createdAt: -1 })
      .populate("author", "name email")
      .lean()
    return NextResponse.json({ comments })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
