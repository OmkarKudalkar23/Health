import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Volume2, VolumeX, MessageCircle, Calendar, Pill, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { useApp } from '../contexts/AppContext';
import { toast } from 'sonner@2.0.3';

export default function VoiceAssistant() {
  const { language, user } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Quick action suggestions
  const quickActions = [
    {
      icon: <Pill className="w-4 h-4" />,
      label: language === 'hi' ? 'अगली दवा' : 'Next Medication',
      action: () => handleQuickAction('medication')
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      label: language === 'hi' ? 'डॉक्टर बुक करें' : 'Book Doctor',
      action: () => handleQuickAction('book')
    },
    {
      icon: <FileText className="w-4 h-4" />,
      label: language === 'hi' ? 'सरकारी योजना' : 'Gov Scheme',
      action: () => handleQuickAction('scheme')
    }
  ];

  const handleQuickAction = (action: string) => {
    setIsProcessing(true);
    
    setTimeout(() => {
      let responseText = '';
      
      switch (action) {
        case 'medication':
          responseText = language === 'hi' 
            ? 'आपकी अगली दवा मेटफॉर्मिन 2 घंटे में लेनी है।'
            : 'Your next medication is Metformin in 2 hours.';
          break;
        case 'book':
          responseText = language === 'hi'
            ? 'डॉक्टर अपॉइंटमेंट बुकिंग खोली जा रही है।'
            : 'Opening doctor appointment booking.';
          break;
        case 'scheme':
          responseText = language === 'hi'
            ? 'आपके लिए 3 सरकारी योजनाएं उपलब्ध हैं।'
            : 'You have 3 government schemes available.';
          break;
      }
      
      setResponse(responseText);
      setIsProcessing(false);
      
      if (voiceEnabled) {
        speakText(responseText);
      }
    }, 1000);
  };

  const startListening = () => {
    setIsListening(true);
    setIsExpanded(true);
    
    // Simulate voice recognition
    setTimeout(() => {
      const mockTranscripts = language === 'hi' 
        ? [
            'मेरा रक्तचाप कैसा है?',
            'अगली दवा कब लेनी है?',
            'डॉक्टर का अपॉइंटमेंट बुक करें',
            'मेरी रिपोर्ट दिखाएं'
          ]
        : [
            'How is my blood pressure?',
            'When is my next medication?',
            'Book a doctor appointment',
            'Show my health report'
          ];
      
      const randomTranscript = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
      setTranscript(randomTranscript);
      setIsListening(false);
      setIsProcessing(true);
      
      // Generate response
      setTimeout(() => {
        generateResponse(randomTranscript);
      }, 1500);
    }, 3000);
  };

  const generateResponse = (input: string) => {
    let responseText = '';
    
    if (language === 'hi') {
      if (input.includes('रक्तचाप')) {
        responseText = 'आपका रक्तचाप 120/80 है, जो सामान्य है।';
      } else if (input.includes('दवा')) {
        responseText = 'अगली दवा मेटफॉर्मिन शाम 6 बजे लेनी है।';
      } else if (input.includes('अपॉइंटमेंट')) {
        responseText = 'डॉक्टर अपॉइंटमेंट बुकिंग पेज खोला जा रहा है।';
      } else if (input.includes('रिपोर्ट')) {
        responseText = 'आपकी स्वास्थ्य रिपोर्ट सामान्य है। सभी विवरण डैशबोर्ड में देख सकते हैं।';
      } else {
        responseText = 'मैं आपकी मदद करने के लिए यहाँ हूँ। कृपया अपना प्रश्न दोहराएं।';
      }
    } else {
      if (input.includes('blood pressure')) {
        responseText = 'Your blood pressure is 120/80, which is normal.';
      } else if (input.includes('medication')) {
        responseText = 'Your next medication is Metformin at 6 PM today.';
      } else if (input.includes('appointment')) {
        responseText = 'Opening doctor appointment booking for you.';
      } else if (input.includes('report')) {
        responseText = 'Your health report looks good. You can view all details in your dashboard.';
      } else {
        responseText = 'I\'m here to help you. Please repeat your question.';
      }
    }
    
    setResponse(responseText);
    setIsProcessing(false);
    
    if (voiceEnabled) {
      speakText(responseText);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  const stopListening = () => {
    setIsListening(false);
  };

  return (
    <>
      {/* Floating Voice Button */}
      <motion.div
        className="fixed bottom-24 right-4 z-40 md:bottom-6"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          animate={isListening ? {
            boxShadow: [
              '0 0 0 0 rgba(59, 130, 246, 0.7)',
              '0 0 0 20px rgba(59, 130, 246, 0)',
              '0 0 0 0 rgba(59, 130, 246, 0)'
            ]
          } : {}}
          transition={{ duration: 1.5, repeat: isListening ? Infinity : 0 }}
        >
          <Button
            size="icon"
            className={`w-14 h-14 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 ${
              isListening ? 'bg-red-500 hover:bg-red-600' : ''
            }`}
            onClick={isListening ? stopListening : startListening}
          >
            {isListening ? (
              <MicOff className="w-6 h-6 text-white" />
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
          </Button>
        </motion.div>
      </motion.div>

      {/* Expanded Voice Interface */}
      <AnimatePresence>
        {isExpanded && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
              onClick={() => setIsExpanded(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-40 right-4 w-80 z-40 md:bottom-20"
            >
              <Card className="p-6 bg-white/95 backdrop-blur-md border-2 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">
                    {language === 'hi' ? 'आवाज सहायक' : 'Voice Assistant'}
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8"
                      onClick={() => setVoiceEnabled(!voiceEnabled)}
                    >
                      {voiceEnabled ? (
                        <Volume2 className="w-4 h-4" />
                      ) : (
                        <VolumeX className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8"
                      onClick={() => setIsExpanded(false)}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Status */}
                <div className="mb-4">
                  {isListening && (
                    <motion.div
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="flex items-center gap-2 text-blue-600"
                    >
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      <span className="text-sm">
                        {language === 'hi' ? 'सुन रहा हूँ...' : 'Listening...'}
                      </span>
                    </motion.div>
                  )}
                  
                  {isProcessing && (
                    <motion.div
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="flex items-center gap-2 text-orange-600"
                    >
                      <div className="w-2 h-2 bg-orange-600 rounded-full" />
                      <span className="text-sm">
                        {language === 'hi' ? 'प्रक्रिया में...' : 'Processing...'}
                      </span>
                    </motion.div>
                  )}
                </div>

                {/* Transcript */}
                {transcript && (
                  <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm font-medium mb-1">
                      {language === 'hi' ? 'आपने कहा:' : 'You said:'}
                    </p>
                    <p className="text-sm text-muted-foreground">"{transcript}"</p>
                  </div>
                )}

                {/* Response */}
                {response && (
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <p className="text-sm font-medium mb-1">
                      {language === 'hi' ? 'सहायक:' : 'Assistant:'}
                    </p>
                    <p className="text-sm">{response}</p>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    {language === 'hi' ? 'त्वरित कार्य:' : 'Quick Actions:'}
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="justify-start gap-2"
                        onClick={action.action}
                        disabled={isProcessing}
                      >
                        {action.icon}
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Language Support Badge */}
                <div className="flex gap-1 mt-4">
                  <Badge variant="secondary" className="text-xs">
                    {language === 'hi' ? 'हिंदी' : 'English'}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {language === 'hi' ? 'मराठी' : 'Marathi'}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Voice
                  </Badge>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}