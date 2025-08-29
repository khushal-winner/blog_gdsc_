"use client"

import useSWR from "swr"
import Link from "next/link"
import { useEffect, useState } from "react"

const fetcher = (url) => fetch(url).then((r) => r.json())

export default function ManagePostsPage() {
  const { data, mutate } = useSWR("/api/posts?mine=1", fetcher)
  const posts = data?.posts || []

  const [drafts, setDrafts] = useState([])

  useEffect(() => {
    const list = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith("draft-")) {
        try {
          const val = JSON.parse(localStorage.getItem(key) || "{}")
          list.push({ key, ...val })
        } catch {}
      }
    }
    setDrafts(list)
  }, [])

  async function handleDelete(id) {
    if (!confirm("Delete this post?")) return
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" })
    if (!res.ok) {
      alert("Failed to delete")
      return
    }
    mutate()
  }

  function deleteDraft(key) {
    localStorage.removeItem(key)
    setDrafts((d) => d.filter((x) => x.key !== key))
  }

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h1 className="text-lg font-semibold mb-3">Your posts</h1>
        <div className="grid gap-2">
          {posts.length === 0 && <p className="text-sm text-muted-foreground">No posts yet.</p>}
          {posts.map((p) => (
            <div key={p._id} className="border rounded p-3 flex items-center justify-between">
              <div>
                <Link href={`/posts/${p._id}`} className="font-medium hover:underline">
                  {p.title}
                </Link>
                <div className="text-xs text-muted-foreground">
                  {p.category} {p.tags?.length ? `• ${p.tags.join(", ")}` : ""}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/posts/${p._id}`} className="px-3 py-1.5 rounded border text-sm">
                  View
                </Link>
                <Link href={`/posts/${p._id}?edit=1`} className="px-3 py-1.5 rounded border text-sm">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="px-3 py-1.5 rounded bg-red-600 text-white text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold mb-2">Local drafts</h2>
        <div className="grid gap-2">
          {drafts.length === 0 && <p className="text-sm text-muted-foreground">No drafts.</p>}
          {drafts.map((d) => (
            <div key={d.key} className="border rounded p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{d.title || "(Untitled)"}</div>
                <div className="text-xs text-muted-foreground">
                  {d.category} {d.tags ? `• ${d.tags}` : ""}
                </div>
              </div>
              <button onClick={() => deleteDraft(d.key)} className="px-3 py-1.5 rounded border text-sm">
                Delete draft
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
