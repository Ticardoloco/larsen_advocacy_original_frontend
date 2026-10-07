import type { Metadata } from "next";
import { headers } from "next/headers";
// @ts-expect-error - Next.js allows CSS side-effect imports without a generated type declaration in this setup.
import "./globals.css";
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
    icon: "/laef-mark.png",
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
        {/* Use standard lowercase HTML <link> tags in the head */}
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
      </body>
    </html>
  );
}