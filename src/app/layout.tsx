import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Побажання до перебування",
  description: "Заповніть побажання до вашого перебування",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
