import "./globals.css";
import ThemeProvider from "@/components/providers/ThemeProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

export const metadata = {
  title: "Deal Bazaar",
  description: "Modern eCommerce marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Header />

          <main className="min-h-screen pb-20 md:pb-0">
            {children}
          </main>

          <Footer />
          <MobileBottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}