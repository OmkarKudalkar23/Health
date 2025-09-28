import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { 
  Heart, 
  Smartphone, 
  Shield, 
  Users, 
  BarChart3, 
  Clock, 
  ArrowRight, 
  Star,
  ChevronLeft,
  ChevronRight,
  Play
} from 'lucide-react';

const getFeatures = (t: any) => [
  {
    icon: Heart,
    title: t('landing.features.smartHealth.title'),
    description: t('landing.features.smartHealth.description'),
    gradient: 'from-red-500/10 to-pink-500/10'
  },
  {
    icon: Smartphone,
    title: t('landing.features.medicationManagement.title'),
    description: t('landing.features.medicationManagement.description'),
    gradient: 'from-blue-500/10 to-cyan-500/10'
  },
  {
    icon: Shield,
    title: t('landing.features.familyCare.title'),
    description: t('landing.features.familyCare.description'),
    gradient: 'from-green-500/10 to-emerald-500/10'
  },
  {
    icon: Users,
    title: t('landing.features.doctorIntegration.title'),
    description: t('landing.features.doctorIntegration.description'),
    gradient: 'from-purple-500/10 to-indigo-500/10'
  },
  {
    icon: BarChart3,
    title: t('landing.features.healthAnalytics.title'),
    description: t('landing.features.healthAnalytics.description'),
    gradient: 'from-orange-500/10 to-amber-500/10'
  },
  {
    icon: Clock,
    title: t('landing.features.support.title'),
    description: t('landing.features.support.description'),
    gradient: 'from-teal-500/10 to-cyan-500/10'
  }
];

const getTestimonials = (t: any) => [
  {
    name: t('landing.testimonials.items.rajesh.name'),
    role: t('landing.testimonials.items.rajesh.role'),
    content: t('landing.testimonials.items.rajesh.content'),
    rating: 5,
    avatar: '👨‍💼'
  },
  {
    name: t('landing.testimonials.items.priya.name'),
    role: t('landing.testimonials.items.priya.role'),
    content: t('landing.testimonials.items.priya.content'),
    rating: 5,
    avatar: '👩‍⚕️'
  },
  {
    name: t('landing.testimonials.items.sunita.name'),
    role: t('landing.testimonials.items.sunita.role'),
    content: t('landing.testimonials.items.sunita.content'),
    rating: 5,
    avatar: '👩‍🦳'
  },
  {
    name: t('landing.testimonials.items.amit.name'),
    role: t('landing.testimonials.items.amit.role'),
    content: t('landing.testimonials.items.amit.content'),
    rating: 5,
    avatar: '👨‍🔬'
  }
];

export default function LandingPage() {
  const { t } = useTranslation();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  const features = getFeatures(t);
  const testimonials = getTestimonials(t);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Arogya Sahayak</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:flex items-center gap-6"
            >
              <a href="#features" className="text-sm hover:text-primary transition-colors">{t('navigation.features')}</a>
              <a href="#testimonials" className="text-sm hover:text-primary transition-colors">{t('navigation.testimonials')}</a>
              <a href="#about" className="text-sm hover:text-primary transition-colors">{t('navigation.about')}</a>
              <Link to="/onboarding">
                <Button>{t('landing.hero.startTrial')}</Button>
              </Link>
            </motion.div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                {t('landing.hero.badge')}
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                {t('landing.hero.title')}
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
                {t('landing.hero.subtitle')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/onboarding">
                  <Button size="lg" className="group">
                    {t('landing.hero.startTrial')}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                
                <Button variant="outline" size="lg" className="group">
                  <Play className="w-4 h-4 mr-2" />
                  {t('landing.hero.watchDemo')}
                </Button>
              </div>
              
              <div className="flex items-center gap-6 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">10K+</div>
                  <div className="text-sm text-muted-foreground">{t('landing.hero.stats.users')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">95%</div>
                  <div className="text-sm text-muted-foreground">{t('landing.hero.stats.adherence')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">₹50L+</div>
                  <div className="text-sm text-muted-foreground">{t('landing.hero.stats.savings')}</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-6">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1706700373837-cec87ddeedad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwdGVjaG5vbG9neSUyMG1vZGVybnxlbnwxfHx8fDE3NTcxODQ0NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Healthcare Technology"
                  className="w-full h-80 object-cover rounded-xl"
                />
                
                {/* Floating Cards */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg p-3 border"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      ✓
                    </div>
                    <div className="text-xs">
                      <div className="font-medium">Medication Taken</div>
                      <div className="text-muted-foreground">9:00 AM</div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-3 border"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Heart className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-xs">
                      <div className="font-medium">BP: 120/80</div>
                      <div className="text-muted-foreground">Normal</div>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-green-500/20 rounded-2xl transform rotate-3"></div>
              <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/20 to-pink-500/20 rounded-2xl transform -rotate-2"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 mb-4">
              {t('landing.features.badge')}
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {t('landing.features.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('landing.features.subtitle')}
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="relative h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient}`}></div>
                  <CardContent className="relative p-6 h-full flex flex-col">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-md">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground flex-1">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 mb-4">
              {t('landing.testimonials.badge')}
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {t('landing.testimonials.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('landing.testimonials.subtitle')}
            </p>
          </motion.div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="relative overflow-hidden shadow-2xl border-0">
              <CardContent className="p-0">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="p-8 md:p-12"
                >
                  <div className="flex items-center gap-2 mb-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <blockquote className="text-xl md:text-2xl font-medium mb-6 leading-relaxed">
                    "{testimonials[currentTestimonial].content}"
                  </blockquote>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{testimonials[currentTestimonial].avatar}</div>
                    <div>
                      <div className="font-bold">{testimonials[currentTestimonial].name}</div>
                      <div className="text-muted-foreground">{testimonials[currentTestimonial].role}</div>
                    </div>
                  </div>
                </motion.div>
              </CardContent>
              
              {/* Navigation */}
              <div className="absolute top-1/2 -translate-y-1/2 left-4">
                <Button variant="outline" size="icon" onClick={prevTestimonial}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 right-4">
                <Button variant="outline" size="icon" onClick={nextTestimonial}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
            
            {/* Dots Indicator */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentTestimonial ? 'bg-primary w-6' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-white"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              {t('landing.cta.title')}
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              {t('landing.cta.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/onboarding">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 group">
                  {t('landing.cta.getStarted')}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                {t('landing.cta.scheduleDemo')}
              </Button>
            </div>
            
            <div className="mt-8 text-blue-100">
              <p className="text-sm" dangerouslySetInnerHTML={{ __html: t('landing.cta.features') }}></p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Arogya Sahayak</span>
              </div>
              <p className="text-slate-400">
                {t('landing.footer.description')}
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">{t('landing.footer.product')}</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">{t('navigation.features')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">{t('landing.footer.support')}</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('navigation.contact')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('common.privacy')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('common.terms')}</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">{t('landing.footer.company')}</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">{t('navigation.about')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 HealthCare+. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}