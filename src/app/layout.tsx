import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Побажання до перебування",
  description: "Заповніть побажання до вашого перебування",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <a href="#main-content" className="skip-link">
          Перейти до основного вмісту
        </a>
        {children}
      </body>
    </html>
  );
}
