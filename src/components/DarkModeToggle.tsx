import { Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { useApp } from '../contexts/AppContext';

export default function DarkModeToggle() {
  const { darkMode, setDarkMode } = useApp();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setDarkMode(!darkMode)}
      className="relative overflow-hidden"
    >
      <motion.div
        initial={false}
        animate={{
          scale: darkMode ? 0 : 1,
          rotate: darkMode ? 180 : 0,
        }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Sun className="w-4 h-4" />
      </motion.div>
      
      <motion.div
        initial={false}
        animate={{
          scale: darkMode ? 1 : 0,
          rotate: darkMode ? 0 : -180,
        }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Moon className="w-4 h-4" />
      </motion.div>
    </Button>
  );
}