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


const TEXT_EXAMPLE = `
URKUNDENROLLE NR. 2024/05-B
Vorgelesen, genehmigt und unterschrieben: Berimn, den 15 Marz 2024
TEILUNGSERKLÄRUNG (gemaß $ 8 Wohnungseigentumsgesetz - WEG)
§ 1 Grundbuchstand und Eigentumsverhältnisse
Der unterzeichnende Eigentumer, die „Urban Future Development GmbH"
,
geschaftsansassg mn Berlin, ist als Alleineigentumer des nachstehenden Grundstucks mm
Grundbuch von Berlin-Mitte, Blatt 12345, eingetragen Das Grundstück umfasst de Gemarkung
Berfin-Mitte, Flur 12, Flurstuck 456/78 mt einer Gesamtgroße von 2 450 m?
Der Eigentumer erklart hiermit gemäß $ 8 WEG die Aufteilung des Grundstucks mn
Mtegentumsanteile, dejeweils mut dem Sondereigentum an bestimmten Raumlchketten
verbunden smd Das gesamte Objekt wird unter dem Namen „Parkview Residences Berlin"
gefuhrt und tragt zur internen Identifikation die Objektnummer 10.557PRB
Die Verwaltung des Objekts erfolgt nach den Grundsatzen enner
Wohnungseigentumergemernschaft (Verwaltungstyp WEG)
§ 2 Objektbeschreibung und Gebäudedaten
Aufdem Grundstuck werden zwer baulich getrennte, jedoch durch eine gemeinsame Tiefgarage
verbundene Baukorper errichtet De Gebaude entsprechen dem Energiestandard KfW 40 und
werden uber Ferwarme versorgt
(1) Gebäude 1 (Haus A -Parkside) Das Gebaude mit der Bezeichnung Haus A befindet such
an derAdresse Am Fiktivpark 12, 10557 Berlin Es wurde mm Baujahr 2023 fertiggestellt Das
Gebaude erstreckt sich uber insgesamt tunt Etagen (Erdgeschoss brs 4
Obergeschoss/Staffelgeschoss) und verfugt uber einen Personenaufzug, der alle Etagen
barrerefrer erschließt. Baulich handelt es sich um emn reines Wohngebaude mitgehobener
Ausstattung
(2) Gebäude 2 (Haus B -Cityside) Das Gebaude mit der Bezeichnung Haus B befindet such
an der Adresse Urbanstraße 88, 10557 Berlin Auch dieses Gebaude wurde mm Baujahr 2023
fertiggestellt Es umfasst ver Etagen (Erdgeschoss bis 3 Obergeschoss) und ist ebenfalls mit
einem Personenaufzug ausgestattet Baulich ist dieses Objekt als Mischgebaude konzipiert, das
mm Erdgeschoss gewerbliche Flachen und in den Obergeschossen Wohnraum bietet.
§ 3 Aufteilungsplan und Einheitenbeschreibung
Das Eigentum am Grundstuck wird mn 1 000 Miteigentumsanteile (MEA) zerlegt Nachstehend
werden die Einheiten, definiert durch ihre Einheitsnummer, ihren Nutzungstyp, ihre Lage und
thre Große, mm Detail beschrieben
1. EinheitNr. 01 (Apartment) Emn Miteigentumsanteil von 110,0/1.000, verbunden mtdem
Sondereigentum an der mm Aufteilungsplan mtder Nummer 01 bezeichneten Wohnung
• Nutzungstyp: Apartment
• Gebäudezugehörigkeit: Haus A
• Lage: Erdgeschoss, Eingang A (Haupteingang)
• Größe: ca 95,00 m? Wohnflache
• Zimmer: 3 Zimmer
• Baujahrder Einheit: 2023
• Beschreibung: Erdgeschosswohnung inks gelegen, Inklusive Terrasse
2. Einheit Nr. 02 (Apartment) Ein Miteigentumsanteil von 108,0/1.,000, verbunden mit dem
Sondereigentum an der mm Aufteilungsplan mit der Nummer 02 bezeichneten Wohnung
• Nutzungstyp: Apartment
• Gebäudezugehörigkeit: Haus A
• Lage: Erdgeschoss, Eingang A
• Größe: ca 92,50 m? Wohnflache
• Zimmer: 3 Zimmer
• Baujahrder Einheit: 2023
• Beschreibung: Erdgeschosswohnung rechts gelegen
3. Einheit Nr, 03 (Apartment) Ein Miteigentumsanteil von 120,0/1.000, verbunden mtdem
Sondereigentum an der mm Aufteilungsplan mit der Nummer 03 bezeichneten Wohnung
• Nutzungstyp: Apartment
• Gebäudezugehörigkeit: Haus A
• Lage: 1 Obergeschoss, Eingang A
• Größe: ca 105,00 m? Wohnflache
• Zimmer: 4 Zimmer
• Baujahrder Einheit: 2023
• Beschreibung: Familienwohnung mtBalkon zur Parkseite
4. Einheit Nr. 04 (Apartment) Ein Miteigentumsanteil von 90,0/1.000, verbunden mit dem
Sondereigentum an der im Aufteilungsplan mt der Nummer 04 bezeichneten Wohnung
» Nutzungstyp: Apartment
• Gebäudezugehörigkeit: Haus A
• Lage: 2 Obergeschoss, Emgang A
• Größe: ca 78,00 m? Wohnflache
• Zimmer: 2 Zimmer
• Baujahrder Einheit: 2023
Beschreibung: City-Apartment mnt Sud-Balkon
5, EinheitNr. 05 {Apartment) Ein Miteigentumsanteil von 160,0/1.000, verbunden mit dem
Sondereigentum an der mm Aufteilungsplan mit der Nummer 05 bezeichneten Wohnung
• Nutzungstyp: Apartment
• Gebäudezugeh6rigkeit: Haus A
• Lage: 4 Obergeschoss (Penthouse), Eingang A
• Größe: ca 145,00 m? Wohnflache
• Zimmer: 4 Zimmer
• Baujahrder Einheit: 2023
• Beschreibung: Staffelgeschosswohnung mit direktem Luftzugang.
6. Einheit Nr. 06 (Office) Emn Miteigentumsanteil von 125,0/1.000, verbunden mit dem
Sondereigentum an den mm Aufteilungsplan mtder Nummer 06 bezeichneten nicht zu
Wohnzwecken dienenden Raumen
• Nutzungstyp: Office (Gewerbe)
• Gebäudezugehörigkeit: Haus B
• Lage: Erdgeschoss, separater Eingang B
• Größe: ca 110,00 m2 Nutzflache
• Zimmer: - (Großraumflache zzgl Sozialraume)
• Baujahrder Einheit: 2023
• Beschreibung: Gewerbeeinhent fur buroarttge Nutzung oder stille PraxIs
7. EinheitNr. 07 (Apartment) Ein Miteigentumsanteil von 75,0/1.000, verbunden mit dem
Sondereigentum an der im Aufteilungsplan mit der Nummer 07 bezeichneten Wohnung
• Nutzungstyp: Apartment
• Gebäudezugehörigkeit: Haus B
• Lage: 1 Obergeschoss, Eingang B (Treppenhaus)
• Größe: ca 65,00 m? Wohnflache
• Zimmer: 2 Zimmer
• Baujahr der Einheit: 2023
• Beschreibung: Zur Straßenserte gelegene Wohnung mit Schallschutzverglasung
8. Einheit Nr. 08 (Apartment) Emn Miteigentumsanteil von 102,0/1.000, verbunden mut dem
Sondereigentum an der mm Aufteilungsplan mit der Nummer 08 bezeichneten Wohnung
• Nutzungstyp: Apartment
• Gebäudezugehörigkeit: Haus B
• Lage: 2 Obergeschoss, Eingang B
• Größe: ca 88,00 m? Wohnflache
Zimmer: 3 Zimmer
• Baujahrder Einheit: 2023
Beschreibung: Eckwohnung mtErker
9. Einheiten Nr. 09 bis 13 (Parking) Jeweils emn Miteigentumsanteil von 1,0/1.000 (insgesamt
5,0/1 000 fur 5 Einherten), jeweils verbunden mit dem Sondereigentum an dem im
Aufteilungsplan unter der gleichen Nummer gekennzeichneten Tiefgaragenstellplatz
• Nutzungstyp: Parkmng
• Gebäudezugehörigkeit: Tiefgarage (unter Haus A und B), Zufahrt uber Rampe
Urbanstraße
• Lage: Untergeschoss
• Größe: je ca 12,50 m? Nutzflache
• Zimmer: -
• Baujahr der Einheit: 2023
• Nummerierung: TG-01 bis TG-05 (entspricht SE-Nr 09 bis 13)
10. Einheit Nr. 14 (Garden) Hinweis ZurAbbildung des Typs "Garden"als separate Emheut
gemaß Datenstruktur Ein Miteigentumsanteil von 5,0/1.000, verbunden mit dem
Sondereigentum an dem mm Aufteilungsplan mit Nr 14 bezeichneten, abgeschlossenen
Grundstucksteil
• Nutzungstyp: Garden
• Gebäudezugehörigkeit: Außenanlage Haus A
• Lage: Erdgeschoss / Außenbererch
• Größe: ca 40,00 m
• Zimmer: -
• Baujahr: 2023
Beschreibung: Private Gartenparzelle zur Erholungsnutzung (Hobbygarten), rechtlich
verselbststandigt
`;

