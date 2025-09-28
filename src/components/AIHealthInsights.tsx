import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  Lightbulb,
  Activity,
  Heart
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface AIInsight {
  id: string;
  type: 'prediction' | 'recommendation' | 'alert' | 'achievement';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  category: 'vitals' | 'medication' | 'lifestyle' | 'risk';
  timestamp: Date;
  actionable?: boolean;
}

export default function AIHealthInsights() {
  const { language, vitals, medications } = useApp();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate AI insights based on mock data
  const generateInsights = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const mockInsights: AIInsight[] = [
        {
          id: '1',
          type: 'prediction',
          title: language === 'hi' ? 'रक्तचाप की भविष्यवाणी' : 'Blood Pressure Prediction',
          description: language === 'hi' 
            ? 'आपके रक्तचाप का रुझान बढ़ने की संभावना है। अगले 7 दिनों में सावधानी बरतें।'
            : 'Your blood pressure trend indicates a possible increase. Monitor closely over the next 7 days.',
          confidence: 78,
          impact: 'medium',
          category: 'vitals',
          timestamp: new Date(),
          actionable: true
        },
        {
          id: '2',
          type: 'recommendation',
          title: language === 'hi' ? 'दवा अनुपालन सुधार' : 'Medication Adherence Improvement',
          description: language === 'hi'
            ? 'आपकी दवा नियमितता 85% है। 95% तक पहुंचने के लिए रिमाइंडर सेट करें।'
            : 'Your medication adherence is 85%. Set reminders to reach the target of 95%.',
          confidence: 92,
          impact: 'high',
          category: 'medication',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          actionable: true
        },
        {
          id: '3',
          type: 'alert',
          title: language === 'hi' ? 'हृदय गति असामान्यता' : 'Heart Rate Pattern Alert',
          description: language === 'hi'
            ? 'आपकी हृदय गति में हल्की असामान्यता देखी गई है। डॉक्टर से संपर्क करें।'
            : 'Slight irregularity detected in your heart rate pattern. Consider consulting your doctor.',
          confidence: 85,
          impact: 'high',
          category: 'vitals',
          timestamp: new Date(Date.now() - 60 * 60 * 1000),
          actionable: true
        },
        {
          id: '4',
          type: 'achievement',
          title: language === 'hi' ? 'वजन नियंत्रण सफलता' : 'Weight Management Success',
          description: language === 'hi'
            ? 'बधाई हो! आपने पिछले महीने 2 किलो वजन कम किया है।'
            : 'Congratulations! You have successfully lost 2kg over the past month.',
          confidence: 100,
          impact: 'medium',
          category: 'lifestyle',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          id: '5',
          type: 'prediction',
          title: language === 'hi' ? 'डायबिटीज जोखिम स्कोर' : 'Diabetes Risk Assessment',
          description: language === 'hi'
            ? 'आपका वर्तमान जीवनशैली पैटर्न कम जोखिम दर्शाता है। बनाए रखें!'
            : 'Your current lifestyle pattern indicates low diabetes risk. Keep it up!',
          confidence: 88,
          impact: 'low',
          category: 'risk',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
        }
      ];
      
      setInsights(mockInsights);
      setIsGenerating(false);
    }, 2000);
  };

  useEffect(() => {
    generateInsights();
  }, [language]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'prediction': return <Brain className="w-4 h-4" />;
      case 'recommendation': return <Lightbulb className="w-4 h-4" />;
      case 'alert': return <AlertTriangle className="w-4 h-4" />;
      case 'achievement': return <CheckCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getInsightColor = (type: string, impact: string) => {
    if (type === 'alert') return 'bg-red-100 text-red-700 border-red-200';
    if (type === 'achievement') return 'bg-green-100 text-green-700 border-green-200';
    if (impact === 'high') return 'bg-orange-100 text-orange-700 border-orange-200';
    if (impact === 'medium') return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getImpactBadge = (impact: string) => {
    const colors = {
      high: 'bg-red-500 text-white',
      medium: 'bg-yellow-500 text-white',
      low: 'bg-green-500 text-white'
    };
    return colors[impact as keyof typeof colors] || colors.low;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'vitals': return <Heart className="w-3 h-3" />;
      case 'medication': return <Activity className="w-3 h-3" />;
      case 'lifestyle': return <TrendingUp className="w-3 h-3" />;
      case 'risk': return <AlertTriangle className="w-3 h-3" />;
      default: return <Activity className="w-3 h-3" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            {language === 'hi' ? 'AI स्वास्थ्य अंतर्दृष्टि' : 'AI Health Insights'}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={generateInsights}
            disabled={isGenerating}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            {language === 'hi' ? 'रीफ्रेश' : 'Refresh'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isGenerating ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : (
          insights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border-2 ${getInsightColor(insight.type, insight.impact)}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {getInsightIcon(insight.type)}
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{insight.title}</h4>
                    <div className="flex items-center gap-2">
                      <Badge className={getImpactBadge(insight.impact)} variant="secondary">
                        {insight.impact.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="text-xs gap-1">
                        {getCategoryIcon(insight.category)}
                        {insight.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm opacity-90">{insight.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs">
                      <span>{language === 'hi' ? 'विश्वसनीयता:' : 'Confidence:'}</span>
                      <div className="flex items-center gap-1">
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${insight.confidence}%` }}
                            transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                            className="h-full bg-current"
                          />
                        </div>
                        <span>{insight.confidence}%</span>
                      </div>
                    </div>
                    
                    <span className="text-xs opacity-70">
                      {insight.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  {insight.actionable && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                    >
                      {language === 'hi' ? 'कार्य करें' : 'Take Action'}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
        
        {!isGenerating && insights.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>{language === 'hi' ? 'कोई अंतर्दृष्टि उपलब्ध नहीं' : 'No insights available'}</p>
            <Button variant="outline" onClick={generateInsights} className="mt-2">
              {language === 'hi' ? 'अंतर्दृष्टि जेनरेट करें' : 'Generate Insights'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}