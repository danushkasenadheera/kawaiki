import type { Metadata } from "next";
import "../globals.css";
import { cabin } from "@/lib/fonts";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Kawaiki Admin" },
  robots: { index: false, follow: false },
};

// Admin pages depend on the signed-in user, so navigations may wait for the server.
export const instant = false;

/** Root layout for the admin (separate from the public site's /[lang] layout). */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cabin.variable} h-full antialiased`}>
      <body className="min-h-full bg-sand text-ink">{children}</body>
    </html>
  );
}
