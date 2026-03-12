import type { Metadata } from "next";
  import Link from "next/link";                             
  import "./globals.css";

 export const metadata: Metadata = {                       
    title: "enockey",                                       
    description: "photographer / illustrator / engineer",   
    icons: {                                  
      icon: "/favicon.png",                   
    },                                                      
  };                            
                                                            
  export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <html lang="ja">
        <body>
          <header className="flex items-center justify-between px-4 py-4 md:px-8 md:py-6">
            <Link href="/" style={{ color: "#ff6a45" }} className="font-bold text-lg shrink-0">
              enockey
            </Link>
            <nav className="flex gap-4 text-sm text-gray-500 md:gap-8">
              <Link href="/profile">Profile</Link>
              <Link href="/illustration">Illustration</Link>
              <Link href="/photography">Photography</Link>
              <Link href="/contact">Contact</Link>
            </nav>
          </header>                                         
          {children}
        </body>
      </html>
    );
  }