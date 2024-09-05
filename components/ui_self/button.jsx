import { motion } from 'framer-motion';

const LinkButton = ({ children, href }) => {
  // Bestimme, ob es ein externer Link ist
  const isExternal = href.startsWith('http://') || href.startsWith('https://');

  return (
    <motion.a
      href={href}
      target={isExternal ? '_blank' : '_self'} // Externe Links in neuem Tab öffnen
      rel={isExternal ? 'noopener noreferrer' : undefined} // Sicherheitsmaßnahme für externe Links
      className="inline-flex items-center justify-center text-center font-bold uppercase no-underline cursor-pointer shadow-md rounded-md relative overflow-hidden border-5 border-solid
                 border-yellow-700 transition-transform duration-300 ease-in-out transform hover:scale-105"
      style={{
        padding: '2px 2px',
        height: '111px',
        width: '450px', // Feste Breite
        maxWidth: '100%', // Button passt sich an den Bildschirm an
        fontSize: '18px',
        fontFamily: '"Arial", sans-serif',
        background: 'linear-gradient(45deg, #8f6b29, #fde08d, #df9f28)', // Goldener Verlauf
        color: '#664d1e',
        transition: 'background 0.3s ease, transform 0.3s ease',
        boxSizing: 'border-box',
      }}
      whileHover={{
        background: 'linear-gradient(45deg, #df9f28, #fde08d, #8f6b29)', // Umgekehrter Verlauf bei Hover
        scale: 1.05,
      }}
    >
      {children}

      <motion.span
        className="absolute top-0 left-1/2 w-[200%] h-[200%] bg-white/20 rounded-full"
        initial={{ scale: 0, x: '-50%', y: '-75%' }}
        whileHover={{ scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      />
    </motion.a>
  );
};

export default LinkButton;
