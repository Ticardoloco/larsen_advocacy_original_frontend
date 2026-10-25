import type { Metadata } from "next";
import { headers } from "next/headers";
import { Toaster } from "sonner";
// @ts-expect-error - Next.js allows CSS side-effect imports without a generated type declaration in this setup.
import "./globals.css";
// @ts-expect-error - TypeScript may not have declarations for this CSS side-effect import.
import "react-loading-skeleton/dist/skeleton.css";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

export const metadata: Metadata = {
  title: "Larsen Advocacy and Empowerment Foundation (LAEF)",
  description:
    "LAEF is a non-governmental organization committed to ending sexual violence and child trafficking through advocacy, education, empowerment and survivor support.",
  authors: [{ name: "Larsen Advocacy and Empowerment Foundation" }],
  openGraph: {
    title: "Larsen Advocacy and Empowerment Foundation (LAEF)",
    description: "Ending sexual violence and child trafficking through prevention, response and empowerment.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: [
      { url: "/laef-mark.png", type: "image/png" },
    ],
    shortcut: "/laef-mark.png",
    apple: "/laef-mark.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const currentPath = headersList.get("x-invoke-path") || "";
  const isAdmin = currentPath.startsWith("/admin");

  return (
    <html lang="en">
      <head>
        {/* Explicit Favicon Links to ensure browser tab icon renders properly */}
        <link rel="icon" href="/laef-mark.png" type="image/png" />
        <link rel="shortcut icon" href="/laef-mark.png" type="image/png" />
        <link rel="apple-touch-icon" href="/laef-mark.png" />

        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap"
        />
      </head>
      <body>
        <div className="flex min-h-screen flex-col">
          {!isAdmin && <Navbar />}
          <main className="flex-1">{children}</main>
          {!isAdmin && <Footer />}
        </div>

        {/* Global Sonner Toast Listener (duration set to 6 seconds) */}
        <Toaster position="top-right" richColors duration={6000} />
      </body>
    </html>
  );
}