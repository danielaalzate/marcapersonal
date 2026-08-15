import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daniela Alzate | Estrategia digital para la cultura",
  description: "Páginas web y estrategia digital para organizaciones culturales en España y Colombia.",
  openGraph: {
    title: "Daniela Alzate | Estrategia digital para la cultura",
    description: "Páginas web y estrategia digital para organizaciones culturales en España y Colombia.",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Daniela Alzate | Estrategia digital para la cultura",
    description: "Páginas web y estrategia digital para organizaciones culturales en España y Colombia.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
