import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-05eeb3cf`;

// Helper function to make authenticated requests
const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
  try {
    // Check if we're in demo mode first
    const isDemoMode = localStorage.getItem('healthcare_demo_user') !== null;
    if (isDemoMode && endpoint !== '/health') {
      console.log('Using demo mode for:', endpoint);
      return { demo: true, error: 'Demo mode active' };
    }

    const { data: { session } } = await supabase.auth.getSession();
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Always add anon key for public endpoints
    if (endpoint === '/auth/signup' || endpoint === '/health') {
      headers['Authorization'] = `Bearer ${publicAnonKey}`;
    } else if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    } else {
      // For authenticated endpoints without session, fail gracefully
      console.log('No session available, switching to demo mode');
      return { demo: true, error: 'No session available' };
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Don't log errors for expected demo mode scenarios
      if (response.status === 401 || response.status === 403) {
        console.log('Authentication failed, switching to demo mode');
        return { demo: true, error: 'Authentication failed' };
      }
      
      console.error(`API Error (${response.status}):`, errorData);
      return { demo: true, error: `HTTP error! status: ${response.status}` };
    }

    return response.json();
  } catch (error) {
    console.log('Request failed, using demo mode:', error.message);
    return { demo: true, error: 'Network unavailable' };
  }
};

export const healthcareService = {
  // Authentication
  async signUp(userData: {
    email: string;
    password: string;
    name: string;
    role: 'patient' | 'family' | 'doctor';
    phone: string;
    age: number;
  }) {
    // Always use demo mode for this prototype
    console.log('Creating demo user account:', userData.name);
    return this.createMockSession(userData);
    
    // Backend integration would go here in production:
    /*
    try {
      const result = await makeRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      
      if (result.demo) {
        return this.createMockSession(userData);
      }
      
      return result;
    } catch (error) {
      console.warn('Backend signup failed, using demo mode:', error);
      return this.createMockSession(userData);
    }
    */
  },

  async createMockSession(userData: any) {
    // Create a mock session for demo purposes
    const mockUser = {
      id: `demo-${Date.now()}`,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      phone: userData.phone,
      age: userData.age
    };

    // Store in localStorage for persistence
    localStorage.setItem('healthcare_demo_user', JSON.stringify(mockUser));
    localStorage.setItem('healthcare_demo_session', JSON.stringify({
      access_token: 'demo-token',
      user: mockUser
    }));

    return { user: mockUser };
  },

  async signIn(email: string, password: string) {
    // Check for existing demo user first
    const demoUser = localStorage.getItem('healthcare_demo_user');
    if (demoUser) {
      const user = JSON.parse(demoUser);
      console.log('Signing in demo user:', user.name);
      return {
        user,
        session: {
          access_token: 'demo-token',
          user
        }
      };
    }

    // Backend authentication would go here in production:
    /*
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
      return data;
    } catch (error) {
      console.warn('Backend signin failed:', error);
      throw error;
    }
    */
    
    // For demo, return error if no demo user exists
    throw new Error('No demo account found. Please complete onboarding first.');
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error && !error.message.includes('session')) {
        console.warn('Backend signout failed:', error);
      }
    } catch (error) {
      console.warn('Backend signout failed:', error);
    }
    
    // Always clear demo data
    localStorage.removeItem('healthcare_demo_user');
    localStorage.removeItem('healthcare_demo_session');
    localStorage.removeItem('healthcare_demo_medications');
    localStorage.removeItem('healthcare_demo_notifications');
  },

  async getSession() {
    // Always check for demo session first
    const demoSession = localStorage.getItem('healthcare_demo_session');
    if (demoSession) {
      return JSON.parse(demoSession);
    }

    // Backend session would go here in production:
    /*
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        return null;
      }
      
      return session;
    } catch (error) {
      console.warn('Failed to get session:', error);
      return null;
    }
    */
    
    return null;
  },

  // User Profile
  async getProfile() {
    // Always use demo profile
    const demoUser = localStorage.getItem('healthcare_demo_user');
    if (demoUser) {
      const user = JSON.parse(demoUser);
      return { profile: user };
    }
    
    return { demo: true, error: 'No demo profile found' };
  },

  async updateProfile(updates: any) {
    // Update demo profile
    const demoUser = localStorage.getItem('healthcare_demo_user');
    if (demoUser) {
      const user = JSON.parse(demoUser);
      const updatedUser = { ...user, ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem('healthcare_demo_user', JSON.stringify(updatedUser));
      
      // Also update session
      const demoSession = localStorage.getItem('healthcare_demo_session');
      if (demoSession) {
        const session = JSON.parse(demoSession);
        session.user = updatedUser;
        localStorage.setItem('healthcare_demo_session', JSON.stringify(session));
      }
      
      return { profile: updatedUser };
    }
    
    return { demo: true, error: 'No demo profile found' };
  },

  // Medications
  async getMedications() {
    try {
      const result = await makeRequest('/medications');
      if (result.demo) {
        return this.getDemoMedications();
      }
      return result;
    } catch (error) {
      console.warn('Backend medications failed, using demo data:', error);
      return this.getDemoMedications();
    }
  },

  getDemoMedications() {
    const stored = localStorage.getItem('healthcare_demo_medications');
    if (stored) {
      return JSON.parse(stored);
    }
    
    const demoMedications = {
      medications: [
        {
          id: '1',
          name: 'Metformin 500mg',
          dosage: '1 tablet',
          frequency: 'Twice daily',
          nextDose: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
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
          nextDose: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
          adherence: 92,
          pillCount: 25,
          userId: 'demo',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
    
    localStorage.setItem('healthcare_demo_medications', JSON.stringify(demoMedications));
    return demoMedications;
  },

  async addMedication(medication: {
    name: string;
    dosage: string;
    frequency: string;
    pillCount: number;
    nextDose: string;
    notes?: string;
  }) {
    try {
      const result = await makeRequest('/medications', {
        method: 'POST',
        body: JSON.stringify(medication),
      });
      
      if (result.demo) {
        return this.addDemoMedication(medication);
      }
      return result;
    } catch (error) {
      console.warn('Backend add medication failed, using demo mode:', error);
      return this.addDemoMedication(medication);
    }
  },

  addDemoMedication(medicationData: any) {
    const medications = this.getDemoMedications();
    const newMedication = {
      id: Date.now().toString(),
      ...medicationData,
      adherence: 100,
      userId: 'demo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    medications.medications.push(newMedication);
    localStorage.setItem('healthcare_demo_medications', JSON.stringify(medications));
    return { medication: newMedication };
  },

  async updateMedication(id: string, updates: any) {
    try {
      const result = await makeRequest(`/medications/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      
      if (result.demo) {
        return this.updateDemoMedication(id, updates);
      }
      return result;
    } catch (error) {
      console.warn('Backend update medication failed, using demo mode:', error);
      return this.updateDemoMedication(id, updates);
    }
  },

  updateDemoMedication(id: string, updates: any) {
    const medications = this.getDemoMedications();
    const index = medications.medications.findIndex((med: any) => med.id === id);
    
    if (index !== -1) {
      medications.medications[index] = {
        ...medications.medications[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('healthcare_demo_medications', JSON.stringify(medications));
      return { medication: medications.medications[index] };
    }
    
    throw new Error('Medication not found');
  },

  async deleteMedication(id: string) {
    try {
      const result = await makeRequest(`/medications/${id}`, {
        method: 'DELETE',
      });
      
      if (result.demo) {
        return this.deleteDemoMedication(id);
      }
      return result;
    } catch (error) {
      console.warn('Backend delete medication failed, using demo mode:', error);
      return this.deleteDemoMedication(id);
    }
  },

  deleteDemoMedication(id: string) {
    const medications = this.getDemoMedications();
    medications.medications = medications.medications.filter((med: any) => med.id !== id);
    localStorage.setItem('healthcare_demo_medications', JSON.stringify(medications));
    return { success: true };
  },

  async recordMedicationTaken(id: string, verificationData?: any) {
    try {
      const result = await makeRequest(`/medications/${id}/take`, {
        method: 'POST',
        body: JSON.stringify({
          verificationData,
          timestamp: new Date().toISOString(),
        }),
      });
      
      if (result.demo) {
        return this.recordDemoMedicationTaken(id, verificationData);
      }
      return result;
    } catch (error) {
      console.warn('Backend record medication failed, using demo mode:', error);
      return this.recordDemoMedicationTaken(id, verificationData);
    }
  },

  recordDemoMedicationTaken(id: string, verificationData?: any) {
    const medications = this.getDemoMedications();
    const medication = medications.medications.find((med: any) => med.id === id);
    
    if (medication) {
      // Update adherence (simple logic for demo)
      medication.adherence = Math.min(100, medication.adherence + 2);
      medication.lastTaken = new Date().toISOString();
      localStorage.setItem('healthcare_demo_medications', JSON.stringify(medications));
    }
    
    return {
      success: true,
      adherenceRecord: {
        id: Date.now().toString(),
        medicationId: id,
        takenAt: new Date().toISOString(),
        verified: true
      },
      newAdherence: medication?.adherence
    };
  },

  // Health Data
  async getHealthData() {
    return makeRequest('/health-data');
  },

  async addHealthData(healthData: {
    type: 'blood_pressure' | 'heart_rate' | 'blood_sugar' | 'weight' | 'temperature';
    value: any;
    unit: string;
    notes?: string;
  }) {
    return makeRequest('/health-data', {
      method: 'POST',
      body: JSON.stringify(healthData),
    });
  },

  // Family/Caregiver
  async linkFamilyMember(memberData: {
    memberEmail: string;
    relationship: string;
    permissions?: string[];
  }) {
    return makeRequest('/family/link', {
      method: 'POST',
      body: JSON.stringify(memberData),
    });
  },

  // Documents
  async getDocuments() {
    return makeRequest('/documents');
  },

  async uploadDocument(documentData: {
    fileName: string;
    fileType: string;
    category: string;
    description?: string;
  }) {
    return makeRequest('/documents/upload', {
      method: 'POST',
      body: JSON.stringify(documentData),
    });
  },

  // Notifications
  async getNotifications() {
    try {
      const result = await makeRequest('/notifications');
      if (result.demo) {
        return this.getDemoNotifications();
      }
      return result;
    } catch (error) {
      console.warn('Backend notifications failed, using demo data:', error);
      return this.getDemoNotifications();
    }
  },

  getDemoNotifications() {
    const stored = localStorage.getItem('healthcare_demo_notifications');
    if (stored) {
      return JSON.parse(stored);
    }
    
    const demoNotifications = {
      notifications: [
        {
          id: '1',
          type: 'reminder',
          title: 'Medication Due',
          message: 'Time to take your Metformin',
          createdAt: new Date().toISOString(),
          read: false
        },
        {
          id: '2',
          type: 'info',
          title: 'Welcome to HealthCare+',
          message: 'You are currently using demo mode. All data is stored locally.',
          createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          read: false
        }
      ]
    };
    
    localStorage.setItem('healthcare_demo_notifications', JSON.stringify(demoNotifications));
    return demoNotifications;
  },

  async createNotification(notificationData: {
    type: string;
    title: string;
    message: string;
    priority?: 'low' | 'medium' | 'high';
  }) {
    try {
      const result = await makeRequest('/notifications', {
        method: 'POST',
        body: JSON.stringify(notificationData),
      });
      
      if (result.demo) {
        return this.addDemoNotification(notificationData);
      }
      return result;
    } catch (error) {
      console.warn('Backend create notification failed, using demo mode:', error);
      return this.addDemoNotification(notificationData);
    }
  },

  addDemoNotification(notificationData: any) {
    const notifications = this.getDemoNotifications();
    const newNotification = {
      id: Date.now().toString(),
      ...notificationData,
      createdAt: new Date().toISOString(),
      read: false
    };
    
    notifications.notifications.unshift(newNotification);
    localStorage.setItem('healthcare_demo_notifications', JSON.stringify(notifications));
    return { notification: newNotification };
  },

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE}/health`);
      if (response.ok) {
        return response.json();
      }
      return { status: 'demo', message: 'Running in demo mode' };
    } catch (error) {
      return { status: 'demo', message: 'Running in demo mode' };
    }
  },
};