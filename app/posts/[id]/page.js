import Post from "@/models/Post"
import { connectDB } from "@/lib/db"
import PostForm from "@/components/PostForm"
import CommentSection from "@/components/CommentSection"
import { getUserFromCookies } from "@/lib/auth"

export default async function PostDetailPage({ params, searchParams }) {
  await connectDB()
  const post = await Post.findById(params.id).lean()
  if (!post) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-lg font-semibold mb-2">Not found</h1>
        <p className="text-sm text-muted-foreground">This post does not exist.</p>
      </div>
    )
  }

  const user = await getUserFromCookies()
  const isOwner = user && String(user._id) === String(post.author)

  const editMode = searchParams?.edit === "1" && isOwner

  return (
    <div className="max-w-2xl mx-auto">
      {editMode ? (
        <>
          <h1 className="text-lg font-semibold mb-3">Edit post</h1>
          <PostForm
            initial={{
              _id: String(post._id),
              title: post.title,
              content: post.content,
              category: post.category || "",
              tags: post.tags || [],
            }}
            onSaved={(p) => (window.location.href = `/posts/${p._id}`)}
          />
        </>
      ) : (
        <>
          <h1 className="text-2xl font-semibold">{post.title}</h1>
          <div className="text-xs text-muted-foreground mt-1">
            {post.category} {post.tags?.length ? `• ${post.tags.join(", ")}` : ""}
          </div>
          <div className="prose prose-sm mt-4 whitespace-pre-wrap">{post.content}</div>
          {isOwner ? (
            <a href={`/posts/${post._id}?edit=1`} className="inline-block mt-4 px-3 py-1.5 rounded border text-sm">
              Edit post
            </a>
          ) : null}

          <CommentSection postId={String(post._id)} />
        </>
      )}
    </div>
  )
}
