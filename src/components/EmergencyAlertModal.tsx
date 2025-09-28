import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Clock, 
  User, 
  Activity,
  X,
  Shield
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface EmergencyAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: {
    name: string;
    age: number;
    avatar: string;
    location: string;
    emergency: {
      type: string;
      severity: 'critical' | 'high' | 'medium';
      description: string;
      vitals: {
        heartRate?: number;
        bloodPressure?: string;
        bloodSugar?: number;
      };
      timestamp: Date;
    };
  };
}

export default function EmergencyAlertModal({ isOpen, onClose, patient }: EmergencyAlertModalProps) {
  const [isResponding, setIsResponding] = useState(false);
  const [responseType, setResponseType] = useState<'calling' | 'ambulance' | 'family' | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-700 bg-red-100 border-red-200';
      case 'high': return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const handleEmergencyResponse = async (type: 'calling' | 'ambulance' | 'family') => {
    setIsResponding(true);
    setResponseType(type);

    // Simulate response action
    await new Promise(resolve => setTimeout(resolve, 2000));

    switch (type) {
      case 'calling':
        toast.success('Emergency call initiated - Connecting to patient...');
        break;
      case 'ambulance':
        toast.success('Ambulance dispatched - ETA 8-12 minutes');
        break;
      case 'family':
        toast.success('Family members notified - Dr. Sharma contacted');
        break;
    }

    setIsResponding(false);
    setResponseType(null);
    onClose();
  };

  const formatTimeAgo = (date: Date) => {
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffSecs = Math.floor(diffMs / 1000);

    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffMins < 60) return `${diffMins}m ago`;
    return `${Math.floor(diffMins / 60)}h ago`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader className="relative">
          <motion.div
            className={`absolute -top-4 -left-4 w-4 h-4 rounded-full ${getSeverityColor(patient.emergency.severity)}`}
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
          <DialogTitle className="text-red-600 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            EMERGENCY ALERT
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Patient Info */}
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="text-3xl">{patient.avatar}</div>
            <div className="flex-1">
              <h3 className="font-semibold text-red-900">{patient.name}</h3>
              <div className="text-sm text-red-700">{patient.age} years old</div>
              <div className="flex items-center gap-1 text-xs text-red-600 mt-1">
                <MapPin className="w-3 h-3" />
                <span>{patient.location}</span>
              </div>
            </div>
            <Badge className={getSeverityTextColor(patient.emergency.severity)}>
              {patient.emergency.severity.toUpperCase()}
            </Badge>
          </div>

          {/* Emergency Details */}
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="font-semibold text-red-900">{patient.emergency.type}</div>
                <div className="text-red-700">{patient.emergency.description}</div>
                <div className="flex items-center gap-1 text-xs text-red-600">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimeAgo(patient.emergency.timestamp)}</span>
                </div>
              </div>
            </AlertDescription>
          </Alert>

          {/* Current Vitals */}
          <div className="bg-white border rounded-lg p-4 space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Current Vitals
            </h4>
            <div className="grid grid-cols-1 gap-2 text-sm">
              {patient.emergency.vitals.heartRate && (
                <div className="flex justify-between">
                  <span>Heart Rate:</span>
                  <span className="font-medium text-red-600">
                    {patient.emergency.vitals.heartRate} bpm
                  </span>
                </div>
              )}
              {patient.emergency.vitals.bloodPressure && (
                <div className="flex justify-between">
                  <span>Blood Pressure:</span>
                  <span className="font-medium text-red-600">
                    {patient.emergency.vitals.bloodPressure}
                  </span>
                </div>
              )}
              {patient.emergency.vitals.bloodSugar && (
                <div className="flex justify-between">
                  <span>Blood Sugar:</span>
                  <span className="font-medium text-red-600">
                    {patient.emergency.vitals.bloodSugar} mg/dL
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Emergency Actions */}
          <div className="space-y-3">
            <h4 className="font-semibold text-red-900">Emergency Response</h4>
            <div className="grid gap-2">
              <Button
                onClick={() => handleEmergencyResponse('calling')}
                disabled={isResponding}
                className="bg-red-600 hover:bg-red-700 text-white justify-start gap-2"
              >
                <Phone className="w-4 h-4" />
                {responseType === 'calling' && isResponding ? 'Calling...' : 'Call Patient Now'}
              </Button>
              
              <Button
                onClick={() => handleEmergencyResponse('ambulance')}
                disabled={isResponding}
                className="bg-orange-600 hover:bg-orange-700 text-white justify-start gap-2"
              >
                <Shield className="w-4 h-4" />
                {responseType === 'ambulance' && isResponding ? 'Dispatching...' : 'Call Ambulance'}
              </Button>
              
              <Button
                onClick={() => handleEmergencyResponse('family')}
                disabled={isResponding}
                variant="outline"
                className="border-red-200 text-red-700 hover:bg-red-50 justify-start gap-2"
              >
                <User className="w-4 h-4" />
                {responseType === 'family' && isResponding ? 'Notifying...' : 'Notify Family & Doctor'}
              </Button>
            </div>
          </div>

          {/* Loading Indicator */}
          <AnimatePresence>
            {isResponding && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center py-4"
              >
                <div className="flex items-center gap-2 text-red-600">
                  <motion.div
                    className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                  <span>Processing emergency response...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}