import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, Users, ShoppingCart, 
  Activity, ArrowRight, 
  Database, Zap, Code, Cpu, Cloud, BarChart3, Lightbulb,
  Brain, Sprout,
  Linkedin, Instagram
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';

export default function About() {

  const objectives = [
    {
      icon: TrendingUp,
      title: 'Improve Farm Productivity',
      description: 'Enhance farm efficiency and maximize yields through data-driven insights and optimization.',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Brain,
      title: 'AI Disease Detection',
      description: 'Reduce crop loss using advanced AI algorithms to detect diseases early and prevent spread.',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: Users,
      title: 'Farmer Community',
      description: 'Provide farmers a platform to communicate, share knowledge, and learn from each other.',
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: ShoppingCart,
      title: 'Digital Marketplace',
      description: 'Create a seamless marketplace for buying and selling agricultural products directly.',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      icon: Activity,
      title: 'IoT Sensor Integration',
      description: 'Enable real-time monitoring through IoT sensors for soil, weather, and crop conditions.',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      icon: BarChart3,
      title: 'Data-Driven Decisions',
      description: 'Empower farmers with analytics and insights to make informed agricultural decisions.',
      color: 'from-indigo-500 to-purple-600'
    }
  ];

  const techStack = [
    { name: 'React.js', icon: Code, description: 'Modern UI Framework', color: 'text-cyan-400' },
    { name: 'Spring Boot', icon: Cpu, description: 'Backend Runtime', color: 'text-green-400' },
    { name: 'MySQL', icon: Database, description: 'SQL Database', color: 'text-emerald-400' },
    { name: 'Python/TensorFlow', icon: Brain, description: 'AI/ML Engine', color: 'text-purple-400' },
    { name: 'ESP32/Arduino', icon: Zap, description: 'IoT Sensors', color: 'text-orange-400' },
    { name: 'OpenWeather API', icon: Cloud, description: 'Weather Data', color: 'text-blue-400' }
  ];

  const impacts = [
    { value: '200+', label: 'Farms Monitored', icon: Sprout, color: 'from-green-500 to-emerald-600' },
    { value: '50%', label: 'Reduction in Crop Loss', icon: TrendingUp, color: 'from-blue-500 to-cyan-600' },
    { value: '1000+', label: 'Farmers in Community', icon: Users, color: 'from-purple-500 to-pink-600' },
    { value: '24/7', label: 'Real-Time Monitoring', icon: Activity, color: 'from-orange-500 to-red-600' }
  ];

  const team = [
    {
      name: 'Akshat Sharma',
      role: 'Frontend Developer',
      avatar: 'AS',
      linkedin: '#',
      instagram: '#',
      color: 'from-green-400 to-emerald-600'
    },
    {
      name: 'Pushpesh Srivastava',
      role: 'AI/ML Engineer',
      avatar: 'PS',
      linkedin: '#',
      instagram: '#',
      color: 'from-purple-400 to-pink-600'
    },
    {
      name: 'Krishna Agarwal',
      role: 'Backend Developer',
      avatar: 'KA',
      linkedin: '#',
      instagram: '#',
      color: 'from-cyan-400 to-blue-600'
    },
    {
      name: 'Abhay Verma',
      role: 'IoT Engineer',
      avatar: 'AV',
      linkedin: '#',
      instagram: '#',
      color: 'from-orange-400 to-red-600'
    }
  ];

  return (
    <div className="pt-20 bg-gray-950 text-white">

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(72, 216, 125) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="mb-6 bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
                About AgroSmart
              </Badge>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Empowering{' '}
                <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400 bg-clip-text text-transparent">
                  Farmers
                </span>
                <br />
                with{' '}
                <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400 bg-clip-text text-transparent">
                  Technology & Data
                </span>
              </h1>

              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                AgroSmart combines IoT, AI, and community support to help farmers make smarter, 
                more profitable decisions for sustainable agriculture.
              </p>

              {/* CTA Button */}
              <Link to="/register" className="px-8 py-4 bg-gradient-to-r from-green-500 cursor-pointer to-emerald-600 text-white rounded-lg hover:shadow-xl hover:shadow-green-500/50 transition-all text-lg font-semibold flex items-center justify-center gap-2">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            {/* Right Side - Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1744230673231-865d54a0aba4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwYWdyaWN1bHR1cmUlMjBpb3QlMjBkZXZpY2VzJTIwZmllbGR8ZW58MXx8fHwxNzY5ODcwODE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="IoT Agriculture Technology"
                className="rounded-2xl shadow-2xl shadow-green-500/20 border border-green-500/20"
              />
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-green-500/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1752775312083-1cefe2f93358?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFudCUyMGdyb3d0aCUyMHNlZWRsaW5nJTIwZ3JlZW4lMjBzdXN0YWluYWJsZXxlbnwxfHx8fDE3Njk4NzA4MjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Plant Growth"
                  className="rounded-2xl shadow-2xl shadow-green-500/10 border border-green-500/20"
                />
                {/* Floating Icon */}
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute top-8 -right-6 w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-green-500/50"
                >
                  <Lightbulb className="w-10 h-10 text-white" />
                </motion.div>
              </div>

              <div>
                <Badge className="mb-4 bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
                  Our Vision
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Building a{' '}
                  <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                    Sustainable Future
                  </span>
                </h2>
                <p className="text-xl text-gray-400 leading-relaxed mb-6">
                  To create a sustainable, technology-driven agriculture ecosystem where farmers can 
                  monitor, analyze, and optimize their farms with real-time data and actionable insights.
                </p>
                <p className="text-lg text-gray-500 leading-relaxed">
                  We envision a world where every farmer, regardless of farm size, has access to 
                  cutting-edge technology that helps them increase yields, reduce waste, and build 
                  a more sustainable agricultural future for generations to come.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
              Our Objectives
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What We Aim to Achieve</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Comprehensive goals designed to revolutionize agriculture through technology and community
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {objectives.map((objective, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-gray-900/50 border-gray-800 hover:border-green-500/50 transition-all h-full group hover:shadow-xl hover:shadow-green-500/20 hover:scale-105 cursor-pointer">
                  <CardHeader>
                    <div className={`w-16 h-16 bg-gradient-to-br ${objective.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <objective.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-white">{objective.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400">{objective.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
              Technology Stack
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Technology Behind{' '}
              <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                AgroSmart
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Built with cutting-edge technologies to deliver reliable, scalable, and intelligent solutions
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {techStack.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-gray-900/50 border-gray-800 hover:border-green-500/50 transition-all group hover:scale-105 cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 bg-gray-800/50 rounded-xl flex items-center justify-center group-hover:bg-green-500/20 transition-all">
                        <tech.icon className={`w-7 h-7 ${tech.color}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{tech.name}</h3>
                        <p className="text-sm text-gray-400">{tech.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
              Our Impact
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why AgroSmart Matters</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Farmers gain insights on soil health, crop growth, and weather, leading to higher yields 
              and more sustainable practices
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {impacts.map((impact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-gray-900/50 border-gray-800 hover:border-green-500/50 transition-all text-center group hover:scale-105 cursor-pointer">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 bg-gradient-to-br ${impact.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      <impact.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-5xl font-bold text-white mb-2">{impact.value}</h3>
                    <p className="text-gray-400">{impact.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Additional Impact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30 max-w-4xl mx-auto">
              <CardContent className="p-8 text-center">
                <img 
                  src="https://images.unsplash.com/photo-1754341669902-4808578cada0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwYW5hbHl0aWNzJTIwZmFybWluZyUyMGNoYXJ0c3xlbnwxfHx8fDE3Njk4NzA4MjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Analytics Dashboard"
                  className="w-full h-64 object-cover rounded-xl mb-6"
                />
                <h3 className="text-2xl font-bold text-white mb-4">
                  Transforming Agriculture Through Data
                </h3>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                  Our platform has helped farmers increase productivity by providing real-time insights, 
                  reducing resource waste, and enabling proactive decision-making based on accurate predictions.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
              Our Team
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Meet the Team</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Passionate experts dedicated to revolutionizing agriculture with technology
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-gray-900/50 border-gray-800 hover:border-green-500/50 transition-all group hover:scale-105 cursor-pointer text-center">
                  <CardContent className="p-6">
                    <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-gray-800 group-hover:border-green-500/50 transition-all">
                      <AvatarFallback className={`bg-gradient-to-br ${member.color} text-white text-2xl`}>
                        {member.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{member.role}</p>
                    
                    {/* Social Links */}
                    <div className="flex gap-3 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <a 
                        href={member.linkedin}
                        className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-500/20 transition-all"
                      >
                        <Linkedin className="w-4 h-4 text-gray-400 hover:text-green-400" />
                      </a>
                      <a 
                        href={member.instagram}
                        className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-500/20 transition-all"
                      >
                        <Instagram className="w-4 h-4 text-gray-400 hover:text-green-400" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20"></div>
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(72, 216, 125) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}
        ></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Ready to Take Your{' '}
              <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Farming to the Next Level?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Join thousands of farmers who are already using AgroSmart to increase yields, 
              reduce waste, and build a sustainable future.
            </p>
            <Link to="/register" className="px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-2xl hover:shadow-green-500/50 transition-all text-xl font-bold inline-flex items-center gap-3">
              Create Free Account
              <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
