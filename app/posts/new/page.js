"use client"

import PostForm from "@/components/PostForm"

export default function NewPostPage() {
  function handleSaved(post) {
    if (post?._id) {
      window.location.href = `/posts/${post._id}`
    }
  }
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-lg font-semibold mb-3">Create a new post</h1>
      <PostForm onSaved={handleSaved} />
      <div className="mt-4 text-sm text-muted-foreground">
        Tip: If not signed in, your content will be saved as a local draft.
      </div>
    </div>
  )
}
