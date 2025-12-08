"use client";
import { useState, useEffect } from "react";
import { DIRECTUS_URL, MODELS } from "../lib/config";
import LinkButton from "../components/ui_self/button";
import Spinner from "../components/ui/spinner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Header from "../components/ui_self/header";
import { BackgroundBeams } from "@/components/ui/background-beams";

// Importiere die Typdefinitionen
import {
  HeaderMessageData,
  WelcomeMessageData,
  LinkData,
} from "../types/directus";

export default function HomePage() {
  const [header, setHeader] = useState<HeaderMessageData | null>(null);
  const [welcome, setWelcome] = useState<WelcomeMessageData | null>(null);
  const [links, setLinks] = useState<LinkData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Parallele API-Aufrufe für bessere Performance
        const [headerResponse, welcomeResponse, linksResponse] = await Promise.all([
          fetch(`${DIRECTUS_URL}/items/${MODELS.HEADER}`),
          fetch(`${DIRECTUS_URL}/items/${MODELS.WELCOME}`),
          fetch(`${DIRECTUS_URL}/items/${MODELS.LINKS}`),
        ]);

        // Response Validierung
        if (!headerResponse.ok || !welcomeResponse.ok || !linksResponse.ok) {
          throw new Error('Failed to fetch data from server');
        }

        const [headerData, welcomeData, linksData] = await Promise.all([
          headerResponse.json(),
          welcomeResponse.json(),
          linksResponse.json(),
        ]);

        setHeader(headerData.data[0] as HeaderMessageData);
        setWelcome(welcomeData.data[0] as WelcomeMessageData);
        setLinks(linksData.data as LinkData[]);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Fehler beim Laden der Daten. Bitte Seite neu laden.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  if (error) {
    return <div className="errormessage">{error}</div>;
  }

  if (loading || !header || links.length === 0) {
    return <Spinner />;
  }

  return (
    <div className="video relative min-h-90vh w-full overflow-auto bg-gray-800">
      
      {/* Content */}
      <div className="m relative z-20 flex h-full flex-col items-center justify-center">
        <Header title={header.ueberschrift} />

        {welcome && (
          <h2 className="mt-8 text-center text-lg text-gray-200 md:text-3xl">
            {welcome.welcome}
          </h2>
        )}
        <div className="b mt-4">
          {links.map((link) => (
            <motion.div
              key={link.id || link.url}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-4"
            >
                <LinkButton href={link.url}>{link.title}</LinkButton>
            </motion.div>
          ))}
        </div>
      </div>
      <BackgroundBeams />
    </div>
  );
}
