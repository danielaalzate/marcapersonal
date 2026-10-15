import type { Metadata } from "next";
import "./globals.css";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Daniela Alzate",
  url: "https://danielaalzate.com",
  description:
    "Páginas web y estrategia digital para organizaciones culturales en España y Colombia.",
  telephone: "+34624463748",
  areaServed: ["España", "Colombia"],
  founder: {
    "@type": "Person",
    name: "Daniela Alzate Afanador",
    jobTitle: "Consultora de estrategia digital y gestión cultural",
    sameAs: ["https://www.linkedin.com/in/daniela-alzate-afanador-840a89a5/"],
  },
};

export const metadata: Metadata = {
  metadataBase: new URL("https://danielaalzate.com"),
  title: "Daniela Alzate | Estrategia digital para la cultura",
  description: "Páginas web y estrategia digital para organizaciones culturales en España y Colombia.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
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
  return <html lang="es"><body>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
    {children}
  </body></html>;
}
