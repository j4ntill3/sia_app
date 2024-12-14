import "./globals.css";
import Navbar from "../../sia_app/app/components/Navbar";
import Footer from "../..//sia_app/app/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en">
        <body className="flex flex-col min-h-screen">
          <Navbar />
          {children}
          <Footer />
        </body>
      </html>
    </>
  );
}
