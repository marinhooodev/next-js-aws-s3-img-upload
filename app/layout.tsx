import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Photo Upload",
  description: "AWS S3 Photo Gallery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.className}  antialiased bg-blue-50 min-h-screen flex flex-col` } 
      >
        <Toaster />
        {children}
      </body>
    </html>
  );
}
