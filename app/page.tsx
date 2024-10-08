"use client";
import { useState, useEffect } from "react";
import { DIRECTUS_URL, MODELS } from "../lib/config.js";
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
      console.log("Fetching data from Directus...");
      try {
        const response = await fetch(`${DIRECTUS_URL}/items/${MODELS.HEADER}`);
        const response1 = await fetch(
          `${DIRECTUS_URL}/items/${MODELS.WELCOME}`,
        );
        const response2 = await fetch(`${DIRECTUS_URL}/items/${MODELS.LINKS}`);

        const data = await response.json();
        const data1 = await response1.json();
        const data2 = await response2.json();

        console.log("Data fetched successfully:", data);
        setHeader(data.data[0] as HeaderMessageData);
        setWelcome(data1.data[0] as WelcomeMessageData);
        setLinks(data2.data as LinkData[]);
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
          {links.map((link, index) => (
            <motion.div
              key={index}
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
