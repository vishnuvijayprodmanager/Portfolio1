import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import { getContent } from "@/lib/data";
import Preloader from "@/components/Preloader";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";
import Aurora from "@/components/Aurora";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

// Reads the saved theme before paint so the site never flashes the wrong
// theme on load. Runs as an inline script since it must execute pre-hydration.
const themeScript = `
(function(){
  try {
    var t = localStorage.getItem("vv_theme") || "light";
    document.documentElement.dataset.theme = t;
  } catch (e) {}
})();
`;

const SITE_URL = "https://www.vishnuvijay.co.in";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getContent();
  const title = `${meta.name} — ${meta.role}`;
  const description = meta.tagline.replace(/\*/g, "");

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s — ${meta.name}`,
    },
    description,
    keywords: [
      meta.name,
      meta.role,
      "Product Manager portfolio",
      "Product Management",
      "SaaS product manager",
      meta.location,
    ],
    authors: [{ name: meta.name }],
    creator: meta.name,
    alternates: { canonical: "/" },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: SITE_URL,
      siteName: meta.name,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${dmSans.variable} ${dmMono.variable} antialiased`}>
        <Preloader />
        <CustomCursor />
        <ScrollProgress />
        <Aurora />
        {children}
      </body>
    </html>
  );
}
