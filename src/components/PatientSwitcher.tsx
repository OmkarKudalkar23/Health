import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Users, 
  ChevronDown, 
  Heart, 
  AlertTriangle, 
  CheckCircle,
  Plus,
  User
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface Patient {
  id: string;
  name: string;
  relation: string;
  age: number;
  avatar: string;
  healthStatus: 'good' | 'warning' | 'critical';
  lastUpdate: Date;
  vitals: {
    bloodPressure: string;
    heartRate: number;
    medication: number;
  };
  alerts: number;
}

interface PatientSwitcherProps {
  selectedPatient: string | null;
  onPatientChange: (patientId: string) => void;
}

const mockPatients: Patient[] = [
  {
    id: 'mother',
    name: 'Sunita Sharma',
    relation: 'Mother',
    age: 65,
    avatar: '👵',
    healthStatus: 'warning',
    lastUpdate: new Date(Date.now() - 30 * 60 * 1000),
    vitals: {
      bloodPressure: '145/85',
      heartRate: 78,
      medication: 3
    },
    alerts: 2
  },
  {
    id: 'father',
    name: 'Raj Kumar Sharma',
    relation: 'Father',
    age: 68,
    avatar: '👴',
    healthStatus: 'good',
    lastUpdate: new Date(Date.now() - 2 * 60 * 60 * 1000),
    vitals: {
      bloodPressure: '125/80',
      heartRate: 72,
      medication: 2
    },
    alerts: 0
  },
  {
    id: 'son',
    name: 'Arjun Sharma',
    relation: 'Son',
    age: 12,
    avatar: '🧒',
    healthStatus: 'good',
    lastUpdate: new Date(Date.now() - 60 * 60 * 1000),
    vitals: {
      bloodPressure: '95/60',
      heartRate: 85,
      medication: 0
    },
    alerts: 0
  },
  {
    id: 'spouse',
    name: 'Priya Sharma',
    relation: 'Spouse',
    age: 35,
    avatar: '👩',
    healthStatus: 'critical',
    lastUpdate: new Date(Date.now() - 15 * 60 * 1000),
    vitals: {
      bloodPressure: '160/95',
      heartRate: 95,
      medication: 4
    },
    alerts: 3
  }
];

export default function PatientSwitcher({ selectedPatient, onPatientChange }: PatientSwitcherProps) {
  const { language } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);

  const currentPatient = mockPatients.find(p => p.id === selectedPatient) || mockPatients[0];
  const totalAlerts = mockPatients.reduce((acc, patient) => acc + patient.alerts, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-700 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'critical': return <Heart className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const formatLastUpdate = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
    if (minutes < 60) {
      return `${minutes}m ago`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours}h ago`;
    }
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {/* Current Patient Header */}
      <Card className="border-2">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{currentPatient.avatar}</div>
              <div>
                <h3 className="font-medium">{currentPatient.name}</h3>
                <p className="text-sm text-muted-foreground">{currentPatient.relation} • {currentPatient.age} years</p>
              </div>
              <Badge className={getStatusColor(currentPatient.healthStatus)} variant="outline">
                {getStatusIcon(currentPatient.healthStatus)}
                {currentPatient.healthStatus}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              {totalAlerts > 0 && (
                <Badge variant="destructive" className="animate-pulse">
                  {totalAlerts} {language === 'hi' ? 'अलर्ट' : 'alerts'}
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="gap-2"
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {language === 'hi' ? 'मरीज़ बदलें' : 'Switch Patient'}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </div>
          
          {/* Quick Vitals */}
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">BP</p>
              <p className="font-medium">{currentPatient.vitals.bloodPressure}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">HR</p>
              <p className="font-medium">{currentPatient.vitals.heartRate} bpm</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Meds</p>
              <p className="font-medium">{currentPatient.vitals.medication}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient List (Expanded) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium">
                {language === 'hi' ? 'सभी मरीज़' : 'All Patients'}
              </h4>
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                {language === 'hi' ? 'जोड़ें' : 'Add'}
              </Button>
            </div>
            
            {mockPatients.map((patient, index) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    patient.id === selectedPatient 
                      ? 'border-primary bg-primary/5' 
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => {
                    onPatientChange(patient.id);
                    setIsExpanded(false);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{patient.avatar}</div>
                        <div>
                          <h4 className="font-medium">{patient.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {patient.relation} • {patient.age} years
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Last update: {formatLastUpdate(patient.lastUpdate)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {patient.alerts > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {patient.alerts}
                          </Badge>
                        )}
                        <Badge 
                          className={getStatusColor(patient.healthStatus)} 
                          variant="outline"
                        >
                          {getStatusIcon(patient.healthStatus)}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Mini Vitals */}
                    <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t text-xs">
                      <div>
                        <span className="text-muted-foreground">BP: </span>
                        <span className="font-medium">{patient.vitals.bloodPressure}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">HR: </span>
                        <span className="font-medium">{patient.vitals.heartRate}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Meds: </span>
                        <span className="font-medium">{patient.vitals.medication}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}