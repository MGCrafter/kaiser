import { motion } from 'framer-motion';

const LinkButton = ({ children, href }) => {
  return (
    <motion.a
      href={href}
      className="inline-flex items-center justify-center text-center font-bold uppercase no-underline cursor-pointer shadow-md
                 rounded-md relative overflow-hidden border-solid"
      style={{
        padding: '2px 2px',
        height: '111px',
        width: '450px', // Feste Breite
        maxWidth: '100%', // Damit der Button auf kleineren Bildschirmen nicht über den Rand hinausgeht
        fontSize: '18px',
        fontFamily: '"Arial", sans-serif',
        background: 'linear-gradient(45deg, #8f6b29, #fde08d, #df9f28)', // Goldener Verlauf
        color: '#664d1e',
        borderColor: '#8f6B29',
        borderWidth: '5px',
        transition: 'background 0.3s ease, transform 0.3s ease',
        boxSizing: 'border-box', // Box-Model-Anpassung, damit der Button gut skaliert
      }}
      whileHover={{
        background: 'linear-gradient(45deg, #df9f28, #fde08d, #8f6b29)', // Umgekehrter Verlauf bei Hover
        scale: 1.05,
      }}
    >
      {children}
      <motion.span
        className="absolute top-0 left-1/2 w-[200%] h-[200%] bg-radial-gradient-circle from-white/20 to-transparent"
        initial={{ scale: 0, x: '-50%', y: '-75%' }}
        whileHover={{ scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      />
    </motion.a>
  );
};

export default LinkButton;
