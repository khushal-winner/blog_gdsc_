"use client"

import { useState } from "react"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })
    const data = await res.json()
    if (!res.ok) {
      alert(data.error || "Failed to sign up")
      return
    }
    window.location.href = "/"
  }

  return (
    <div className="max-w-sm mx-auto border rounded p-4">
      <h1 className="text-lg font-semibold mb-3">Sign up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          className="border rounded px-3 py-2"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          className="border rounded px-3 py-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="border rounded px-3 py-2"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="px-3 py-2 rounded bg-black text-white">Create account</button>
      </form>
    </div>
  )
}
