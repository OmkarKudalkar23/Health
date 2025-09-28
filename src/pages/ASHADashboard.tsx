import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Calendar, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Phone, 
  MessageSquare, 
  FileText,
  Heart,
  AlertTriangle,
  Plus,
  Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { useApp } from '../contexts/AppContext';
import { toast } from 'sonner@2.0.3';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  condition: string;
  lastVisit: Date;
  nextVisit: Date;
  adherence: number;
  riskLevel: 'low' | 'medium' | 'high';
  village: string;
  phone: string;
  notes: string[];
  vitals: {
    bp: string;
    hr: number;
    weight: number;
    lastUpdated: Date;
  };
}

interface Visit {
  id: string;
  patientId: string;
  patientName: string;
  date: Date;
  status: 'scheduled' | 'completed' | 'missed';
  type: 'routine' | 'followup' | 'emergency';
  notes?: string;
}

export default function ASHADashboard() {
  const { language, user } = useApp();
  const [selectedTab, setSelectedTab] = useState('patients');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [newNote, setNewNote] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);

  // Load mock data
  useEffect(() => {
    const mockPatients: Patient[] = [
      {
        id: '1',
        name: language === 'hi' ? 'सुनीता देवी' : 'Sunita Devi',
        age: 45,
        gender: 'F',
        condition: language === 'hi' ? 'मधुमेह' : 'Diabetes',
        lastVisit: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        nextVisit: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        adherence: 85,
        riskLevel: 'medium',
        village: language === 'hi' ? 'रामपुर' : 'Rampur',
        phone: '+91 9876543210',
        notes: [
          language === 'hi' ? 'नियमित दवा ले रही है' : 'Taking medication regularly',
          language === 'hi' ? 'आहार नियंत्रण में सुधार चाहिए' : 'Diet control needs improvement'
        ],
        vitals: {
          bp: '140/90',
          hr: 78,
          weight: 65,
          lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      },
      {
        id: '2',
        name: language === 'hi' ? 'राम प्रसाद' : 'Ram Prasad',
        age: 62,
        gender: 'M',
        condition: language === 'hi' ? 'उच्च रक्तचाप' : 'Hypertension',
        lastVisit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        nextVisit: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        adherence: 92,
        riskLevel: 'low',
        village: language === 'hi' ? 'शिवपुर' : 'Shivpur',
        phone: '+91 9876543211',
        notes: [
          language === 'hi' ? 'बहुत अच्छी प्रगति' : 'Excellent progress',
          language === 'hi' ? 'योग और टहलना जारी रखें' : 'Continue yoga and walking'
        ],
        vitals: {
          bp: '120/80',
          hr: 72,
          weight: 68,
          lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        }
      },
      {
        id: '3',
        name: language === 'hi' ? 'गीता शर्मा' : 'Geeta Sharma',
        age: 38,
        gender: 'F',
        condition: language === 'hi' ? 'गर्भावस्था देखभाल' : 'Pregnancy Care',
        lastVisit: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        nextVisit: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        adherence: 95,
        riskLevel: 'high',
        village: language === 'hi' ? 'गोकुलपुर' : 'Gokulpur',
        phone: '+91 9876543212',
        notes: [
          language === 'hi' ? '7 महीने की गर्भवती' : '7 months pregnant',
          language === 'hi' ? 'नियमित जांच आवश्यक' : 'Regular checkups needed'
        ],
        vitals: {
          bp: '110/70',
          hr: 85,
          weight: 72,
          lastUpdated: new Date()
        }
      }
    ];

    const mockVisits: Visit[] = [
      {
        id: '1',
        patientId: '1',
        patientName: language === 'hi' ? 'सुनीता देवी' : 'Sunita Devi',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        status: 'scheduled',
        type: 'routine'
      },
      {
        id: '2',
        patientId: '2',
        patientName: language === 'hi' ? 'राम प्रसाद' : 'Ram Prasad',
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        status: 'scheduled',
        type: 'followup'
      },
      {
        id: '3',
        patientId: '3',
        patientName: language === 'hi' ? 'गीता शर्मा' : 'Geeta Sharma',
        date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        status: 'scheduled',
        type: 'routine'
      }
    ];

    setPatients(mockPatients);
    setVisits(mockVisits);
  }, [language]);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.village.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const todaysVisits = visits.filter(visit => {
    const today = new Date();
    return visit.date.toDateString() === today.toDateString();
  });

  const upcomingVisits = visits.filter(visit => {
    const today = new Date();
    return visit.date > today;
  });

  const addNote = () => {
    if (!selectedPatient || !newNote.trim()) return;

    setPatients(prev => prev.map(patient => 
      patient.id === selectedPatient.id 
        ? { ...patient, notes: [...patient.notes, newNote] }
        : patient
    ));

    setNewNote('');
    toast.success(language === 'hi' ? 'नोट जोड़ा गया' : 'Note added successfully');
  };

  const markVisitComplete = (visitId: string) => {
    setVisits(prev => prev.map(visit =>
      visit.id === visitId ? { ...visit, status: 'completed' as const } : visit
    ));
    toast.success(language === 'hi' ? 'विजिट पूर्ण हुई' : 'Visit marked as complete');
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'scheduled': return 'bg-blue-500';
      case 'missed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto p-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
              {language === 'hi' ? 'आशा वर्कर डैशबोर्ड' : 'ASHA Worker Dashboard'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'hi' 
                ? 'समुदायिक स्वास्थ्य सेवा प्रबंधन' 
                : 'Community Health Service Management'}
            </p>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {language === 'hi' ? 'कुल मरीज़' : 'Total Patients'}
                    </p>
                    <p className="text-2xl font-bold">{patients.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {language === 'hi' ? 'आज की विजिट' : 'Today\'s Visits'}
                    </p>
                    <p className="text-2xl font-bold">{todaysVisits.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {language === 'hi' ? 'उच्च जोखिम' : 'High Risk'}
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      {patients.filter(p => p.riskLevel === 'high').length}
                    </p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {language === 'hi' ? 'औसत एडहीरेंस' : 'Avg Adherence'}
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {Math.round(patients.reduce((acc, p) => acc + p.adherence, 0) / patients.length)}%
                    </p>
                  </div>
                  <Heart className="w-8 h-8 text-pink-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="patients">
              {language === 'hi' ? 'मरीज़ सूची' : 'Patient List'}
            </TabsTrigger>
            <TabsTrigger value="visits">
              {language === 'hi' ? 'विजिट शेड्यूल' : 'Visit Schedule'}
            </TabsTrigger>
            <TabsTrigger value="reports">
              {language === 'hi' ? 'रिपोर्ट्स' : 'Reports'}
            </TabsTrigger>
          </TabsList>

          {/* Patients Tab */}
          <TabsContent value="patients" className="space-y-6">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={language === 'hi' ? 'मरीज़ या गांव खोजें...' : 'Search patient or village...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                {language === 'hi' ? 'नया मरीज़' : 'Add Patient'}
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Patient List */}
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'hi' ? 'मरीज़ सूची' : 'Patient List'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {filteredPatients.map((patient) => (
                    <motion.div
                      key={patient.id}
                      layout
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedPatient?.id === patient.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' : ''
                      }`}
                      onClick={() => setSelectedPatient(patient)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {patient.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{patient.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {patient.age} {language === 'hi' ? 'वर्ष' : 'years'}, {patient.village}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getRiskColor(patient.riskLevel)}`} />
                          <Badge variant="outline" className="text-xs">
                            {patient.adherence}%
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{patient.condition}</span>
                        <span className="text-muted-foreground">
                          {language === 'hi' ? 'अगली विजिट:' : 'Next:'} {patient.nextVisit.toLocaleDateString()}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              {/* Patient Details */}
              {selectedPatient && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {language === 'hi' ? 'मरीज़ विवरण' : 'Patient Details'}
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Phone className="w-4 h-4 mr-2" />
                          {language === 'hi' ? 'कॉल' : 'Call'}
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          {language === 'hi' ? 'चैट' : 'Chat'}
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">{language === 'hi' ? 'उम्र' : 'Age'}</p>
                        <p className="text-lg">{selectedPatient.age} {language === 'hi' ? 'वर्ष' : 'years'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{language === 'hi' ? 'स्थिति' : 'Condition'}</p>
                        <p className="text-lg">{selectedPatient.condition}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{language === 'hi' ? 'गांव' : 'Village'}</p>
                        <p className="text-lg">{selectedPatient.village}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{language === 'hi' ? 'जोखिम स्तर' : 'Risk Level'}</p>
                        <Badge className={getRiskColor(selectedPatient.riskLevel)}>
                          {selectedPatient.riskLevel}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">{language === 'hi' ? 'एडहीरेंस' : 'Adherence'}</p>
                      <Progress value={selectedPatient.adherence} className="h-2" />
                      <p className="text-sm text-muted-foreground mt-1">{selectedPatient.adherence}%</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">{language === 'hi' ? 'वाइटल साइन्स' : 'Vital Signs'}</p>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <p className="font-medium">BP</p>
                          <p>{selectedPatient.vitals.bp}</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <p className="font-medium">HR</p>
                          <p>{selectedPatient.vitals.hr}</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <p className="font-medium">{language === 'hi' ? 'वजन' : 'Weight'}</p>
                          <p>{selectedPatient.vitals.weight}kg</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">{language === 'hi' ? 'नोट्स' : 'Notes'}</p>
                      <div className="space-y-2">
                        {selectedPatient.notes.map((note, index) => (
                          <div key={index} className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                            {note}
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex gap-2 mt-3">
                        <Textarea
                          placeholder={language === 'hi' ? 'नया नोट जोड़ें...' : 'Add new note...'}
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          className="flex-1"
                          rows={2}
                        />
                        <Button onClick={addNote} disabled={!newNote.trim()}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Visits Tab */}
          <TabsContent value="visits" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Today's Visits */}
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'hi' ? 'आज की विजिट्स' : 'Today\'s Visits'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {todaysVisits.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      {language === 'hi' ? 'आज कोई विजिट नहीं' : 'No visits scheduled for today'}
                    </p>
                  ) : (
                    todaysVisits.map((visit) => (
                      <div key={visit.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{visit.patientName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {visit.type} - {visit.date.toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(visit.status)}>
                            {visit.status}
                          </Badge>
                          {visit.status === 'scheduled' && (
                            <Button
                              size="sm"
                              onClick={() => markVisitComplete(visit.id)}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Upcoming Visits */}
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'hi' ? 'आगामी विजिट्स' : 'Upcoming Visits'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upcomingVisits.map((visit) => (
                    <div key={visit.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{visit.patientName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {visit.type} - {visit.date.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(visit.status)}>
                          {visit.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <MapPin className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'hi' ? 'मासिक रिपोर्ट' : 'Monthly Report'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>{language === 'hi' ? 'कुल विजिट्स' : 'Total Visits'}</span>
                      <span className="font-bold">24</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'hi' ? 'पूर्ण विजिट्स' : 'Completed Visits'}</span>
                      <span className="font-bold">22</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'hi' ? 'छूटी विजिट्स' : 'Missed Visits'}</span>
                      <span className="font-bold text-red-600">2</span>
                    </div>
                    <Progress value={92} className="h-2" />
                    <p className="text-sm text-muted-foreground text-center">92% {language === 'hi' ? 'पूर्णता दर' : 'completion rate'}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{language === 'hi' ? 'कार्य सूची' : 'Action Items'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-950/20 rounded">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span className="text-sm">{language === 'hi' ? 'गीता शर्मा - आपातकालीन जांच' : 'Geeta Sharma - Emergency checkup'}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-orange-50 dark:bg-orange-950/20 rounded">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span className="text-sm">{language === 'hi' ? 'सुनीता देवी - फॉलो-अप रिमाइंडर' : 'Sunita Devi - Follow-up reminder'}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded">
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">{language === 'hi' ? 'मासिक रिपोर्ट तैयार करें' : 'Prepare monthly report'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}