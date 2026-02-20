import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Change Roadmap | Technology Portfolio & Delivery",
  description: "Submit and track technology change requests across projects, features, production support and BAU.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
