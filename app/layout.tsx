import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NIGHTSHIFT — Virtual Chips, Controlled Energy",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
