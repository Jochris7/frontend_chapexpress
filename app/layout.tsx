import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ConditionalNavbar } from "@/components/ConditionalNavbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChapExpress",
  description: "Boutique en ligne ChapExpress",
};

// Runs before hydration so the dark class (our default theme) is applied
// on first paint instead of flashing light, then swapping.
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('chapexpress-theme');
    var theme = stored === 'light' ? 'light' : 'dark';
    if (theme === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <ThemeProvider>
          <CartProvider>
            <ConditionalNavbar />
            {children}
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
