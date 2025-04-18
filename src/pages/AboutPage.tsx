// src/pages/AboutPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-gray-800">
      <h1 className="text-4xl font-bold mb-6 text-center text-purple-700">About GeneR</h1>

      <p className="text-lg leading-relaxed mb-8">
        <strong>GeneR</strong> is an open-source collection of scientific tools
tailored for bioinformatics and data science. From sequence analysis to
data visualization, our modular toolkit empowers researchers and enthusiasts
to tackle complex workflows with clarity.
      </p>

      <h2 className="text-2xl font-semibold text-purple-600 mb-4">Our Vision</h2>
      <p className="text-base leading-relaxed mb-6">
        We believe in open science and reproducible research. GeneR provides a
        unified, extensible platform where every tool integrates smoothly and
        adapts to evolving computational needs. By fostering community-driven
        development, we ensure that our suite stays at the cutting edge of
enabled discovery.
      </p>

      <h2 className="text-2xl font-semibold text-purple-600 mb-4">Flagship Projects</h2>
      <ul className="list-disc pl-6 text-base space-y-4 mb-8">
        <li>
          <strong>Bioinformatics Roadmap:</strong> An interactive roadmap
          generator to plan, track, and export personalized learning paths
          within bioinformatics—a project built as part of GeneR suite.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-purple-600 mb-4">Get Involved</h2>
      <p className="text-base leading-relaxed mb-6">
        Join our community of developers, biologists, and data scientists in
        shaping the next generation of open scientific tools. Contribute code,
suggest new modules, or help improve documentation.
      </p>

      <div className="mt-8 flex flex-col items-center gap-4">
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link to="/">Explore Roadmap Project</Link>
        </Button>
        <Button variant="outline" asChild size="lg" className="w-full sm:w-auto">
          <a href="https://github.com/mahmoudxyz/Comprehensive-Bioinformatics-Parallel-Learning-Roadmap" target="_blank" rel="noreferrer">
            Visit GitHub Repository
          </a>
        </Button>
      </div>

      <p className="text-center text-gray-500 mt-12">
        Built with passion by GeneR community. Open-source and free for all.
      </p>
    </div>
  );
}
