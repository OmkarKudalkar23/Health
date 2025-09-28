import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Languages, 
  Globe, 
  Check,
  ChevronDown
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../contexts/AppContext';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', nativeName: 'हिंदी' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳', nativeName: 'मराठी' }
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { language, setLanguage } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (langCode: 'en' | 'hi' | 'mr') => {
    i18n.changeLanguage(langCode);
    setLanguage(langCode);
    setIsOpen(false);
    
    // Save to localStorage
    localStorage.setItem('healthcare-language', langCode);
  };

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{currentLanguage.nativeName}</span>
        <span className="sm:hidden">{currentLanguage.flag}</span>
        <ChevronDown className="w-3 h-3" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Language Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full right-0 mt-2 z-50"
            >
              <Card className="w-48 p-2 shadow-lg border">
                <div className="space-y-1">
                  {languages.map((lang) => (
                    <Button
                      key={lang.code}
                      variant={language === lang.code ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => handleLanguageChange(lang.code as 'en' | 'hi' | 'mr')}
                      className="w-full justify-start gap-3 h-auto py-2"
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <div className="flex-1 text-left">
                        <div className="font-medium">{lang.nativeName}</div>
                        <div className="text-xs text-muted-foreground">{lang.name}</div>
                      </div>
                      {language === lang.code && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </Button>
                  ))}
                </div>
                
                <div className="mt-2 pt-2 border-t">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Languages className="w-3 h-3" />
                    <span>Multilingual Support</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

