import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Users, 
  User, 
  Stethoscope, 
  Heart,
  ChevronDown,
  Check
} from 'lucide-react';

interface RoleSwitcherProps {
  currentRole: 'patient' | 'family' | 'doctor' | 'asha';
  onRoleChange: (role: 'patient' | 'family' | 'doctor' | 'asha') => void;
}

const roles = [
  {
    id: 'patient' as const,
    name: 'Patient',
    icon: User,
    color: 'bg-blue-500',
    description: 'View personal health dashboard'
  },
  {
    id: 'family' as const,
    name: 'Family/Caregiver',
    icon: Users,
    color: 'bg-green-500',
    description: 'Manage family health & coordination'
  },
  {
    id: 'doctor' as const,
    name: 'Doctor',
    icon: Stethoscope,
    color: 'bg-purple-500',
    description: 'Professional healthcare provider'
  },
  {
    id: 'asha' as const,
    name: 'ASHA Worker',
    icon: Heart,
    color: 'bg-pink-500',
    description: 'Community health worker'
  }
];

export default function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentRoleData = roles.find(role => role.id === currentRole);

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          className="gap-2 bg-white/90 backdrop-blur-sm border-2 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <div className={`w-3 h-3 rounded-full ${currentRoleData?.color}`} />
          <span className="hidden sm:inline">{currentRoleData?.name}</span>
          <Badge variant="secondary" className="text-xs">DEMO</Badge>
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </Button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 w-80"
            >
              <Card className="p-4 bg-white/95 backdrop-blur-md border-2 shadow-xl">
                <div className="space-y-1 mb-3">
                  <h3 className="font-medium">Switch Role</h3>
                  <p className="text-sm text-muted-foreground">
                    Experience different user perspectives in demo mode
                  </p>
                </div>
                
                <div className="space-y-2">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    const isSelected = role.id === currentRole;
                    
                    return (
                      <motion.button
                        key={role.id}
                        onClick={() => {
                          onRoleChange(role.id);
                          setIsOpen(false);
                        }}
                        className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                          isSelected 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50 hover:bg-primary/5'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full ${role.color} flex items-center justify-center`}>
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{role.name}</span>
                              {isSelected && <Check className="h-4 w-4 text-primary" />}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {role.description}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Overlay to close when clicking outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[-1]" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}