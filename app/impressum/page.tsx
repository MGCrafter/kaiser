"use client";
import { useState, useEffect } from "react";
import { DIRECTUS_URL, MODELS } from "@/lib/config.js";
import Spinner from "@/components/ui/spinner";
import Header from "@/components/ui_self/header";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { HeaderMessageData, impressumData } from "@/types/directus";

export default function HomePage() {
  const [header, setHeader] = useState<HeaderMessageData | null>(null);
  const [impressum, setImpressum] = useState<impressumData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      console.log("Fetching data from Directus...");
      try {
        const response = await fetch(`${DIRECTUS_URL}/items/${MODELS.HEADER}`);
        const response1 = await fetch(
          `${DIRECTUS_URL}/items/${MODELS.IMPRESSUM}`
        );

        const data = await response.json();
        const data1 = await response1.json();

        console.log("Data fetched successfully:", data, data1);
        setHeader(data.data[0] as HeaderMessageData);
        setImpressum(data1.data[0] as impressumData);
      } catch (err) {
        console.error("Error fetching global data:", err);
        setError("Error Fetching Data, try reloading the page");
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      }
    }
    fetchData();
  }, []);

  if (error) {
    return <div className="errormessage">{error}</div>;
  }

  if (loading || !header) {
    return <Spinner />;
  }

  return (
    <div className="relative min-h-screen w-full bg-gray-900">
      <div className="relative z-20 flex flex-col items-center justify-center py-10 px-4">
        <Header title={header.ueberschrift} />
        <div className="m-6 text-center text-white max-w-screen-md w-full px-4">
          {/* Impressum Rendering */}
          {impressum && impressum?.content_blocks?.blocks?.length > 0 ? (
            impressum.content_blocks.blocks.map((block, index) => (
              <div
                key={index}
                className="block-editor-content mt-4 w-full max-w-full mx-auto"
              >
                {renderBlockContent(block)}
              </div>
            ))
          ) : (
            <p>Keine Inhalte verfügbar.</p>
          )}
        </div>
      </div>
      <BackgroundBeams />
    </div>
  );
}

// Funktion zum Rendern des Inhalts basierend auf dem Block-Typ
function renderBlockContent(block?: any) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="text-lg leading-relaxed break-words whitespace-normal">
          {block.data.text}
        </p>
      );
    case "header":
      return renderHeader(block); // Separates Rendering für verschiedene Header-Level
    case "image":
      return (
        <img
          src={block.data.url}
          alt={block.data.alt || "Bild"}
          className="w-full max-w-md mx-auto"
        />
      );
    case "quote":
      return (
        <blockquote className="border-l-4 border-gray-500 pl-4 italic text-lg break-words whitespace-normal">
          {block.data.text}
        </blockquote>
      );
    default:
      return null; // Falls der Blocktyp nicht unterstützt wird, wird nichts gerendert.
  }
}

// Funktion zum Rendern von Headern, basierend auf der Header-Level
function renderHeader(block?: any) {
  switch (block.data.level) {
    case 1:
      return (
        <h1 className="text-4xl font-bold break-words whitespace-normal">
          {block.data.text}
        </h1>
      );
    case 2:
      return (
        <h2 className="text-3xl font-bold break-words whitespace-normal">
          {block.data.text}
        </h2>
      );
    case 3:
      return (
        <h3 className="text-2xl font-bold break-words whitespace-normal">
          {block.data.text}
        </h3>
      );
    default:
      return (
        <p className="text-lg break-words whitespace-normal">
          {block.data.text}
        </p>
      ); // Fallback zu einem Paragraphen für unbekannte Level
  }
}
