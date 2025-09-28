import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { healthcareService } from '../services/healthcareService';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'family' | 'doctor' | 'asha';
  language: 'en' | 'hi' | 'mr';
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  nextDose: Date;
  adherence: number;
  pillCount: number;
  notes?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface VitalSigns {
  bloodPressure: { systolic: number; diastolic: number; date: Date };
  heartRate: { value: number; date: Date };
  bloodSugar: { value: number; date: Date };
  weight: { value: number; date: Date };
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  language: 'en' | 'hi' | 'mr';
  setLanguage: (lang: 'en' | 'hi' | 'mr') => void;
  medications: Medication[];
  setMedications: (medications: Medication[]) => void;
  vitals: VitalSigns[];
  setVitals: (vitals: VitalSigns[]) => void;
  notifications: any[];
  setNotifications: (notifications: any[]) => void;
  isLoading: boolean;
  refreshData: () => Promise<void>;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  currentPatient: string | null;
  setCurrentPatient: (patientId: string | null) => void;
  reminderFrequency: 'immediate' | '10min' | 'hourly' | 'daily';
  setReminderFrequency: (freq: 'immediate' | '10min' | 'hourly' | 'daily') => void;
  lowConnectivityMode: boolean;
  setLowConnectivityMode: (enabled: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { i18n } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<'en' | 'hi' | 'mr'>('en');
  const [medications, setMedications] = useState<Medication[]>([]);
  const [vitals, setVitals] = useState<VitalSigns[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<string | null>(null);
  const [reminderFrequency, setReminderFrequency] = useState<'immediate' | '10min' | 'hourly' | 'daily'>('hourly');
  const [lowConnectivityMode, setLowConnectivityMode] = useState(false);

  // Initialize app with session data
  useEffect(() => {
    initializeApp();
  }, []);

  // Initialize language from localStorage or i18n
  useEffect(() => {
    const savedLanguage = localStorage.getItem('healthcare-language') as 'en' | 'hi' | 'mr' | null;
    if (savedLanguage && ['en', 'hi', 'mr'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
      i18n.changeLanguage(savedLanguage);
    } else {
      // Set default language based on browser preference
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'hi' || browserLang === 'mr') {
        setLanguage(browserLang as 'hi' | 'mr');
        i18n.changeLanguage(browserLang);
      }
    }
  }, [i18n]);

  const initializeApp = async () => {
    try {
      const session = await healthcareService.getSession();
      
      if (session?.user) {
        // Set user from session
        const sessionUser = session.user;
        setUser({
          id: sessionUser.id,
          name: sessionUser.name || sessionUser.user_metadata?.name || 'Demo User',
          email: sessionUser.email,
          role: sessionUser.role || sessionUser.user_metadata?.role || 'patient',
          language: sessionUser.language || sessionUser.user_metadata?.language || 'en'
        });
        setLanguage(sessionUser.language || sessionUser.user_metadata?.language || 'en');
        
        // Try to get profile, but don't fail if backend is unavailable
        try {
          const { profile } = await healthcareService.getProfile();
          if (profile && !profile.demo) {
            setUser({
              id: profile.id,
              name: profile.name,
              email: profile.email,
              role: profile.role,
              language: profile.language || 'en'
            });
            setLanguage(profile.language || 'en');
          }
        } catch (error) {
          console.warn('Failed to load user profile from backend, using session data:', error);
        }
        
        // Load user data
        await refreshData();
      } else {
        // No session, use mock data for demo
        loadMockData();
      }
    } catch (error) {
      console.error('Failed to initialize app:', error);
      loadMockData();
    } finally {
      setIsLoading(false);
    }
  };

  const loadMockData = () => {
    // Fallback to mock data for demo purposes
    setMedications([
      {
        id: '1',
        name: 'Metformin 500mg',
        dosage: '1 tablet',
        frequency: 'Twice daily',
        nextDose: new Date(Date.now() + 2 * 60 * 60 * 1000),
        adherence: 85,
        pillCount: 28,
        userId: 'demo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Lisinopril 10mg',
        dosage: '1 tablet',
        frequency: 'Once daily',
        nextDose: new Date(Date.now() + 8 * 60 * 60 * 1000),
        adherence: 92,
        pillCount: 25,
        userId: 'demo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]);

    setVitals([
      {
        bloodPressure: { systolic: 120, diastolic: 80, date: new Date() },
        heartRate: { value: 72, date: new Date() },
        bloodSugar: { value: 95, date: new Date() },
        weight: { value: 70, date: new Date() }
      }
    ]);

    setNotifications([
      {
        id: '1',
        type: 'reminder',
        title: 'Medication Due',
        message: 'Time to take your Metformin',
        timestamp: new Date(),
        read: false
      },
      {
        id: '2',
        type: 'alert',
        title: 'High Blood Pressure',
        message: 'Your blood pressure reading is above normal',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        read: false
      }
    ]);
  };

  const refreshData = async () => {
    try {
      // Load medications
      const { medications: userMedications } = await healthcareService.getMedications();
      if (userMedications) {
        setMedications(userMedications.map((med: any) => ({
          ...med,
          nextDose: new Date(med.nextDose)
        })));
      }

      // Load notifications (with fallback)
      try {
        const { notifications: userNotifications } = await healthcareService.getNotifications();
        if (userNotifications) {
          setNotifications(userNotifications.map((notif: any) => ({
            ...notif,
            timestamp: new Date(notif.createdAt || notif.timestamp)
          })));
        }
      } catch (error) {
        console.warn('Failed to load notifications:', error);
        // Use default notifications if backend fails
        setNotifications([
          {
            id: '1',
            type: 'reminder',
            title: 'Medication Due',
            message: 'Time to take your Metformin',
            timestamp: new Date(),
            read: false
          }
        ]);
      }

      // Load health data would go here
      // const { healthData } = await healthcareService.getHealthData();
      
    } catch (error) {
      console.warn('Failed to refresh data, using local/demo data:', error);
      // Don't clear existing data on error, just log it
    }
  };

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSetLanguage = (lang: 'en' | 'hi' | 'mr') => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('healthcare-language', lang);
  };

  const value = {
    user,
    setUser,
    language,
    setLanguage: handleSetLanguage,
    medications,
    setMedications,
    vitals,
    setVitals,
    notifications,
    setNotifications,
    isLoading,
    refreshData,
    darkMode,
    setDarkMode,
    currentPatient,
    setCurrentPatient,
    reminderFrequency,
    setReminderFrequency,
    lowConnectivityMode,
    setLowConnectivityMode
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};