import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { SessionProvider } from "@/context/SessionProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en">
        <head>
          {/* Preconexión y carga de Noto Sans desde Google Fonts */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap"
            rel="stylesheet"
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="flex flex-col min-h-screen bg-gray-100">
          <SessionProvider>
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
          </SessionProvider>
        </body>
      </html>
    </>
  );
}
