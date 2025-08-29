"use client"

import { useEffect, useState } from "react"

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([])
  const [text, setText] = useState("")
  const [user, setUser] = useState(null)

  async function load() {
    const res = await fetch(`/api/comments/${postId}`)
    const data = await res.json()
    setComments(data.comments || [])
  }

  useEffect(() => {
    load()
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => {})
  }, [postId])

  async function addComment(e) {
    e.preventDefault()
    if (!text.trim()) return
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, content: text }),
    })
    if (res.status === 401) {
      alert("Please sign in to comment.")
      return
    }
    if (!res.ok) {
      alert("Failed to add comment")
      return
    }
    setText("")
    load()
  }

  return (
    <section className="mt-6">
      <h4 className="font-semibold mb-2">Comments</h4>
      <div className="flex flex-col gap-3">
        {comments.length === 0 && <p className="text-sm text-muted-foreground">No comments yet.</p>}
        {comments.map((c) => (
          <div key={c._id} className="border rounded p-3">
            <div className="text-xs text-muted-foreground">
              {c.author?.name || "Anonymous"} • {new Date(c.createdAt).toLocaleString()}
            </div>
            <p className="text-sm mt-1">{c.content}</p>
          </div>
        ))}
      </div>

      <form onSubmit={addComment} className="mt-4 flex flex-col gap-2">
        <textarea
          placeholder={user ? "Write a comment..." : "Sign in to comment"}
          disabled={!user}
          className="border rounded px-3 py-2 min-h-[80px]"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button disabled={!user} className="px-3 py-2 rounded bg-black text-white disabled:opacity-50">
          Add Comment
        </button>
      </form>
    </section>
  )
}
