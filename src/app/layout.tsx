import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "@/components/Footer";
import { CookiesProvider } from "next-client-cookies/server";
import ResponsiveNavbar from "@/components/ResponsiveNavbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Home Assist",
  description:
    "We are here to connect maid,gardner,cheif etc with required client",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CookiesProvider>
      <html lang="en">
        <body className={inter.className}>
          <Navbar />
          <ResponsiveNavbar />
          {children}
          <Footer />
        </body>
      </html>
    </CookiesProvider>
  );
}
