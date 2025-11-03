
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/auth/auth-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const APP_NAME = "MockHick";
const APP_DEFAULT_TITLE = "MockHick: AI Interview Coach";
const APP_TITLE_TEMPLATE = "%s | MockHick";
const APP_DESCRIPTION = "Practice interviews with an AI, get instant feedback, and land your dream job. MockHick is your personal AI-powered interview coach.";


export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.ts",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  authors: [{ name: "Hakkan Shah", url: "https://hakkan.is-a.dev" }],
  creator: "Hakkan Shah",
  publisher: "Hakkan Shah",
  keywords: [
    "mockhick",
    "mock interview",
    "interview practice",
    "AI interview",
    "job preparation",
    "career coach",
    "Gemini AI",
    "voice interview",
  ],
  metadataBase: new URL("https://mockhick.vercel.app"), 
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    url: new URL("https://mockhick.vercel.app"), 
    images: [
      {
        url: "/mock.png", 
        width: 1200,
        height: 630,
        alt: "MockHick AI Interview Coach",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    creator: "@hakkanshah", 
    images: ["/mock.png"], 
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="font-body antialiased h-full">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
