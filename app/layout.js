import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "My Blog",
  description: "A simple blog",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="mx-auto max-w-3xl p-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
