import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, Check, Clock, AlertTriangle, Heart, Users, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { useApp } from '../contexts/AppContext';
import { toast } from 'sonner@2.0.3';

interface Notification {
  id: string;
  type: 'reminder' | 'alert' | 'appointment' | 'family' | 'report' | 'emergency';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  urgent?: boolean;
  patientName?: string;
  actionRequired?: boolean;
}

export default function NotificationCenter() {
  const { notifications, setNotifications, user, language } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [notificationList, setNotificationList] = useState<Notification[]>([]);

  // Mock real-time notifications
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'reminder',
        title: language === 'hi' ? 'दवा का समय' : 'Medication Reminder',
        message: language === 'hi' ? 'मेटफॉर्मिन लेने का समय हो गया है' : 'Time to take your Metformin',
        timestamp: new Date(),
        read: false,
        urgent: true,
        actionRequired: true
      },
      {
        id: '2',
        type: 'alert',
        title: language === 'hi' ? 'उच्च रक्तचाप' : 'High Blood Pressure Alert',
        message: language === 'hi' ? 'आपका रक्तचाप सामान्य से अधिक है' : 'Your blood pressure reading is above normal range',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: false,
        urgent: true
      },
      {
        id: '3',
        type: 'appointment',
        title: language === 'hi' ? 'अपॉइंटमेंट पुष्टि' : 'Appointment Confirmed',
        message: language === 'hi' ? 'डॉ. शर्मा के साथ कल सुबह 10 बजे' : 'Tomorrow at 10:00 AM with Dr. Sharma',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        read: false
      },
      {
        id: '4',
        type: 'family',
        title: language === 'hi' ? 'पारिवारिक अलर्ट' : 'Family Alert',
        message: language === 'hi' ? 'माँ ने दवा छोड़ दी है' : 'Mother missed medication dose',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false,
        patientName: 'Mother',
        urgent: true
      },
      {
        id: '5',
        type: 'emergency',
        title: language === 'hi' ? 'आपातकालीन संपर्क' : 'Emergency Contact',
        message: language === 'hi' ? 'पिता का हृदय गति असामान्य' : 'Father\'s heart rate is irregular',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        read: true,
        patientName: 'Father',
        urgent: true
      },
      {
        id: '6',
        type: 'report',
        title: language === 'hi' ? 'रिपोर्ट तैयार' : 'Report Ready',
        message: language === 'hi' ? 'मासिक स्वास्थ्य रिपोर्ट उपलब्ध है' : 'Monthly health report is ready for download',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        read: true
      }
    ];

    setNotificationList(mockNotifications);
  }, [language]);

  // Auto-generate new notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every 30 seconds
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: Math.random() > 0.5 ? 'reminder' : 'alert',
          title: language === 'hi' ? 'नई सूचना' : 'New Alert',
          message: language === 'hi' ? 'स्वास्थ्य अपडेट उपलब्ध है' : 'Health update available',
          timestamp: new Date(),
          read: false,
          urgent: Math.random() > 0.7
        };

        setNotificationList(prev => [newNotification, ...prev]);
        
        // Show toast for urgent notifications
        if (newNotification.urgent) {
          toast.warning(newNotification.title, {
            description: newNotification.message,
            action: {
              label: language === 'hi' ? 'देखें' : 'View',
              onClick: () => setIsOpen(true)
            }
          });
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [language]);

  const unreadCount = notificationList.filter(n => !n.read).length;
  const urgentCount = notificationList.filter(n => !n.read && n.urgent).length;

  const markAsRead = (id: string) => {
    setNotificationList(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotificationList(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'reminder': return <Clock className="w-4 h-4" />;
      case 'alert': return <AlertTriangle className="w-4 h-4" />;
      case 'appointment': return <Clock className="w-4 h-4" />;
      case 'family': return <Users className="w-4 h-4" />;
      case 'emergency': return <Heart className="w-4 h-4" />;
      case 'report': return <FileText className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string, urgent?: boolean) => {
    if (urgent) return 'bg-red-500';
    switch (type) {
      case 'reminder': return 'bg-blue-500';
      case 'alert': return 'bg-orange-500';
      case 'appointment': return 'bg-green-500';
      case 'family': return 'bg-purple-500';
      case 'emergency': return 'bg-red-500';
      case 'report': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <>
      {/* Notification Bell */}
      <motion.div
        className="fixed top-4 right-4 z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="outline"
          size="icon"
          className="bg-white/80 backdrop-blur-sm border-2 shadow-lg relative"
          onClick={() => setIsOpen(true)}
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.div>
          )}
          {urgentCount > 0 && (
            <motion.div
              animate={{ 
                boxShadow: ['0 0 0 0 rgba(239, 68, 68, 0.7)', '0 0 0 10px rgba(239, 68, 68, 0)', '0 0 0 0 rgba(239, 68, 68, 0)']
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-md"
            />
          )}
        </Button>
      </motion.div>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">
                    {language === 'hi' ? 'सूचनाएं' : 'Notifications'}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      {unreadCount} {language === 'hi' ? 'अपठित' : 'unread'}
                    </Badge>
                    {urgentCount > 0 && (
                      <Badge variant="destructive">
                        {urgentCount} {language === 'hi' ? 'जरूरी' : 'urgent'}
                      </Badge>
                    )}
                  </div>
                  
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      {language === 'hi' ? 'सभी पढ़ें' : 'Mark all read'}
                    </Button>
                  )}
                </div>
              </div>

              {/* Notifications List */}
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-3">
                  {notificationList.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => markAsRead(notification.id)}
                      className="cursor-pointer"
                    >
                      <Card className={`p-4 transition-all hover:shadow-md ${
                        !notification.read ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800' : ''
                      } ${notification.urgent ? 'border-l-4 border-l-red-500' : ''}`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                            getTypeColor(notification.type, notification.urgent)
                          }`}>
                            {getIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-sm truncate">
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                              )}
                            </div>
                            
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {notification.timestamp.toLocaleTimeString(
                                  language === 'hi' ? 'hi-IN' : 'en-US',
                                  { hour: '2-digit', minute: '2-digit' }
                                )}
                              </span>
                              
                              {notification.patientName && (
                                <Badge variant="secondary" className="text-xs">
                                  {notification.patientName}
                                </Badge>
                              )}
                              
                              {notification.actionRequired && (
                                <Badge variant="outline" className="text-xs">
                                  {language === 'hi' ? 'कार्य आवश्यक' : 'Action Required'}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                  
                  {notificationList.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>{language === 'hi' ? 'कोई सूचना नहीं' : 'No notifications'}</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}