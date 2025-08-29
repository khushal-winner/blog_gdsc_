"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

export default function Navbar() {
  const [user, setUser] = useState(null)
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "My Blog"

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => {})
  }, [])

  async function handleSignout() {
    await fetch("/api/auth/signout", { method: "POST" })
    window.location.href = "/"
  }

  return (
    <header className="w-full border-b bg-background">
      <nav className="mx-auto max-w-3xl flex items-center justify-between p-4">
        <Link href="/" className="font-semibold text-lg">
          {appName}
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/posts/new" className="px-3 py-1.5 rounded bg-black text-white text-sm">
            New Post
          </Link>
          <Link href="/posts/manage" className="px-3 py-1.5 rounded border text-sm">
            Manage
          </Link>
          {user ? (
            <>
              <span className="text-sm">Hi, {user.name}</span>
              <button onClick={handleSignout} className="px-3 py-1.5 rounded border text-sm">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="px-3 py-1.5 rounded border text-sm">
                Sign in
              </Link>
              <Link href="/auth/signup" className="px-3 py-1.5 rounded border text-sm">
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
