"use client";
import { useState, useEffect } from "react";
import { DIRECTUS_URL, MODELS } from "@/lib/config.js";
import Spinner from "@/components/ui/spinner";
import Header from "@/components/ui_self/header";
import { BackgroundBeams } from "@/components/ui/background-beams";

// Importiere die Typdefinitionen
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
          `${DIRECTUS_URL}/items/${MODELS.IMPRESSUM}`,
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
    <div className="video relative min-h-90vh w-full overflow-auto bg-gray-950">
      <div className="m relative z-20 flex h-full flex-col items-center justify-center">
        <Header title={header.ueberschrift} />
        <div className="m-6 text-center text-white">
          {/*Impressum*/}
          {impressum && 
            
            impressum?.content_blocks?.blocks?.length > 0 ? (
              impressum.content_blocks.blocks.map((block, index) => (
                <div key={index} className="block-editor-content mt-4">
                  {block.type === 'paragraph' && <p className="text-2xl">{block.data.text}</p>}
                  {block.type === 'header' && <h2 className="text-5xl">{block.data.text}</h2>}
                  {/* Weitere Blocktypen können hier hinzugefügt werden, falls erforderlich */}
                </div>
            ))): null}
        </div>
      </div>
      <BackgroundBeams />
    </div>
  );
}
