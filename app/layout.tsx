import type { Metadata } from "next";
// import TopBar from "@/components/TopBar";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import ConnectionAlert from "@/components/ConnectionAlert";
import AlertToaster from "@/components/AlertToaster";
import PromoBanners from "@/components/PromoBanners";
import SearchModal from "@/components/SearchModal";
import CookieConsent from "@/components/CookieConsent";
import CartSidePanel from "@/components/shop/CartSidePanel";
import CartDock from "@/components/shop/CartDock";
import ServiceFeatures from "@/components/ServiceFeatures";
import { SearchModalProvider } from "@/lib/search-modal";
import { ShopStoreProvider } from "@/lib/shop-store";
import { chimeSaans, marcel, viktor } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Global Fruits Edinburgh Ltd",
  description:
    "Greengrocer in Tollcross, Edinburgh — fresh fruit, vegetables, exotic spices, and home deliveries.",
};

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ShopStoreProvider>
      <SearchModalProvider>
        {/* <TopBar /> */}
        <Nav />
        {children}
        <ServiceFeatures />
        <Footer />
        <MobileBottomNav />
        <ConnectionAlert />
        <AlertToaster />
        <PromoBanners />
        <CartDock />
        <CartSidePanel />
        <SearchModal />
        <CookieConsent />
      </SearchModalProvider>
    </ShopStoreProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${marcel.variable} ${viktor.variable} ${chimeSaans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col max-lg:pb-[calc(4.75rem+env(safe-area-inset-bottom))]">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
