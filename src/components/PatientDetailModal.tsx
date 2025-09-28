import { useState } from 'react';
import { motion } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { 
  User, 
  Heart, 
  Activity, 
  Pill, 
  FileText, 
  Calendar,
  Phone,
  Video,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  X
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner@2.0.3';

interface PatientDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: {
    id: string;
    name: string;
    age: number;
    avatar: string;
    condition: string;
    riskScore: number;
    adherence: number;
    status: string;
    lastVisit: Date;
    nextAppointment: Date;
    vitals: {
      bp: string;
      hr: number;
      glucose: number;
    };
  };
}

const vitalsTrend = [
  { date: '1/1', bp_sys: 125, bp_dia: 82, hr: 74, glucose: 110 },
  { date: '1/2', bp_sys: 128, bp_dia: 85, hr: 76, glucose: 108 },
  { date: '1/3', bp_sys: 122, bp_dia: 80, hr: 72, glucose: 112 },
  { date: '1/4', bp_sys: 130, bp_dia: 88, hr: 78, glucose: 115 },
  { date: '1/5', bp_sys: 126, bp_dia: 82, hr: 74, glucose: 109 },
  { date: '1/6', bp_sys: 124, bp_dia: 81, hr: 73, glucose: 107 },
  { date: '1/7', bp_sys: 127, bp_dia: 83, hr: 75, glucose: 111 }
];

const medications = [
  {
    name: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    adherence: 92,
    lastTaken: '2 hours ago',
    status: 'on-track'
  },
  {
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    adherence: 88,
    lastTaken: '6 hours ago',
    status: 'on-track'
  },
  {
    name: 'Atorvastatin',
    dosage: '20mg',
    frequency: 'Once daily',
    adherence: 75,
    lastTaken: '1 day ago',
    status: 'missed'
  }
];

const recentReports = [
  {
    type: 'Lab Results',
    date: '2024-01-15',
    status: 'reviewed',
    summary: 'HbA1c: 7.2%, Cholesterol: 180 mg/dL'
  },
  {
    type: 'Blood Pressure Log',
    date: '2024-01-14',
    status: 'pending',
    summary: 'Weekly average: 125/82 mmHg'
  },
  {
    type: 'Prescription',
    date: '2024-01-10',
    status: 'active',
    summary: 'Updated Metformin dosage'
  }
];

export default function PatientDetailModal({ isOpen, onClose, patient }: PatientDetailModalProps) {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isScheduling, setIsScheduling] = useState(false);

  const getRiskColor = (score: number) => {
    if (score <= 25) return 'text-green-600 bg-green-100';
    if (score <= 50) return 'text-yellow-600 bg-yellow-100';
    if (score <= 75) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stable': return 'bg-green-100 text-green-700';
      case 'monitoring': return 'bg-yellow-100 text-yellow-700';
      case 'attention': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getMedicationStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'text-green-600';
      case 'missed': return 'text-red-600';
      case 'delayed': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const handleScheduleAppointment = async () => {
    setIsScheduling(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.success(`Appointment scheduled with ${patient.name} for next week`);
    setIsScheduling(false);
  };

  const handleCallPatient = () => {
    toast.success(`Calling ${patient.name}...`);
  };

  const handleVideoCall = () => {
    toast.success(`Starting video call with ${patient.name}...`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
          <DialogTitle className="flex items-center gap-3">
            <div className="text-2xl">{patient.avatar}</div>
            <div>
              <div>{patient.name} - Patient Details</div>
              <div className="text-sm font-normal text-muted-foreground">
                {patient.age} years • {patient.condition}
              </div>
            </div>
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-lg font-bold text-blue-600">{patient.riskScore}</div>
                <div className="text-xs text-muted-foreground">Risk Score</div>
                <Badge className={getRiskColor(patient.riskScore)} size="sm">
                  {patient.riskScore <= 25 ? 'Low' : patient.riskScore <= 50 ? 'Medium' : 'High'}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-lg font-bold text-green-600">{patient.adherence}%</div>
                <div className="text-xs text-muted-foreground">Adherence</div>
                <Progress value={patient.adherence} className="mt-1" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-lg font-bold text-purple-600">{patient.vitals.bp}</div>
                <div className="text-xs text-muted-foreground">Blood Pressure</div>
                <div className="flex items-center justify-center mt-1">
                  <TrendingDown className="w-3 h-3 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-lg font-bold text-orange-600">{patient.vitals.hr}</div>
                <div className="text-xs text-muted-foreground">Heart Rate</div>
                <div className="flex items-center justify-center mt-1">
                  <TrendingUp className="w-3 h-3 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleCallPatient} className="gap-2">
              <Phone className="w-4 h-4" />
              Call Patient
            </Button>
            <Button onClick={handleVideoCall} variant="outline" className="gap-2">
              <Video className="w-4 h-4" />
              Video Call
            </Button>
            <Button 
              onClick={handleScheduleAppointment}
              disabled={isScheduling}
              variant="outline" 
              className="gap-2"
            >
              <Calendar className="w-4 h-4" />
              {isScheduling ? 'Scheduling...' : 'Schedule Appointment'}
            </Button>
          </div>

          {/* Detailed Information */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="vitals">Vitals</TabsTrigger>
              <TabsTrigger value="medications">Medications</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Patient Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Age:</span>
                      <span>{patient.age} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Condition:</span>
                      <span>{patient.condition}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge className={getStatusColor(patient.status)} size="sm">
                        {patient.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Visit:</span>
                      <span>{patient.lastVisit.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Next Appointment:</span>
                      <span>{patient.nextAppointment.toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      AI Risk Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="p-3 bg-blue-50 rounded border border-blue-200">
                      <div className="font-medium text-blue-900 mb-1">ML Prediction</div>
                      <div className="text-blue-700">
                        Based on current trends, patient shows stable condition with 
                        moderate adherence improvement needed.
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Last updated: {new Date().toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="vitals" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Vitals Trend (Last 7 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={vitalsTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="bp_sys" stroke="#ef4444" name="Systolic BP" />
                      <Line type="monotone" dataKey="hr" stroke="#3b82f6" name="Heart Rate" />
                      <Line type="monotone" dataKey="glucose" stroke="#10b981" name="Blood Sugar" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="medications" className="space-y-4">
              <div className="space-y-3">
                {medications.map((med, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Pill className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="font-medium">{med.name} {med.dosage}</div>
                            <div className="text-sm text-muted-foreground">{med.frequency}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${getMedicationStatusColor(med.status)}`}>
                            {med.adherence}% adherence
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Last taken: {med.lastTaken}
                          </div>
                        </div>
                      </div>
                      <Progress value={med.adherence} className="mt-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <div className="space-y-3">
                {recentReports.map((report, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-purple-600" />
                          <div>
                            <div className="font-medium">{report.type}</div>
                            <div className="text-sm text-muted-foreground">{report.summary}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={report.status === 'reviewed' ? 'default' : 'secondary'}
                            size="sm"
                          >
                            {report.status}
                          </Badge>
                          <div className="text-xs text-muted-foreground mt-1">
                            {report.date}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}