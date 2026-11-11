import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ExternalLink, LogOut } from "lucide-react";
import { signOut } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";
import { images } from "@/lib/site";

async function AdminUser() {
  const admin = await requireAdmin();
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="hidden text-ink/70 sm:inline">{admin.email}</span>
      <form action={signOut}>
        <button type="submit" className="flex items-center gap-1.5 rounded px-2 py-1 hover:bg-sand">
          <LogOut className="size-4" /> Sign out
        </button>
      </form>
    </div>
  );
}

export default function DashLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-black/10 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-6">
            <Link href="/admin/" className="flex items-center gap-2">
              <Image src={images.logo.src} alt="" width={40} height={40} className="size-10" />
              <span className="font-semibold">Kawaiki Admin</span>
            </Link>
            <nav className="hidden items-center gap-4 text-sm sm:flex">
              <Link href="/admin/" className="hover:text-teal-dark">Packages</Link>
              <Link href="/" target="_blank" className="flex items-center gap-1 hover:text-teal-dark">
                View site <ExternalLink className="size-3.5" />
              </Link>
            </nav>
          </div>
          <Suspense fallback={<span className="text-sm text-ink/50">…</span>}>
            <AdminUser />
          </Suspense>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </>
  );
}
