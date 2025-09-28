import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Download,
  Filter,
  CreditCard,
  Receipt,
  PlusCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useApp } from '../contexts/AppContext';

interface ExpenseEntry {
  id: string;
  date: Date;
  category: 'medication' | 'consultation' | 'tests' | 'insurance' | 'others';
  amount: number;
  description: string;
  provider: string;
  status: 'paid' | 'pending' | 'insurance_claimed';
  receipt?: string;
}

const monthlyData = [
  { month: 'Jul', amount: 4200, medications: 2100, consultations: 1500, tests: 600 },
  { month: 'Aug', amount: 3800, medications: 2000, consultations: 1200, tests: 600 },
  { month: 'Sep', amount: 5200, medications: 2300, consultations: 2000, tests: 900 },
  { month: 'Oct', amount: 4600, medications: 2200, consultations: 1600, tests: 800 },
  { month: 'Nov', amount: 5800, medications: 2500, consultations: 2100, tests: 1200 },
  { month: 'Dec', amount: 5500, medications: 2400, consultations: 1900, tests: 1200 },
];

export default function ExpensesTimeline() {
  const { language } = useApp();

  const recentExpenses: ExpenseEntry[] = [
    {
      id: '1',
      date: new Date('2024-01-15'),
      category: 'medication',
      amount: 450,
      description: 'Metformin 500mg - 3 months supply',
      provider: 'Apollo Pharmacy',
      status: 'paid',
      receipt: 'RCP001'
    },
    {
      id: '2',
      date: new Date('2024-01-14'),
      category: 'consultation',
      amount: 800,
      description: 'Cardiology Consultation',
      provider: 'Dr. Rajesh Kumar',
      status: 'insurance_claimed',
      receipt: 'RCP002'
    },
    {
      id: '3',
      date: new Date('2024-01-12'),
      category: 'tests',
      amount: 1200,
      description: 'Comprehensive Health Checkup',
      provider: 'Metropolis Healthcare',
      status: 'pending',
      receipt: 'RCP003'
    },
    {
      id: '4',
      date: new Date('2024-01-10'),
      category: 'medication',
      amount: 320,
      description: 'Lisinopril 10mg - 2 months supply',
      provider: 'Medplus',
      status: 'paid',
      receipt: 'RCP004'
    },
    {
      id: '5',
      date: new Date('2024-01-08'),
      category: 'insurance',
      amount: 2400,
      description: 'Health Insurance Premium',
      provider: 'HDFC ERGO',
      status: 'paid',
      receipt: 'RCP005'
    }
  ];

  const totalCurrentMonth = monthlyData[monthlyData.length - 1]?.amount || 0;
  const previousMonth = monthlyData[monthlyData.length - 2]?.amount || 0;
  const monthlyChange = ((totalCurrentMonth - previousMonth) / previousMonth) * 100;

  const getCategoryColor = (category: string) => {
    const colors = {
      medication: 'bg-blue-100 text-blue-700',
      consultation: 'bg-green-100 text-green-700',
      tests: 'bg-yellow-100 text-yellow-700',
      insurance: 'bg-purple-100 text-purple-700',
      others: 'bg-gray-100 text-gray-700'
    };
    return colors[category as keyof typeof colors] || colors.others;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      paid: 'bg-green-100 text-green-700',
      pending: 'bg-orange-100 text-orange-700',
      insurance_claimed: 'bg-blue-100 text-blue-700'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'medication': return '💊';
      case 'consultation': return '🩺';
      case 'tests': return '🔬';
      case 'insurance': return '🛡️';
      default: return '📄';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === 'hi' ? 'इस महीने कुल' : 'Total This Month'}
                </p>
                <p className="text-2xl font-bold">{formatCurrency(totalCurrentMonth)}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              monthlyChange >= 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              {monthlyChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{Math.abs(monthlyChange).toFixed(1)}% vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === 'hi' ? 'औसत मासिक' : 'Average Monthly'}
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(monthlyData.reduce((acc, curr) => acc + curr.amount, 0) / monthlyData.length)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {language === 'hi' ? 'पिछले 6 महीनों का औसत' : 'Based on last 6 months'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === 'hi' ? 'लंबित भुगतान' : 'Pending Payments'}
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(recentExpenses.filter(e => e.status === 'pending').reduce((acc, curr) => acc + curr.amount, 0))}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {recentExpenses.filter(e => e.status === 'pending').length} {language === 'hi' ? 'लंबित आइटम' : 'pending items'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {language === 'hi' ? 'मासिक व्यय रुझान' : 'Monthly Expense Trend'}
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                {language === 'hi' ? 'फिल्टर' : 'Filter'}
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                {language === 'hi' ? 'डाउनलोड' : 'Export'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(value as number), 'Amount']} />
              <Bar dataKey="medications" stackId="a" fill="#3b82f6" name="Medications" />
              <Bar dataKey="consultations" stackId="a" fill="#10b981" name="Consultations" />
              <Bar dataKey="tests" stackId="a" fill="#f59e0b" name="Tests" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Expenses Timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              {language === 'hi' ? 'हाल के व्यय' : 'Recent Expenses'}
            </CardTitle>
            <Button variant="outline" size="sm">
              <PlusCircle className="w-4 h-4 mr-2" />
              {language === 'hi' ? 'व्यय जोड़ें' : 'Add Expense'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentExpenses.map((expense, index) => (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="text-2xl">{getCategoryIcon(expense.category)}</div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{expense.description}</h4>
                    <span className="font-bold">{formatCurrency(expense.amount)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{expense.provider}</span>
                    <span>•</span>
                    <span>{expense.date.toLocaleDateString()}</span>
                    {expense.receipt && (
                      <>
                        <span>•</span>
                        <span>#{expense.receipt}</span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(expense.category)} variant="secondary">
                      {expense.category}
                    </Badge>
                    <Badge className={getStatusColor(expense.status)} variant="secondary">
                      {expense.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}