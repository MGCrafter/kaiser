"use client";
import { useState, useEffect } from "react";
import { DIRECTUS_URL, MODELS } from "@/lib/config.js";
import Spinner from "@/components/ui/spinner";
import Header from "@/components/ui_self/header";
import { ParallaxScroll } from "@/components/ui/parallax-scroll";
import { BackgroundBeams } from "@/components/ui/background-beams";
//import Modal from "@/components/ui_self/modal";

// Importiere die Typdefinitionen
import { HeaderMessageData, bieldergalerieData } from "@/types/directus";

export default function HomePage() {
  const [header, setHeader] = useState<HeaderMessageData | null>(null);
  const [bildergalerie, setBildergalerie] = useState<bieldergalerieData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    // Setze overflow: hidden auf dem <body>
    document.body.style.overflow = "hidden";

    // Bereinige den Effekt, wenn die Komponente entladen wird
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  useEffect(() => {
    async function fetchData() {
      console.log("Fetching data from Directus...");
      try {
        const response = await fetch(`${DIRECTUS_URL}/items/${MODELS.HEADER}`);
        const response1 = await fetch(
          `${DIRECTUS_URL}/items/${MODELS.BILDERGALERIE}`,
        );

        const data = await response.json();
        const galerieData = await response1.json();

        console.log("Data fetched successfully:", data, galerieData);
        setHeader(data.data[0] as HeaderMessageData);
        setBildergalerie(galerieData.data);
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

  /*const images = bildergalerie.map(
    (bild) => `${DIRECTUS_URL}/assets/${bild.picture}`,
  );*/
  // Modal öffnen

  return (
    <div className="video relative min-h-90vh w-full overflow-auto bg-gray-950">
      <div className="m relative z-20 flex h-full flex-col items-center justify-center">
        <Header title={header.ueberschrift} />
        <ParallaxScroll images={images} />
      </div>
      
      <BackgroundBeams />
    </div>
  );
}
const images = [
    "https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
    "https://directus-1.nekozdevteam.eu/assets/4bb7fcc6-723d-46ed-8735-fc4d4d95f0e1"

];
