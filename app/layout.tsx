import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

import { ConvexClientProvider } from "@/components/convexClientProvider";
import SyncUserWithConvex from "@/components/SyncUserWithConvex";
import Header from "@/components/Header";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Ticketz",
  description: "Ticket Marketplace SAAS Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ConvexClientProvider>
          <ClerkProvider>
            <Header/>
            <SyncUserWithConvex />
            {children}
            <Toaster />
          </ClerkProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
