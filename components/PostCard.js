import Link from "next/link"

export default function PostCard({ post }) {
  return (
    <article className="border rounded p-4 flex flex-col gap-2">
      <h3 className="text-lg font-semibold">
        <Link href={`/posts/${post._id}`} className="hover:underline">
          {post.title}
        </Link>
      </h3>
      <div className="text-xs text-muted-foreground">
        {post.category ? <span>Category: {post.category}</span> : null}
        {post.tags?.length ? <span className="ml-2">Tags: {post.tags.join(", ")}</span> : null}
      </div>
      <p className="text-sm text-pretty line-clamp-3">{post.content}</p>
    </article>
  )
}
