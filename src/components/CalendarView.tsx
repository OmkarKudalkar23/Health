import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ChevronLeft, ChevronRight, Pill, Calendar, Activity } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'medication' | 'appointment' | 'reading';
  time: string;
  completed?: boolean;
}

interface CalendarViewProps {
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
}

export default function CalendarView({ selectedDate = new Date(), onDateChange }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate);
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  // Mock events data
  const events: Record<string, CalendarEvent[]> = {
    '2024-01-15': [
      { id: '1', title: 'Metformin 500mg', type: 'medication', time: '08:00', completed: true },
      { id: '2', title: 'Blood Pressure Check', type: 'reading', time: '09:00', completed: true },
      { id: '3', title: 'Lisinopril 10mg', type: 'medication', time: '20:00', completed: false },
    ],
    '2024-01-16': [
      { id: '4', title: 'Dr. Kumar Consultation', type: 'appointment', time: '14:00', completed: false },
      { id: '5', title: 'Metformin 500mg', type: 'medication', time: '08:00', completed: false },
      { id: '6', title: 'Weight Measurement', type: 'reading', time: '07:30', completed: false },
    ],
    '2024-01-17': [
      { id: '7', title: 'Metformin 500mg', type: 'medication', time: '08:00', completed: false },
      { id: '8', title: 'Lisinopril 10mg', type: 'medication', time: '20:00', completed: false },
    ],
  };

  const getWeekDates = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const getMonthDates = (date: Date) => {
    const month = [];
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    // Add days from previous month to fill the week
    const startPadding = firstDay.getDay();
    for (let i = startPadding - 1; i >= 0; i--) {
      const day = new Date(firstDay);
      day.setDate(firstDay.getDate() - i - 1);
      month.push(day);
    }
    
    // Add all days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      month.push(new Date(date.getFullYear(), date.getMonth(), i));
    }
    
    // Add days from next month to fill the week
    const endPadding = 42 - month.length; // 6 weeks * 7 days
    for (let i = 1; i <= endPadding; i++) {
      const day = new Date(lastDay);
      day.setDate(lastDay.getDate() + i);
      month.push(day);
    }
    
    return month;
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'medication': return <Pill className="w-3 h-3" />;
      case 'appointment': return <Calendar className="w-3 h-3" />;
      case 'reading': return <Activity className="w-3 h-3" />;
      default: return <Calendar className="w-3 h-3" />;
    }
  };

  const getEventColor = (type: string, completed?: boolean) => {
    const baseColors = {
      medication: completed ? 'bg-blue-100 text-blue-700' : 'bg-blue-500 text-white',
      appointment: completed ? 'bg-green-100 text-green-700' : 'bg-green-500 text-white',
      reading: completed ? 'bg-purple-100 text-purple-700' : 'bg-purple-500 text-white',
    };
    return baseColors[type as keyof typeof baseColors] || 'bg-gray-500 text-white';
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
    onDateChange?.(newDate);
  };

  const dates = viewMode === 'week' ? getWeekDates(currentDate) : getMonthDates(currentDate);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {viewMode === 'week' ? 'Weekly' : 'Monthly'} Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex border rounded-lg p-1">
              <Button
                variant={viewMode === 'week' ? 'default' : 'ghost'}
                size="sm"
                className="h-8 px-3"
                onClick={() => setViewMode('week')}
              >
                Week
              </Button>
              <Button
                variant={viewMode === 'month' ? 'default' : 'ghost'}
                size="sm"
                className="h-8 px-3"
                onClick={() => setViewMode('month')}
              >
                Month
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigateDate('prev')}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h3 className="font-medium">
              {currentDate.toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric',
                ...(viewMode === 'week' && { day: 'numeric' })
              })}
            </h3>
            <Button variant="outline" size="icon" onClick={() => navigateDate('next')}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const today = new Date();
              setCurrentDate(today);
              onDateChange?.(today);
            }}
          >
            Today
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className={`grid gap-2 ${viewMode === 'week' ? 'grid-cols-7' : 'grid-cols-7'}`}>
          {/* Day Headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}
          
          {/* Calendar Days */}
          {dates.map((date, index) => {
            const dateKey = formatDateKey(date);
            const dayEvents = events[dateKey] || [];
            const isToday = date.toDateString() === new Date().toDateString();
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                className={`p-2 min-h-20 border rounded-lg cursor-pointer transition-colors hover:bg-accent/50 ${
                  isToday ? 'bg-primary/10 border-primary' : ''
                } ${!isCurrentMonth && viewMode === 'month' ? 'opacity-50' : ''}`}
                onClick={() => {
                  setCurrentDate(date);
                  onDateChange?.(date);
                }}
              >
                <div className={`text-sm font-medium mb-1 ${isToday ? 'text-primary' : ''}`}>
                  {date.getDate()}
                </div>
                
                <div className="space-y-1">
                  {dayEvents.slice(0, viewMode === 'week' ? 10 : 3).map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`text-xs p-1 rounded flex items-center gap-1 ${getEventColor(event.type, event.completed)}`}
                    >
                      {getEventIcon(event.type)}
                      <span className="truncate">{event.title}</span>
                    </motion.div>
                  ))}
                  
                  {dayEvents.length > (viewMode === 'week' ? 10 : 3) && (
                    <div className="text-xs text-muted-foreground">
                      +{dayEvents.length - (viewMode === 'week' ? 10 : 3)} more
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-xs">Medication</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-xs">Appointment</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span className="text-xs">Health Reading</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}