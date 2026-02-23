"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { structureDataPrompt } from "@/prompts/pdf-extract";
import Script from "next/script";
import { useState, useEffect, useRef } from "react";

declare global {
  interface Window {
    pdfjsLib: any;
  }
}


interface FolderSelectionProps {
  onPDFPageRead: (data: {
    filename: string;
    page: number;
    content: string;
  }) => void;
  llmWorker: Worker | null;
}

export function FolderSelection({ onPDFPageRead, llmWorker }: FolderSelectionProps) {
  // State to track pending LLM requests
  const pendingRequestRef = useRef<{
    resolve: (value: string) => void;
    reject: (error: Error) => void;
  } | null>(null);

  useEffect(() => {
    if (!llmWorker) return;

    const handleMessage = (event: MessageEvent) => {
      const { type, data } = event.data;

      if (type === "complete") {
        console.log("LLM Complete Response:", data);
        if (pendingRequestRef.current) {
          pendingRequestRef.current.resolve(data);
          pendingRequestRef.current = null;
        }
      } else if (type === "error") {
        console.error("LLM Error:", data);
        if (pendingRequestRef.current) {
          pendingRequestRef.current.reject(new Error(data));
          pendingRequestRef.current = null;
        }
      }
    };

    llmWorker.addEventListener("message", handleMessage);

    return () => {
      llmWorker.removeEventListener("message", handleMessage);
    };
  }, [llmWorker]);

  const processWithLLM = async (pdfText: string): Promise<string> => {
    if (!llmWorker) {
      console.error("LLM worker not available");
      throw new Error("LLM worker not available");
    }

    return new Promise((resolve, reject) => {
      try {
        console.log("Sending request to LLM worker...");

        // Store the promise callbacks
        pendingRequestRef.current = { resolve, reject };

        const messages = [
          {
            role: "user",
            content: `${structureDataPrompt}\n\nText to extract from:\n${pdfText}`,
          },
        ];

        llmWorker.postMessage({
          type: "generate",
          data: {
            messages,
            max_new_tokens: 2048,
          },
        });
      } catch (error) {
        console.error("Error processing with LLM:", error);
        reject(error);
      }
    });
  };

  const openDirectory = async (mode = "read") => {
    const supportsFileSystemAccess =
      "showDirectoryPicker" in window &&
      (() => {
        try {
          return window.self === window.top;
        } catch {
          return false;
        }
      })();

    if (supportsFileSystemAccess) {
      let directoryStructure = undefined;

      const getFiles = async (dirHandle: any, path = dirHandle.name) => {
        const dirs = [];
        const files = [];
        for await (const entry of dirHandle.values()) {
          const nestedPath = `${path}/${entry.name}`;
          if (entry.kind === "file") {
            files.push(
              entry.getFile().then((file: any) => {
                file.directoryHandle = dirHandle;
                file.handle = entry;
                return Object.defineProperty(file, "webkitRelativePath", {
                  configurable: true,
                  enumerable: true,
                  get: () => nestedPath,
                });
              })
            );
          } else if (entry.kind === "directory") {
            dirs.push(getFiles(entry, nestedPath));
          }
        }
        return [
          ...(await Promise.all(dirs)).flat(),
          ...(await Promise.all(files)),
        ];
      };

      try {
        // @ts-ignore - showDirectoryPicker is not in TypeScript types yet
        const handle = await showDirectoryPicker({
          mode,
        });
        directoryStructure = getFiles(handle, undefined);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error(err.name, err.message);
        }
      }
      return directoryStructure;
    }
    // Fallback if the File System Access API is not supported.
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.webkitdirectory = true;

      input.addEventListener("change", () => {
        let files = Array.from(input.files || []);
        resolve(files);
      });
      if ("showPicker" in HTMLInputElement.prototype) {
        input.showPicker();
      } else {
        input.click();
      }
    });
  };

  const processPDFFile = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      // Process each page sequentially
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const text = textContent.items
          .map((item: any) => item.str)
          .join(" ");

        onPDFPageRead({
          filename: file.name,
          page: pageNum,
          content: text,
        });

        // Send the PDF text to LLM for extraction and wait for response
        console.log(`Processing page ${pageNum} of ${pdf.numPages}...`);
        const result = await processWithLLM(text);
        console.log(`Page ${pageNum} extraction complete:`, result);
      }
    } catch (error) {
      console.error(`Error processing PDF ${file.name}:`, error);
    }
  };

  const handleSelectFolder = async () => {
    const filesInDirectory = await openDirectory();
    if (!filesInDirectory) {
      return;
    }
    const files = await filesInDirectory;
    const fileArray = Array.from(files as File[]);

    // Process each file asynchronously
    for (const file of fileArray) {
      if (file.name.toLowerCase().endsWith('.pdf')) {
        await processPDFFile(file);
      }
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardContent className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-white mb-6">Select Folder</h2>
          <Button
            onClick={handleSelectFolder}
            size="lg"
            className="bg-white text-black hover:bg-white/90"
          >
            Choose Folder
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
