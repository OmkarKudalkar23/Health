import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { 
  MessageCircle, 
  Send, 
  Phone, 
  Video, 
  Paperclip, 
  Smile,
  MoreVertical,
  CheckCheck,
  Clock
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'text' | 'image' | 'file';
  attachments?: string[];
}

interface ChatContact {
  id: string;
  name: string;
  role: 'doctor' | 'asha' | 'family';
  avatar: string;
  online: boolean;
  lastSeen?: Date;
  specialty?: string;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactId?: string;
}

const mockContacts: ChatContact[] = [
  {
    id: 'dr-kumar',
    name: 'Dr. Rajesh Kumar',
    role: 'doctor',
    avatar: '👨‍⚕️',
    online: true,
    specialty: 'Cardiologist'
  },
  {
    id: 'dr-priya',
    name: 'Dr. Priya Sharma',
    role: 'doctor',
    avatar: '👩‍⚕️',
    online: false,
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
    specialty: 'Endocrinologist'
  },
  {
    id: 'asha-worker',
    name: 'Meera ASHA',
    role: 'asha',
    avatar: '👩‍⚕️',
    online: true
  }
];

export default function ChatModal({ isOpen, onClose, contactId = 'dr-kumar' }: ChatModalProps) {
  const { language, user } = useApp();
  const [selectedContact, setSelectedContact] = useState(contactId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentContact = mockContacts.find(c => c.id === selectedContact) || mockContacts[0];

  // Mock messages
  useEffect(() => {
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        senderId: selectedContact,
        senderName: currentContact.name,
        senderAvatar: currentContact.avatar,
        message: language === 'hi' 
          ? 'नमस्ते! आपकी माँ की स्थिति के बारे में चर्चा करते हैं।'
          : 'Hello! Let\'s discuss your mother\'s condition.',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        read: true,
        type: 'text'
      },
      {
        id: '2',
        senderId: 'user',
        senderName: user?.name || 'You',
        senderAvatar: '👤',
        message: language === 'hi'
          ? 'धन्यवाद डॉक्टर। उनका रक्तचाप आज सुबह 145/85 था।'
          : 'Thank you doctor. Her blood pressure was 145/85 this morning.',
        timestamp: new Date(Date.now() - 55 * 60 * 1000),
        read: true,
        type: 'text'
      },
      {
        id: '3',
        senderId: selectedContact,
        senderName: currentContact.name,
        senderAvatar: currentContact.avatar,
        message: language === 'hi'
          ? 'यह थोड़ा अधिक है। क्या उन्होंने आज सुबह की दवा ली थी?'
          : 'That\'s slightly elevated. Did she take her morning medication?',
        timestamp: new Date(Date.now() - 50 * 60 * 1000),
        read: true,
        type: 'text'
      },
      {
        id: '4',
        senderId: 'user',
        senderName: user?.name || 'You',
        senderAvatar: '👤',
        message: language === 'hi'
          ? 'हाँ, लेकिन शायद 1 घंटे देर से।'
          : 'Yes, but maybe 1 hour late.',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        read: true,
        type: 'text'
      },
      {
        id: '5',
        senderId: selectedContact,
        senderName: currentContact.name,
        senderAvatar: currentContact.avatar,
        message: language === 'hi'
          ? 'समझ गया। कृपया दवा का समय नियमित रखें। अगर समस्या बनी रहे तो मुझसे संपर्क करें।'
          : 'I see. Please maintain regular medication timing. Contact me if the issue persists.',
        timestamp: new Date(Date.now() - 40 * 60 * 1000),
        read: false,
        type: 'text'
      }
    ];

    setMessages(mockMessages);
  }, [selectedContact, language, currentContact, user]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'user',
      senderName: user?.name || 'You',
      senderAvatar: '👤',
      message: newMessage,
      timestamp: new Date(),
      read: false,
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate typing indicator and response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      
      const response: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: selectedContact,
        senderName: currentContact.name,
        senderAvatar: currentContact.avatar,
        message: language === 'hi' 
          ? 'धन्यवाद जानकारी के लिए। मैं इस पर गौर करूंगा।'
          : 'Thank you for the information. I\'ll review this.',
        timestamp: new Date(),
        read: false,
        type: 'text'
      };
      
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getContactStatusText = (contact: ChatContact) => {
    if (contact.online) {
      return language === 'hi' ? 'ऑनलाइन' : 'Online';
    }
    if (contact.lastSeen) {
      const hours = Math.floor((Date.now() - contact.lastSeen.getTime()) / (1000 * 60 * 60));
      return language === 'hi' ? `${hours} घंटे पहले देखा` : `Last seen ${hours}h ago`;
    }
    return language === 'hi' ? 'ऑफलाइन' : 'Offline';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-0">
        <div className="flex h-full">
          {/* Contacts Sidebar */}
          <div className="w-80 border-r flex flex-col">
            <DialogHeader className="p-4 border-b">
              <DialogTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                {language === 'hi' ? 'चैट' : 'Chat'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto">
              {mockContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`p-4 border-b cursor-pointer transition-colors hover:bg-accent/50 ${
                    contact.id === selectedContact ? 'bg-accent' : ''
                  }`}
                  onClick={() => setSelectedContact(contact.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="text-2xl">{contact.avatar}</div>
                      {contact.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{contact.name}</h4>
                      {contact.specialty && (
                        <p className="text-xs text-muted-foreground">{contact.specialty}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {getContactStatusText(contact)}
                      </p>
                    </div>
                    
                    <Badge variant={contact.role === 'doctor' ? 'default' : 'secondary'}>
                      {contact.role}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="text-2xl">{currentContact.avatar}</div>
                    {currentContact.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-medium">{currentContact.name}</h3>
                    {currentContact.specialty && (
                      <p className="text-sm text-muted-foreground">{currentContact.specialty}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {getContactStatusText(currentContact)}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => {
                const isUser = message.senderId === 'user';
                
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-2 max-w-xs ${isUser ? 'flex-row-reverse' : ''}`}>
                      <div className="text-lg">{message.senderAvatar}</div>
                      
                      <div className={`p-3 rounded-lg ${
                        isUser 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm">{message.message}</p>
                        <div className={`flex items-center gap-1 mt-1 text-xs ${
                          isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                          <span>{formatTime(message.timestamp)}</span>
                          {isUser && (
                            message.read 
                              ? <CheckCheck className="w-3 h-3" />
                              : <Clock className="w-3 h-3" />
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              
              {/* Typing Indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex justify-start"
                  >
                    <div className="flex gap-2 max-w-xs">
                      <div className="text-lg">{currentContact.avatar}</div>
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex gap-1">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                            className="w-2 h-2 bg-gray-400 rounded-full"
                          />
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                            className="w-2 h-2 bg-gray-400 rounded-full"
                          />
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                            className="w-2 h-2 bg-gray-400 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Paperclip className="w-4 h-4" />
                </Button>
                
                <div className="flex-1 relative">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={language === 'hi' ? 'संदेश टाइप करें...' : 'Type a message...'}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        sendMessage();
                      }
                    }}
                  />
                </div>
                
                <Button variant="outline" size="icon">
                  <Smile className="w-4 h-4" />
                </Button>
                
                <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}