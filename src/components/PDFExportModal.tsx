import { useState } from 'react';
import { motion } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { 
  Download, 
  FileText, 
  Activity, 
  Pill, 
  DollarSign, 
  Calendar,
  User,
  Shield,
  Clock
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface PDFExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ExportSection {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  selected: boolean;
  size: string;
}

export default function PDFExportModal({ isOpen, onClose }: PDFExportModalProps) {
  const { language, user } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportSections, setExportSections] = useState<ExportSection[]>([
    {
      id: 'profile',
      name: language === 'hi' ? 'व्यक्तिगत जानकारी' : 'Personal Information',
      description: language === 'hi' ? 'बुनियादी प्रोफाइल विवरण' : 'Basic profile details',
      icon: <User className="w-4 h-4" />,
      selected: true,
      size: '1 page'
    },
    {
      id: 'vitals',
      name: language === 'hi' ? 'स्वास्थ्य डेटा' : 'Health Vitals',
      description: language === 'hi' ? 'रक्तचाप, हृदय गति, वजन' : 'Blood pressure, heart rate, weight',
      icon: <Activity className="w-4 h-4" />,
      selected: true,
      size: '2-3 pages'
    },
    {
      id: 'medications',
      name: language === 'hi' ? 'दवा इतिहास' : 'Medication History',
      description: language === 'hi' ? 'वर्तमान और पिछली दवाएं' : 'Current and past medications',
      icon: <Pill className="w-4 h-4" />,
      selected: true,
      size: '2 pages'
    },
    {
      id: 'expenses',
      name: language === 'hi' ? 'वित्तीय रिपोर्ट' : 'Financial Report',
      description: language === 'hi' ? 'चिकित्सा व्यय और बिल' : 'Medical expenses and bills',
      icon: <DollarSign className="w-4 h-4" />,
      selected: false,
      size: '1-2 pages'
    },
    {
      id: 'appointments',
      name: language === 'hi' ? 'अपॉइंटमेंट रिकॉर्ड' : 'Appointment Records',
      description: language === 'hi' ? 'डॉक्टर मिलने का इतिहास' : 'Doctor visit history',
      icon: <Calendar className="w-4 h-4" />,
      selected: false,
      size: '1 page'
    },
    {
      id: 'insurance',
      name: language === 'hi' ? 'बीमा दावे' : 'Insurance Claims',
      description: language === 'hi' ? 'बीमा दावे और प्राधिकरण' : 'Insurance claims and authorizations',
      icon: <Shield className="w-4 h-4" />,
      selected: false,
      size: '1 page'
    }
  ]);

  const toggleSection = (sectionId: string) => {
    setExportSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? { ...section, selected: !section.selected }
          : section
      )
    );
  };

  const selectAll = () => {
    setExportSections(prev =>
      prev.map(section => ({ ...section, selected: true }))
    );
  };

  const deselectAll = () => {
    setExportSections(prev =>
      prev.map(section => ({ ...section, selected: false }))
    );
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    
    // Simulate PDF generation process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock PDF download
    const selectedSections = exportSections.filter(s => s.selected);
    const filename = `health-report-${new Date().toISOString().split('T')[0]}.pdf`;
    
    // In a real app, this would generate and download an actual PDF
    console.log('Generating PDF with sections:', selectedSections.map(s => s.id));
    
    // Create a mock download link
    const link = document.createElement('a');
    link.href = '#'; // In real app, this would be the PDF blob URL
    link.download = filename;
    link.click();
    
    setIsGenerating(false);
    onClose();
  };

  const selectedCount = exportSections.filter(s => s.selected).length;
  const estimatedPages = exportSections
    .filter(s => s.selected)
    .reduce((acc, section) => {
      const pages = parseInt(section.size.split('-')[0]) || 1;
      return acc + pages;
    }, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {language === 'hi' ? 'PDF रिपोर्ट एक्सपोर्ट करें' : 'Export PDF Report'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Export Summary */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{selectedCount}</div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'hi' ? 'चयनित सेक्शन' : 'Selected Sections'}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{estimatedPages}</div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'hi' ? 'अनुमानित पेज' : 'Estimated Pages'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section Selection Controls */}
          <div className="flex items-center justify-between">
            <h3 className="font-medium">
              {language === 'hi' ? 'रिपोर्ट सेक्शन चुनें' : 'Select Report Sections'}
            </h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={selectAll}>
                {language === 'hi' ? 'सभी चुनें' : 'Select All'}
              </Button>
              <Button variant="outline" size="sm" onClick={deselectAll}>
                {language === 'hi' ? 'सभी हटाएं' : 'Deselect All'}
              </Button>
            </div>
          </div>

          {/* Sections List */}
          <div className="space-y-3">
            {exportSections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  section.selected 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={section.selected}
                    onChange={() => toggleSection(section.id)}
                  />
                  
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {section.icon}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium">{section.name}</h4>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </div>
                  
                  <Badge variant="outline" className="text-xs">
                    {section.size}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Export Options */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <h4 className="font-medium">
                {language === 'hi' ? 'एक्सपोर्ट विकल्प' : 'Export Options'}
              </h4>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {language === 'hi' ? 'डेट रेंज:' : 'Date Range:'}
                  </span>
                  <span>Last 6 months</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {language === 'hi' ? 'फॉर्मेट:' : 'Format:'}
                  </span>
                  <span>PDF</span>
                </div>
              </div>
              
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  {language === 'hi' 
                    ? 'यह रिपोर्ट आपकी व्यक्तिगत स्वास्थ्य जानकारी है। कृपया सुरक्षित रूप से संग्रहीत करें।'
                    : 'This report contains your personal health information. Please store securely.'
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={isGenerating}>
              {language === 'hi' ? 'रद्द करें' : 'Cancel'}
            </Button>
            <Button 
              onClick={generatePDF} 
              disabled={selectedCount === 0 || isGenerating}
              className="gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {language === 'hi' ? 'जेनरेट हो रहा है...' : 'Generating...'}
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  {language === 'hi' ? 'PDF डाउनलोड करें' : 'Download PDF'}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}