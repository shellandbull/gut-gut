"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FolderSelection } from "@/components/folder-selection";
import Script from "next/script";
import { useState, useEffect, useRef } from "react";

declare global {
  interface Window {
    pdfjsLib: any;
  }
}

export default function Home() {
  const [pdfjsLoaded, setPdfjsLoaded] = useState(false);
  const [llmLoaded, setLlmLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState("Initializing...");
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    if (!workerRef.current) {
      workerRef.current = new Worker(new URL("../lib/llm-worker.ts", import.meta.url), {
        type: "module",
      });

      workerRef.current.onmessage = (event) => {
        const { type, data } = event.data;

        if (type === "progress") {
          setLoadingProgress(`Loading model: ${data.status || data.file || ""}...`);
        } else if (type === "ready") {
          setLlmLoaded(true);
          setLoadingProgress("Model ready!");
        }
      };

      workerRef.current.postMessage({ type: "init" });
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);
  const handlePDFPageRead = (data: {
    filename: string;
    page: number;
    content: string;
  }) => {
    console.log(`File: ${data.filename}, Page: ${data.page}`);
    console.log(`Content: ${data.content.substring(0, 100)}...`);
  };

  const isReady = pdfjsLoaded && llmLoaded;

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.min.js"
        onLoad={() => {
          if (window.pdfjsLib) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc =
              "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js";
            setPdfjsLoaded(true);
          }
        }}
      />
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.12_0.02_265)] via-[oklch(0.15_0.03_280)] to-[oklch(0.10_0.02_250)]" />

      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[oklch(0.75_0.25_195)] rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[oklch(0.65_0.35_330)] rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[oklch(0.55_0.3_300)] rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <main className="relative z-10">
        {!isReady ? (
          /* Loading Screen */
          <section className="flex min-h-screen items-center justify-center px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 text-white">
                Loading...
              </h1>
              <p className="text-lg md:text-xl text-white/80 leading-relaxed">
                {loadingProgress}
              </p>
              <p className="text-sm text-white/60 mt-4">
                {pdfjsLoaded ? "✓ PDF.js loaded" : "⏳ Loading PDF.js..."}
              </p>
              <p className="text-sm text-white/60">
                {llmLoaded ? "✓ LLM loaded" : "⏳ Loading LLM model..."}
              </p>
            </div>
          </section>
        ) : (
          <>
            {/* First Section - Full Viewport */}
            <section className="flex min-h-screen items-center justify-center px-8">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 text-white">
                  🏡 gut-gut 🏡
                </h1>
                <p className="text-lg md:text-xl text-white/80 leading-relaxed">
                  Hello stranger,
                  Give this application access to one directory in your computer
                  that's filled with Teilungserklärung PDFs and we will extract
                  information like management type, property name, etc, etc into
                  structured data.
               </p>
              </div>
            </section>

            <section className="min-h-screen px-8 py-16">
              <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 h-full">
                <FolderSelection
                  onPDFPageRead={handlePDFPageRead}
                  llmWorker={workerRef.current}
                />

                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="min-h-[400px]">
                  </CardContent>
                </Card>
              </div>
            </section>
          </>
        )}
      </main>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
      </div>
    </>
  );
}
