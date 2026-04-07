import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import Navbar from "@/components/Navbar";
import ToastContainer from "@/components/ToastContainer";

export const metadata: Metadata = {
  title: "MySafe – Správa šuplíku",
  description: "Bezpečná správa přístupu k šuplíku pomocí RFID karet",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body>
        <StoreProvider>
          <Navbar />
          <ToastContainer />
          <main className="max-w-5xl mx-auto px-4 md:px-6 py-8">
            {children}
          </main>
        </StoreProvider>
      </body>
    </html>
  );
}
