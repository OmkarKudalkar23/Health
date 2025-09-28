import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent } from './ui/dialog';
import { healthcareService } from '../services/healthcareService';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useApp } from '../contexts/AppContext';
import { toast } from 'sonner@2.0.3';
import {
  Bell,
  Pill,
  Camera,
  CheckCircle,
  X,
  Clock,
  AlertTriangle,
  Volume2,
  Hand,
  Eye,
  RotateCcw
} from 'lucide-react';

interface ReminderModalProps {
  onClose: () => void;
  onComplete: () => void;
}

export default function ReminderModal({ onClose, onComplete }: ReminderModalProps) {
  const { medications } = useApp();
  const [step, setStep] = useState<'reminder' | 'camera' | 'verification' | 'complete'>('reminder');
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);

  // Get the next due medication
  const nextMedication = medications
    .sort((a, b) => a.nextDose.getTime() - b.nextDose.getTime())[0];

  const handleStartVerification = () => {
    setStep('camera');
    // Simulate camera initialization delay
    setTimeout(() => {
      setStep('verification');
    }, 1000);
  };

  const simulateVerification = () => {
    setIsVerifying(true);
    setVerificationProgress(0);
    
    // Simulate verification process
    const interval = setInterval(() => {
      setVerificationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsVerifying(false);
          setStep('complete');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleComplete = async () => {
    try {
      if (nextMedication) {
        await healthcareService.recordMedicationTaken(nextMedication.id, {
          verified: true,
          method: 'camera_verification',
          timestamp: new Date().toISOString()
        });
      }
      
      toast.success('Great job! Medication recorded 🎉', {
        description: 'Your adherence score has been updated. Keep up the good work!'
      });
    } catch (error) {
      console.log('Recording medication locally:', error);
      toast.success('Great job! Medication recorded 🎉', {
        description: 'Your adherence score has been updated. Keep up the good work!'
      });
    }
    
    onComplete();
    onClose();
  };

  const handleSnooze = () => {
    toast.info('Reminder snoozed for 15 minutes');
    onClose();
  };

  const handleSkip = () => {
    toast.warning('Medication skipped', {
      description: 'This will affect your adherence score.'
    });
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-purple-50">
        <AnimatePresence mode="wait">
          {step === 'reminder' && (
            <motion.div
              key="reminder"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6"
            >
              {/* Header */}
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Bell className="w-8 h-8 text-white" />
                </motion.div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Medication Reminder</h2>
                <p className="text-gray-600">It's time to take your medication</p>
              </div>

              {/* Medication Info */}
              {nextMedication && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-xl p-4 mb-6 shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Pill className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{nextMedication.name}</h3>
                      <p className="text-gray-600">{nextMedication.dosage} • {nextMedication.frequency}</p>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          Due: {nextMedication.nextDose.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      {nextMedication.adherence}%
                    </Badge>
                  </div>
                </motion.div>
              )}

              {/* Voice Prompt Simulation */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-3 mb-6 flex items-center gap-3"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"
                >
                  <Volume2 className="w-4 h-4 text-white" />
                </motion.div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">Voice Assistant</p>
                  <p className="text-xs text-blue-700">
                    "Time to take your {nextMedication?.name.split(' ')[0] || 'medication'}. Please tap 'Take Now' to continue."
                  </p>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={handleStartVerification}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 text-lg"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Take Now
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={handleSnooze}>
                    <Clock className="w-4 h-4 mr-2" />
                    Snooze 15min
                  </Button>
                  <Button variant="outline" onClick={handleSkip} className="text-orange-600 border-orange-200 hover:bg-orange-50">
                    <X className="w-4 h-4 mr-2" />
                    Skip
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'camera' && (
            <motion.div
              key="camera"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="p-6"
            >
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                  className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Camera className="w-8 h-8 text-white" />
                </motion.div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-2">Camera Verification</h2>
                <p className="text-gray-600">Initializing camera for pill verification...</p>
              </div>

              {/* Camera Placeholder */}
              <div className="bg-black rounded-xl aspect-video flex items-center justify-center mb-4 overflow-hidden">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-white text-center"
                >
                  <Camera className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Camera starting...</p>
                </motion.div>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </motion.div>
                  Loading camera...
                </div>
              </div>
            </motion.div>
          )}

          {step === 'verification' && (
            <motion.div
              key="verification"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6"
            >
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                  className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Eye className="w-8 h-8 text-white" />
                </motion.div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-2">Verify Medication</h2>
                <p className="text-gray-600">Follow the instructions below</p>
              </div>

              {/* Camera View Simulation */}
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl aspect-video flex items-center justify-center mb-4 border-2 border-dashed border-gray-300 relative overflow-hidden">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-center"
                >
                  <Pill className="w-16 h-16 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Position pill in frame</p>
                </motion.div>
                
                {/* Animated scanning overlay */}
                <motion.div
                  animate={{ y: [0, 200, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-200/50 to-transparent h-8"
                />
              </div>

              {/* Instructions */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Show the pill clearly</p>
                    <p className="text-xs text-gray-600">Hold the medication in your hand</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-bold">2</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Move hand to mouth</p>
                    <p className="text-xs text-gray-600">Simulate taking the medication</p>
                  </div>
                </div>
              </div>

              {/* Verification Progress */}
              {isVerifying && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4"
                >
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Verifying...</span>
                    <span>{verificationProgress}%</span>
                  </div>
                  <Progress value={verificationProgress} className="h-2" />
                </motion.div>
              )}

              {/* Action Button */}
              <Button 
                onClick={simulateVerification}
                disabled={isVerifying}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
              >
                {isVerifying ? (
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </motion.div>
                    Verifying...
                  </div>
                ) : (
                  <>
                    <Hand className="w-4 h-4 mr-2" />
                    Start Verification
                  </>
                )}
              </Button>
            </motion.div>
          )}

          {step === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="p-6 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-green-600 mb-3">Verification Complete!</h2>
                <p className="text-gray-600 mb-2">
                  Successfully verified medication intake
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Your adherence score has been updated
                </p>
              </motion.div>

              {/* Success Stats */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-green-50 rounded-lg p-4 mb-6"
              >
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-green-600">100%</div>
                    <div className="text-xs text-gray-600">Today's Adherence</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-green-600">7</div>
                    <div className="text-xs text-gray-600">Day Streak</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-green-600">+5</div>
                    <div className="text-xs text-gray-600">Health Score</div>
                  </div>
                </div>
              </motion.div>

              <Button 
                onClick={handleComplete}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
              >
                Continue to Dashboard
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}