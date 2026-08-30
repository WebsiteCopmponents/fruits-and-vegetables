import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import TopBar from "@/components/TopBar";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import ConnectionAlert from "@/components/ConnectionAlert";
import AlertToaster from "@/components/AlertToaster";
import PromoBanners from "@/components/PromoBanners";
import SearchModal from "@/components/SearchModal";
import CookieConsent from "@/components/CookieConsent";
import CartSidePanel from "@/components/shop/CartSidePanel";
import ServiceFeatures from "@/components/ServiceFeatures";
import { isClerkConfigured } from "@/lib/clerk";
import { SearchModalProvider } from "@/lib/search-modal";
import { ShopStoreProvider } from "@/lib/shop-store";
import { chimeSaans, marcel, viktor } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "La Gracia",
  description: "La Gracia",
};

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ShopStoreProvider>
      <SearchModalProvider>
        <TopBar />
        <Nav />
        {children}
        <ServiceFeatures />
        <Footer />
        <MobileBottomNav />
        <ConnectionAlert />
        <AlertToaster />
        <PromoBanners />
        <CartSidePanel />
        <SearchModal />
        <CookieConsent />
      </SearchModalProvider>
    </ShopStoreProvider>
  );
}

const FALLBACK_CLERK_PUB_KEY =
  "pk_test_cGxhY2Vob2xkZXItY2xlcmstcGxheWdyb3VuZC5jbGVyay5hY2NvdW50cy5kZXYk";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publishableKey = isClerkConfigured()
    ? process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!
    : FALLBACK_CLERK_PUB_KEY;

  return (
    <html lang="en" className={`${marcel.variable} ${viktor.variable} ${chimeSaans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col max-lg:pb-[calc(4.75rem+env(safe-area-inset-bottom))]">
        <ClerkProvider publishableKey={publishableKey} afterSignOutUrl="/">
          <AppShell>{children}</AppShell>
        </ClerkProvider>
      </body>
    </html>
  );
}
