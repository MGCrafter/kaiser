"use client";
import { useState, useEffect } from "react";
import { DIRECTUS_URL, MODELS } from "@/lib/config";
import Spinner from "@/components/ui/spinner";
import Header from "@/components/ui_self/header";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { HeaderMessageData, impressumData, BlockEditorData } from "@/types/directus";

export default function HomePage() {
  const [header, setHeader] = useState<HeaderMessageData | null>(null);
  const [impressum, setImpressum] = useState<impressumData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Parallele API-Aufrufe für bessere Performance
        const [headerResponse, impressumResponse] = await Promise.all([
          fetch(`${DIRECTUS_URL}/items/${MODELS.HEADER}`),
          fetch(`${DIRECTUS_URL}/items/${MODELS.IMPRESSUM}`),
        ]);

        // Response Validierung
        if (!headerResponse.ok || !impressumResponse.ok) {
          throw new Error('Failed to fetch data from server');
        }

        const [headerData, impressumData] = await Promise.all([
          headerResponse.json(),
          impressumResponse.json(),
        ]);

        setHeader(headerData.data[0] as HeaderMessageData);
        setImpressum(impressumData.data[0] as impressumData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Fehler beim Laden des Impressums. Bitte Seite neu laden.");
      } finally {
        setLoading(false);
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
            impressum.content_blocks.blocks.map((block) => (
              <div
                key={block.id}
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
function renderBlockContent(block: BlockEditorData) {
  if (!block?.data) return null;

  switch (block.type) {
    case "paragraph":
      return (
        <p className="text-lg leading-relaxed break-words whitespace-normal">
          {block.data.text}
        </p>
      );
    case "header":
      return renderHeader(block);
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
      return null;
  }
}

// Funktion zum Rendern von Headern, basierend auf der Header-Level
function renderHeader(block: BlockEditorData) {
  if (!block?.data?.text) return null;

  const level = (block.data as any).level;

  switch (level) {
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
      );
  }
}
