import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";
import Navbar from '../components/Navbar';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Testimonials",
  description: "Get testimonials from your customers",
};

export default function RootLayout({ children }) {
  const path = usePathname();

  // Show Navbar only on the root path (/) and the profile path (/profile)
  const showNavbar = path === '/' || path === '/profile';

  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-gray-900 to-black">
        {showNavbar && <Navbar />}
        {children}
      </body>
    </html>
  );
}