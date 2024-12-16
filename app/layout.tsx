import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginForm from "./components/LoginForm";

const sesion: boolean = true;

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
          {!sesion && <LoginForm />}
          {children}
          <Footer />
        </body>
      </html>
    </>
  );
}
