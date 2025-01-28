import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en">
        <body className="flex flex-col min-h-screen bg-gray-100">
          {/*<SessionProvider>*/}
          <Navbar />
          {children}
          <Footer />
          {/*</SessionProvider>*/}
        </body>
      </html>
    </>
  );
}
