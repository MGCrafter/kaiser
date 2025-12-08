"use client";
import { useState, useEffect } from "react";
import { DIRECTUS_URL, MODELS } from "@/lib/config";
import Spinner from "@/components/ui/spinner";
import Header from "@/components/ui_self/header";
import { ParallaxScroll } from "@/components/ui/parallax-scroll";
import { BackgroundBeams } from "@/components/ui/background-beams";

// Importiere die Typdefinitionen
import { HeaderMessageData, BildergalerieData } from "@/types/directus";

export default function HomePage() {
  const [header, setHeader] = useState<HeaderMessageData | null>(null);
  const [bildergalerie, setBildergalerie] = useState<BildergalerieData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Parallele API-Aufrufe für bessere Performance
        const [headerResponse, galerieResponse] = await Promise.all([
          fetch(`${DIRECTUS_URL}/items/${MODELS.HEADER}`),
          fetch(`${DIRECTUS_URL}/items/${MODELS.BILDERGALERIE}`),
        ]);

        // Response Validierung
        if (!headerResponse.ok || !galerieResponse.ok) {
          throw new Error('Failed to fetch data from server');
        }

        const [headerData, galerieData] = await Promise.all([
          headerResponse.json(),
          galerieResponse.json(),
        ]);

        setHeader(headerData.data[0] as HeaderMessageData);
        setBildergalerie(galerieData.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Fehler beim Laden der Bildergalerie. Bitte Seite neu laden.");
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

  const images = bildergalerie.map(
    (bild) => `https://ik.imagekit.io/4pnuuwrtm/${DIRECTUS_URL}/assets/${bild.picture}`,
  );

  return (
    <div className="video relative min-h-90vh w-full overflow-auto bg-gray-900">
      <div className="m relative z-20 flex h-full flex-col items-center justify-center">
        <Header title={header.ueberschrift} />
        <ParallaxScroll images={images} />
      </div>

      <BackgroundBeams />
    </div>
  );
}
