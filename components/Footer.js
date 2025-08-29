export default function Footer() {
  return (
    <footer className="w-full border-t mt-8">
      <div className="mx-auto max-w-3xl p-4 text-sm text-muted-foreground">
        © {new Date().getFullYear()} {process.env.NEXT_PUBLIC_APP_NAME || "My Blog"}
      </div>
    </footer>
  )
}
