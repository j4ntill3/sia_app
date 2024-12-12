import "./globals.css";
import Navbar from "../../sia_app/app/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en">
        <body>
          <Navbar />
          {children}
          <div>Hola Mundo</div>
        </body>
      </html>
    </>
  );
}
