"use client"

import { useEffect, useState } from "react"

export default function PostForm({ initial, onSaved }) {
  const [title, setTitle] = useState(initial?.title || "")
  const [content, setContent] = useState(initial?.content || "")
  const [category, setCategory] = useState(initial?.category || "")
  const [tags, setTags] = useState(initial?.tags?.join(", ") || "")
  const isEdit = Boolean(initial?._id)

  // Autosave to localStorage as "draft"
  useEffect(() => {
    const key = isEdit ? `draft-${initial._id}` : "draft-new"
    const draft = { title, content, category, tags }
    localStorage.setItem(key, JSON.stringify(draft))
  }, [title, content, category, tags, isEdit, initial?._id])

  async function handleSubmit(e) {
    e.preventDefault()
    const payload = {
      title,
      content,
      category,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    }

    try {
      const res = await fetch(isEdit ? `/api/posts/${initial._id}` : "/api/posts", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.status === 401) {
        alert("You are not signed in. Saving as a local draft.")
        // Save explicit draft for new post
        const key = isEdit ? `draft-${initial._id}` : `draft-${Date.now()}`
        localStorage.setItem(key, JSON.stringify(payload))
        return
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Failed to save post")
      }
      const data = await res.json()
      onSaved?.(data.post)
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Title"
        className="border rounded px-3 py-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Category"
        className="border rounded px-3 py-2"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <input
        type="text"
        placeholder="Tags (comma separated)"
        className="border rounded px-3 py-2"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <textarea
        placeholder="Content"
        className="border rounded px-3 py-2 min-h-[160px]"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <div className="flex items-center gap-2">
        <button type="submit" className="px-3 py-2 rounded bg-black text-white">
          {isEdit ? "Update Post" : "Create Post"}
        </button>
      </div>
    </form>
  )
}
