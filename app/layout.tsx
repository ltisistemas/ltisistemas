import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@/components/analytics/Analytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://ltisistemas.vercel.app";

export const viewport: Viewport = {
  themeColor: "#080c14",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "LTI Sistemas | Engenharia de Software Corporativa & Arquitetura de Alta Complexidade",
    template: "%s | LTI Sistemas",
  },
  description:
    "Desenvolvimento de ecossistemas corporativos escaláveis, sistemas de missão crítica, arquitetura cloud-native (AWS/Azure), modernização de legados sem downtime e aceleração de squads com 20 anos de know-how enterprise.",
  applicationName: "LTI Sistemas",
  keywords: [
    "LTI Sistemas",
    "Engenharia de Software Corporativa",
    "Consultoria em Arquitetura de Software",
    "Clean Architecture",
    "Modernização de Sistemas Legados",
    "C# .NET Core",
    "ASP.NET Web API",
    "Node.js NestJS",
    "React Next.js",
    "AWS Cloud-Native",
    "DevOps Terraform",
    "Aceleração de Squads",
    "Tech Lead as a Service",
    "Sistemas de Missão Crítica",
    "Luiz Felipe Marinho Dantas",
    "Software House Recife",
    "Desenvolvimento de Software Brasil",
  ],
  authors: [{ name: "LTI Sistemas", url: siteUrl }, { name: "Luiz Felipe Marinho Dantas", url: "https://www.linkedin.com/in/luizfelipemarinhodantas/" }],
  creator: "LTI Sistemas",
  publisher: "LTI Sistemas",
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    title: "LTI Sistemas | Engenharia de Software de Alta Complexidade & Soluções Corporativas",
    description:
      "Sistemas críticos, modernização de legados, arquitetura cloud escalável e governança técnica de excelência.",
    siteName: "LTI Sistemas",
    images: [
      {
        url: `${siteUrl}/favicon.ico`,
        width: 1200,
        height: 630,
        alt: "LTI Sistemas - Engenharia de Software Corporativa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LTI Sistemas | Engenharia de Software Corporativa",
    description:
      "Engenharia de software de alta complexidade, arquitetura cloud-native e liderança técnica sob medida.",
    creator: "@ltisistemas",
  },
  category: "technology",
};

// Rich Structured Data (JSON-LD)
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: "LTI Sistemas",
  legalName: "Luiz Tecnologia da Informação",
  url: siteUrl,
  logo: `${siteUrl}/favicon.ico`,
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
  sameAs: [
    "https://www.linkedin.com/in/luizfelipemarinhodantas/",
    "https://github.com/ltisistemas",
  ],
};

const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: "LTI Sistemas",
  description: "Engenharia de Software de Alta Complexidade, Arquitetura e Liderança Técnica",
  publisher: {
    "@id": `${siteUrl}/#organization`,
  },
  inLanguage: "pt-BR",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "O que é a LTI Sistemas e quais soluções de software ela oferece?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A LTI Sistemas (Luiz Tecnologia da Informação) é uma software house e consultoria de engenharia de software especializada em sistemas de missão crítica, arquitetura cloud-native escalável (AWS/Azure), consultoria em Clean Architecture, modernização de legados sem downtime e aceleração de squads técnicos.",
      },
    },
    {
      "@type": "Question",
      name: "Como funciona a consultoria em arquitetura de software e Tech Lead as a Service?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A LTI Sistemas aloca liderança técnica sênior e arquitetos de soluções hands-on com 20 anos de experiência para realizar diagnósticos de gargalos, definição de padrões arquiteturais, revisão rigorosa de código (code reviews) e mentoria técnica para squads corporativos.",
      },
    },
    {
      "@type": "Question",
      name: "A LTI Sistemas realiza modernização de sistemas legados sem parada operacional?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim. Empregamos padrões de engenharia como Strangler Fig Pattern e arquiteturas orientadas a eventos para desacoplar e migrar sistemas legados para a nuvem de forma progressiva e com zero downtime.",
      },
    },
    {
      "@type": "Question",
      name: "Quais tecnologias e linguagens a LTI Sistemas domina?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nosso arsenal técnico principal abrange C# .NET Core, ASP.NET Web API, Node.js (NestJS), React, Next.js, TypeScript, Tailwind CSS, Flutter, AWS Cloud, Docker, Terraform, PostgreSQL, SQL Server e Redis.",
      },
    },
  ],
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#080c14] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
        <Analytics />
        {children}
      </body>
    </html>
  );
}
