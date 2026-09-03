import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LTI Sistemas | Engenharia de Software Corporativa & Arquitetura de Alta Complexidade",
  description:
    "Desenvolvimento de ecossistemas corporativos escaláveis, sistemas de missão crítica, arquitetura cloud-native, modernização de legados e liderança técnica para empresas em crescimento.",
  keywords: [
    "LTI Sistemas",
    "Engenharia de Software Corporativa",
    "Consultoria em Arquitetura de Software",
    "Clean Architecture",
    "Modernização de Sistemas Legados",
    "C# .NET Core",
    "Node.js NestJS",
    "React Next.js",
    "AWS Cloud-Native",
    "DevOps Terraform",
    "Aceleração de Squads",
    "Tech Lead as a Service",
  ],
  authors: [{ name: "LTI Sistemas" }, { name: "Luiz Felipe Marinho Dantas" }],
  creator: "LTI Sistemas",
  publisher: "LTI Sistemas",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://ltisistemas.com.br",
    title: "LTI Sistemas | Engenharia de Software de Alta Complexidade & Soluções Corporativas",
    description:
      "Sistemas críticos, modernização de legados, arquitetura cloud escalável e governança técnica de excelência.",
    siteName: "LTI Sistemas",
  },
  twitter: {
    card: "summary_large_image",
    title: "LTI Sistemas | Engenharia de Software Corporativa",
    description:
      "Engenharia de software de alta complexidade, arquitetura cloud-native e liderança técnica sob medida.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "LTI Sistemas",
  legalName: "Luiz Tecnologia da Informação LTDA",
  url: "https://ltisistemas.com.br",
  logo: "https://ltisistemas.com.br/favicon.ico",
  description:
    "Empresa de engenharia de software corporativa especializada em sistemas de alta complexidade, arquitetura cloud-native, modernização de legados e aceleração de squads.",
  founder: {
    "@type": "Person",
    name: "Luiz Felipe Marinho Dantas",
    jobTitle: "Founder & Chief Solutions Architect",
    sameAs: "https://www.linkedin.com/in/luizfelipemarinhodantas/",
  },
  knowsAbout: [
    "Corporate Software Engineering",
    "Software Architecture",
    "Clean Architecture",
    "C# .NET Core",
    "React & Next.js",
    "Cloud Computing AWS",
    "DevOps & CI/CD",
    "Microservices",
    "Legacy Modernization",
    "Tech Leadership",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Support",
    email: "luizltisistemas@gmail.com",
    telephone: "+55-81-97312-3278",
    availableLanguage: ["Portuguese", "English"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#080c14] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
