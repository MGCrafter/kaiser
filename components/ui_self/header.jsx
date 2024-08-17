import { motion } from 'framer-motion';

const Header = ({ title }) => {
  return (
    <header className="pt-12">
      <motion.h1
        className="text-center font-bold uppercase"
        style={{
          background: 'linear-gradient(45deg, #8f6b29, #fde08d, #df9f28)', // Goldener Verlauf
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '50px',
          fontFamily: '"Arial", sans-serif',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {title}
      </motion.h1>
    </header>
  );
};

export default Header;
