"use client"

import useSWR from "swr"
import { useState, useMemo } from "react"
import PostCard from "@/components/PostCard"

const fetcher = (url) => fetch(url).then((r) => r.json())

export default function HomePage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState("")

  const query = useMemo(() => {
    const sp = new URLSearchParams()
    if (search) sp.set("search", search)
    if (category) sp.set("category", category)
    if (tags) sp.set("tags", tags)
    return `/api/posts?${sp.toString()}`
  }, [search, category, tags])

  const { data, isLoading } = useSWR(query, fetcher)

  return (
    <div className="flex flex-col gap-4">
      <div className="border rounded p-4 flex flex-col gap-2">
        <h2 className="font-semibold">Browse posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <input
            placeholder="Search..."
            className="border rounded px-3 py-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            placeholder="Category"
            className="border rounded px-3 py-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <input
            placeholder="Tags (comma separated)"
            className="border rounded px-3 py-2"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-3">
          {(data?.posts || []).map((p) => (
            <PostCard key={p._id} post={p} />
          ))}
          {data?.posts?.length === 0 && <p className="text-sm text-muted-foreground">No posts found.</p>}
        </div>
      )}
    </div>
  )
}
