import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Metrics } from "@/components/sections/Metrics";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Portfolio } from "@/components/sections/Portfolio";
import { TechStack } from "@/components/sections/TechStack";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#080c14] text-slate-100 relative">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-1 flex flex-col">
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Impact Metrics Bar */}
        <Metrics />

        {/* 3. About Luiz Felipe Section */}
        <About />

        {/* 4. Core Services Section */}
        <Services />

        {/* 5. Live Production Portfolio Section */}
        <Portfolio />

        {/* 6. Technical Stack Matrix Section */}
        <TechStack />

        {/* 7. Enterprise Experience Timeline Section */}
        <Experience />

        {/* 8. Conversion & Contact Section */}
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
