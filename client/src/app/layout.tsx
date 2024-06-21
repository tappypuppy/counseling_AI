import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "cocoro",
  description: "Created by Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <div className="flex flex-col justify-between w-full h-full min-h-screen"> */}
        <div className="w-100 h-100">
          <Header />
          {/* <main className="flex-auto w-full max-w-3xl px-4 py-4 mx-auto sm:px-6 md:px-6 md:py-6"> */}
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
