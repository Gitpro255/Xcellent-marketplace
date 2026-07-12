import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";

export const metadata: Metadata = {
  title: "Xcellent — Nigeria's marketplace for makers",
  description: "Buy and sell handmade, small-batch, and independent goods from sellers across Nigeria.",
};

const themeInitScript = `
  (function () {
    try {
      var stored = localStorage.getItem('xc-theme');
      var theme = stored || 'light';
      if (theme === 'dark') document.documentElement.classList.add('dark');
    } catch (e) {}
  })();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
