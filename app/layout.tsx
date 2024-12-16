import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en">
        <body className="flex flex-col min-h-screen bg-gray-100">
          <Navbar />
          {children}
          <Footer />
        </body>
      </html>
    </>
  );
}
