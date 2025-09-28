import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { useApp } from '../contexts/AppContext';
import PillVerificationModal from '../components/PillVerificationModal';
import AppointmentBookingModal from '../components/AppointmentBookingModal';
import VitalReadingModal from '../components/VitalReadingModal';
import CalendarView from '../components/CalendarView';
import AIHealthInsights from '../components/AIHealthInsights';
import ExpensesTimeline from '../components/ExpensesTimeline';
import PDFExportModal from '../components/PDFExportModal';
import {
  Heart,
  Pill,
  Calendar,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Clock,
  Activity,
  Shield,
  Bell,
  Camera,
  Plus,
  Download,
  Brain,
  BarChart3,
  CalendarDays
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const vitalsData = [
  { date: '1/1', bp: 120, hr: 72, glucose: 95 },
  { date: '1/2', bp: 118, hr: 75, glucose: 92 },
  { date: '1/3', bp: 122, hr: 70, glucose: 98 },
  { date: '1/4', bp: 119, hr: 73, glucose: 94 },
  { date: '1/5', bp: 121, hr: 71, glucose: 96 },
  { date: '1/6', bp: 117, hr: 74, glucose: 90 },
  { date: '1/7', bp: 120, hr: 72, glucose: 93 }
];

const getExpenseData = (t: any) => [
  { name: t('dashboard.expenses.medications'), value: 2500, color: '#3b82f6' },
  { name: t('dashboard.expenses.consultations'), value: 1800, color: '#10b981' },
  { name: t('dashboard.expenses.labTests'), value: 800, color: '#f59e0b' },
  { name: t('dashboard.expenses.others'), value: 400, color: '#ef4444' }
];

export default function PatientDashboard() {
  const { t } = useTranslation();
  const { medications, language } = useApp();
  const expenseData = getExpenseData(t);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showPillVerification, setShowPillVerification] = useState(false);
  const [showAppointmentBooking, setShowAppointmentBooking] = useState(false);
  const [showVitalReading, setShowVitalReading] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<any>(null);
  const [showPDFExport, setShowPDFExport] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'calendar' | 'insights' | 'expenses'>('overview');
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const nextMedication = medications
    .sort((a, b) => a.nextDose.getTime() - b.nextDose.getTime())[0];

  const averageAdherence = medications.reduce((acc, med) => acc + med.adherence, 0) / medications.length;

  const upcomingAppointments = [
    {
      id: '1',
      doctor: 'Dr. Rajesh Kumar',
      specialty: 'Cardiologist',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      time: '2:00 PM',
      type: 'Follow-up',
      avatar: '👨‍⚕️'
    },
    {
      id: '2',
      doctor: 'Dr. Priya Sharma',
      specialty: 'Endocrinologist',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      time: '10:30 AM',
      type: 'Consultation',
      avatar: '👩‍⚕️'
    }
  ];

  const riskScore = 15; // Mock risk score out of 100

  const getRiskColor = (score: number) => {
    if (score <= 25) return 'text-green-600 bg-green-100';
    if (score <= 50) return 'text-yellow-600 bg-yellow-100';
    if (score <= 75) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getRiskLevel = (score: number) => {
    if (score <= 25) return t('vitals.normal');
    if (score <= 50) return 'Moderate Risk';
    if (score <= 75) return 'High Risk';
    return 'Very High Risk';
  };

  const handleTakeMedication = (medication: any) => {
    setSelectedMedication(medication);
    setShowPillVerification(true);
  };

  const handleVitalSave = (reading: any) => {
    // In a real app, this would save to backend
    console.log('Vital reading saved:', reading);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            {currentTime.getHours() < 12 ? t('dashboard.greeting.morning') : currentTime.getHours() < 17 ? t('dashboard.greeting.afternoon') : t('dashboard.greeting.evening')}! 👋
          </h1>
          <p className="text-muted-foreground">{t('dashboard.overview')}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowPDFExport(true)}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">{t('common.export')} PDF</span>
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate('/settings')}
          >
            <Bell className="w-4 h-4" />
          </Button>
          <Avatar 
            className="cursor-pointer"
            onClick={() => navigate('/settings')}
          >
            <AvatarImage src="" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </motion.div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Pill className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{t('dashboard.stats.adherenceRate')}</p>
                  <p className="text-2xl font-bold">{Math.round(averageAdherence)}%</p>
                </div>
              </div>
              <Progress value={averageAdherence} className="mt-3" />
            </CardContent>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{t('dashboard.stats.bloodPressure')}</p>
                  <p className="text-2xl font-bold">120/80</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 mt-2">{t('dashboard.stats.normal')}</Badge>
            </CardContent>
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none" />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{t('dashboard.stats.monthlySpend')}</p>
                  <p className="text-2xl font-bold">₹5,500</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>5% {t('dashboard.stats.saved')}</span>
              </div>
            </CardContent>
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none" />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getRiskColor(riskScore)}`}>
                  <Shield className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{t('dashboard.stats.riskScore')}</p>
                  <p className="text-2xl font-bold">{riskScore}/100</p>
                </div>
              </div>
              <Badge className={getRiskColor(riskScore) + " mt-2"}>
                {getRiskLevel(riskScore)}
              </Badge>
            </CardContent>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
          </Card>
        </motion.div>
      </div>

      {/* Next Medication Card */}
      {nextMedication && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                    <Pill className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{t('dashboard.nextMedication.title')}</h3>
                    <p className="text-blue-100">{nextMedication.name}</p>
                    <p className="text-sm text-blue-100">{nextMedication.dosage} • {nextMedication.frequency}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {nextMedication.nextDose.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-blue-100">
                    {t('dashboard.nextMedication.inHours', { hours: Math.max(0, Math.round((nextMedication.nextDose.getTime() - Date.now()) / (1000 * 60 * 60))) })}
                  </div>
                  <Button 
                    className="bg-white text-blue-600 hover:bg-blue-50 mt-2"
                    onClick={() => handleTakeMedication(nextMedication)}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    {t('dashboard.nextMedication.takeNow')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b">
        {[
          { id: 'overview', label: t('dashboard.tabs.overview'), icon: <Activity className="w-4 h-4" /> },
          { id: 'calendar', label: t('dashboard.tabs.calendar'), icon: <CalendarDays className="w-4 h-4" /> },
          { id: 'insights', label: t('dashboard.tabs.insights'), icon: <Brain className="w-4 h-4" /> },
          { id: 'expenses', label: t('dashboard.tabs.expenses'), icon: <BarChart3 className="w-4 h-4" /> }
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab(tab.id as any)}
            className="gap-2"
          >
            {tab.icon}
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-3 gap-6">
        {/* Vitals Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  {t('dashboard.vitals.title')}
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowVitalReading(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t('dashboard.vitals.addReading')}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={vitalsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="bp" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name={t('dashboard.vitals.bloodPressure')}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="hr" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name={t('dashboard.vitals.heartRate')}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="glucose" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    name={t('dashboard.vitals.bloodGlucose')}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {t('dashboard.appointments.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="text-2xl">{appointment.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{appointment.doctor}</p>
                    <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>
                        {appointment.date.toLocaleDateString()} • {appointment.time}
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline">{appointment.type}</Badge>
                </div>
              ))}
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowAppointmentBooking(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('dashboard.appointments.bookAppointment')}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Monthly Expenses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                {t('dashboard.expenses.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={expenseData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {expenseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-3">
                  {expenseData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="font-medium">₹{item.value}</span>
                    </div>
                  ))}
                  
                  <div className="pt-3 border-t">
                    <div className="flex items-center justify-between font-bold">
                      <span>{t('dashboard.expenses.total')}</span>
                      <span>₹{expenseData.reduce((acc, item) => acc + item.value, 0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Medication Adherence */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="w-5 h-5" />
                {t('dashboard.medications.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {medications.slice(0, 3).map((medication) => (
                <div key={medication.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{medication.name}</p>
                      <p className="text-sm text-muted-foreground">{medication.frequency}</p>
                    </div>
                    <Badge 
                      className={
                        medication.adherence >= 90 
                          ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                          : medication.adherence >= 75 
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                          : 'bg-red-100 text-red-700 hover:bg-red-100'
                      }
                    >
                      {medication.adherence}%
                    </Badge>
                  </div>
                  <Progress value={medication.adherence} />
                </div>
              ))}
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/medications')}
              >
                {t('dashboard.medications.viewAll')}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
        </div>
      )}

      {/* Calendar Tab */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          <CalendarView />
        </div>
      )}

      {/* AI Insights Tab */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          <AIHealthInsights />
        </div>
      )}

      {/* Expenses Tab */}
      {activeTab === 'expenses' && (
        <div className="space-y-6">
          <ExpensesTimeline />
        </div>
      )}

      {/* Modals */}
      <PillVerificationModal
        isOpen={showPillVerification}
        onClose={() => setShowPillVerification(false)}
        medication={selectedMedication}
      />
      
      <AppointmentBookingModal
        isOpen={showAppointmentBooking}
        onClose={() => setShowAppointmentBooking(false)}
      />
      
      <VitalReadingModal
        isOpen={showVitalReading}
        onClose={() => setShowVitalReading(false)}
        onSave={handleVitalSave}
      />

      <PDFExportModal
        isOpen={showPDFExport}
        onClose={() => setShowPDFExport(false)}
      />
    </div>
  );
}