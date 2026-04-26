import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import Navbar from "@/components/Navbar";
import ToastContainer from "@/components/ToastContainer";

export const metadata: Metadata = {
  title: "SafeDrawer – RFID přístupový systém",
  description: "Správa RFID přístupu k zabezpečeným šuplíkům",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body>
        <StoreProvider>
          <Navbar />
          <ToastContainer />
          <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
            {children}
          </main>
        </StoreProvider>
      </body>
    </html>
  );
}
