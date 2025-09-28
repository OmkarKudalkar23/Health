import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { 
  Brain, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Shield,
  Eye,
  RefreshCw
} from 'lucide-react';

interface MLPredictionWidgetProps {
  patientId?: string;
  userRole: 'patient' | 'family' | 'doctor';
  className?: string;
}

interface Prediction {
  id: string;
  type: 'risk_assessment' | 'adherence_prediction' | 'health_trend' | 'emergency_risk';
  title: string;
  description: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
  timestamp: Date;
  trend: 'improving' | 'stable' | 'declining';
}

const mockPredictions: Prediction[] = [
  {
    id: '1',
    type: 'risk_assessment',
    title: 'Cardiovascular Risk Assessment',
    description: 'Based on current vitals and medication adherence, moderate risk detected for cardiovascular events in next 30 days.',
    confidence: 78,
    severity: 'medium',
    recommendation: 'Increase monitoring frequency and consider lifestyle modifications',
    timestamp: new Date(),
    trend: 'stable'
  },
  {
    id: '2',
    type: 'adherence_prediction',
    title: 'Medication Adherence Forecast',
    description: 'AI predicts 85% adherence rate for next week based on current patterns and reminder effectiveness.',
    confidence: 92,
    severity: 'low',
    recommendation: 'Continue current reminder schedule, consider incentive program',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    trend: 'improving'
  },
  {
    id: '3',
    type: 'health_trend',
    title: 'Blood Sugar Trend Analysis',
    description: 'ML model indicates improving glucose control with 15% reduction in spikes over past 2 weeks.',
    confidence: 85,
    severity: 'low',
    recommendation: 'Continue current medication regimen and dietary habits',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    trend: 'improving'
  }
];

export default function MLPredictionWidget({ patientId, userRole, className }: MLPredictionWidgetProps) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading ML predictions
    const loadPredictions = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setPredictions(mockPredictions);
      setIsLoading(false);
    };

    loadPredictions();
  }, [patientId]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'risk_assessment': return <AlertTriangle className="w-4 h-4" />;
      case 'adherence_prediction': return <Shield className="w-4 h-4" />;
      case 'health_trend': return <Activity className="w-4 h-4" />;
      case 'emergency_risk': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  const refreshPredictions = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Simulate updated predictions
    setPredictions(prev => 
      prev.map(p => ({
        ...p,
        timestamp: new Date(),
        confidence: Math.max(70, Math.min(95, p.confidence + (Math.random() - 0.5) * 10))
      }))
    );
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Health Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI Health Insights
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={refreshPredictions}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {predictions.map((prediction) => (
          <motion.div
            key={prediction.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 border rounded-lg transition-all cursor-pointer hover:shadow-md
              ${selectedPrediction === prediction.id ? 'ring-2 ring-blue-500' : ''}
            `}
            onClick={() => setSelectedPrediction(
              selectedPrediction === prediction.id ? null : prediction.id
            )}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                {getTypeIcon(prediction.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium truncate">{prediction.title}</h4>
                  {getTrendIcon(prediction.trend)}
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">
                  {prediction.description}
                </p>
                
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getSeverityColor(prediction.severity)} size="sm">
                    {prediction.severity.toUpperCase()}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>Confidence:</span>
                    <Progress value={prediction.confidence} className="w-12 h-1" />
                    <span>{prediction.confidence}%</span>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  {formatTimeAgo(prediction.timestamp)}
                </div>
                
                {/* Expanded Content */}
                {selectedPrediction === prediction.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 pt-3 border-t"
                  >
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-medium text-muted-foreground">
                          AI Recommendation:
                        </span>
                        <p className="text-sm mt-1 p-2 bg-blue-50 rounded border border-blue-200">
                          {prediction.recommendation}
                        </p>
                      </div>
                      
                      {userRole === 'doctor' && (
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3 mr-1" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            Add to Notes
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        
        {predictions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No AI insights available at this time</p>
            <p className="text-sm">Check back later for predictive analysis</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}