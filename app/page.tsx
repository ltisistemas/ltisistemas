import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Metrics } from "@/components/sections/Metrics";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { Portfolio } from "@/components/sections/Portfolio";
import { About } from "@/components/sections/About";
import { TechStack } from "@/components/sections/TechStack";
import { Experience } from "@/components/sections/Experience";
import { Testimonials } from "@/components/sections/Testimonials";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Contact } from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc] text-slate-900 relative w-full max-w-full overflow-x-hidden">
      {/* Top Floating Navbar */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-1 flex flex-col w-full max-w-full overflow-x-hidden">
        {/* 1. Hero Section with Floating Credibility Badges & Quick Categories */}
        <Hero />

        {/* 2. Impact Metrics & Benchmarks Bar */}
        <Metrics />

        {/* 3. Core Services & Expertise Grid */}
        <Services />

        {/* 4. 3-Step Agile Working Process */}
        <Process />

        {/* 5. Live Digital Product Showcase with Interactive Filter Tabs */}
        <Portfolio />

        {/* 6. Strategic Pillars & Enterprise Governance */}
        <About />

        {/* 7. Technology Arsenal & Engineering Stack */}
        <TechStack />

        {/* 8. Enterprise Experience Timeline */}
        <Experience />

        {/* 9. Client & Partner Testimonials (5-Stars Social Proof) */}
        <Testimonials />

        {/* 10. High-Impact Conversion Banner */}
        <CtaBanner />

        {/* 11. 1-Click WhatsApp & Corporate Contact */}
        <Contact />
      </main>

      {/* Corporate Footer */}
      <Footer />
    </div>
  );
}
