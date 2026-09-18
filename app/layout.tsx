import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import { SmoothScroll } from "@/components/ui/animations/SmoothScroll";
import { LoaderProvider } from "@/components/providers/LoaderProvider";
import { Loader } from "@/components/ui/Loader";
import { RouteLoader } from "@/components/navigation/RouteLoader";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://diligentkyc.com"),

  title: {
    default: "Diligent | The Universal Compliance Platform",
    template: "%s | Diligent",
  },

  description:
    "The Universal Compliance Platform for Banking, BGV, Vendor, Crypto and more.",

  applicationName: "Diligent",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    siteName: "Diligent",
    title: "Diligent | The Universal Compliance Platform",
    description:
      "The Universal Compliance Platform for Banking, BGV, Vendor, Crypto and more.",
    url: "https://diligentkyc.com",
  },

  twitter: {
    card: "summary_large_image",
    title: "Diligent | The Universal Compliance Platform",
    description:
      "The Universal Compliance Platform for Banking, BGV, Vendor, Crypto and more.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${interTight.variable}`}
    >
      <body>
        <LoaderProvider>
          <RouteLoader />
          <Loader />
          <SmoothScroll>{children}</SmoothScroll>
        </LoaderProvider>
      </body>
    </html>
  );
}