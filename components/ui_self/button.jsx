import { motion } from 'framer-motion';

const LinkButton = ({ children, href }) => {
  // Bestimme, ob es ein externer Link ist
  const isExternal = href.startsWith('http://') || href.startsWith('https://');

  return (
    <motion.a
      href={href}
      target={isExternal ? '_blank' : '_self'}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="inline-flex items-center justify-center text-center font-bold uppercase no-underline cursor-pointer shadow-md rounded-md relative overflow-hidden
                 border-5 border-solid border-yellow-700 transition-transform duration-300 ease-in-out transform hover:scale-105
                 h-[111px] w-[250px] max-w-full text-[18px] bg-gradient-to-r from-[#8f6b29] via-[#fde08d] to-[#df9f28] text-[#664d1e]
                 box-border  md:w-[460px]"
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