interface FolderSelectionProps {
  onPDFPageRead: (data: {
    filename: string;
    page: number;
    content: string;
  }) => void;
  llmWorker: Worker | null;
}

export function FolderSelection({ onPDFPageRead, llmWorker }: FolderSelectionProps) {
  useEffect(() => {
    if (!llmWorker) return;

    const handleMessage = (event: MessageEvent) => {
      const { type, data } = event.data;

      if (type === "stream") {
        console.log("LLM Stream:", data);
      } else if (type === "complete") {
        console.log("LLM Complete Response:", data);
      } else if (type === "error") {
        console.error("LLM Error:", data);
      }
    };

    llmWorker.addEventListener("message", handleMessage);

    return () => {
      llmWorker.removeEventListener("message", handleMessage);
    };
  }, [llmWorker]);

  const processWithLLM = async () => {
    if (!llmWorker) {
      console.error("LLM worker not available");
      return;
    }

    try {
      console.log("Sending request to LLM worker...");

      const messages = [
        {
          role: "user",
          content: "What is 2+2?",
        },
      ];

      llmWorker.postMessage({
        type: "generate",
        data: {
          messages,
          max_new_tokens: 50,
        },
      });
    } catch (error) {
      console.error("Error processing with LLM:", error);
    }
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

      // Process each page asynchronously
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
      }
    } catch (error) {
      console.error(`Error processing PDF ${file.name}:`, error);
    }
  };

  const handleSelectFolder = async () => {
    // First, process TEXT_EXAMPLE with LLM
    await processWithLLM();

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
