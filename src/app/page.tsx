"use client";

import Link from "next/link";
import "./home.css"; // For custom animations

export default function HomePage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 z-0 animate-fadeIn">
        <div className="w-full h-full stars"></div>
      </div>

      <div className="z-10 text-center p-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
          SkillSync AI
        </h1>
        <p className="text-lg sm:text-xl max-w-xl mb-8 mx-auto text-gray-300">
          Seamlessly parse resumes and job descriptions. Instantly find your best career match.
        </p>

        <Link
          href="/auth"
          className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-lg font-semibold shadow-md hover:bg-blue-700 transition transform hover:scale-105"
        >
          Get Started
        </Link>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="p-4 bg-gray-800/70 rounded-xl shadow-lg hover:shadow-xl transition backdrop-blur-md">
            <h3 className="text-xl font-semibold mb-2">Resume Parsing</h3>
            <p className="text-sm text-gray-400">Extract your details from PDF, DOCX with AI.</p>
          </div>
          <div className="p-4 bg-gray-800/70 rounded-xl shadow-lg hover:shadow-xl transition backdrop-blur-md">
            <h3 className="text-xl font-semibold mb-2">Job Match</h3>
            <p className="text-sm text-gray-400">Compare your resume with job descriptions instantly.</p>
          </div>
          <div className="p-4 bg-gray-800/70 rounded-xl shadow-lg hover:shadow-xl transition backdrop-blur-md">
            <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
            <p className="text-sm text-gray-400">All data processed securely. Nothing stored unless you choose.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
