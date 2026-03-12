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
      <html lang="ja" className="light"> 
        <body>                                              
          <header className="flex flex-col sm:flex-row items-start  
  sm:items-center justify-between px-8 py-6 gap-4">         
    <Link href="/" style={{ color: "#ff6a45" }}             
  className="font-bold text-lg">                            
      enockey                        
    </Link>                                                 
    <nav className="flex flex-wrap gap-4 sm:gap-8 text-sm 
  text-gray-500">                                           
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