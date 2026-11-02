"use client"
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export default function NavLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const pathname = usePathname();
  
    const isAdmin =
      pathname.startsWith("/admin") || pathname.startsWith("/super-admin");
  return (
    <div>
      {!isAdmin && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isAdmin && <Footer />}
    </div>
  );
}
