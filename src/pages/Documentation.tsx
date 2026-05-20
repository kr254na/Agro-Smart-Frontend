import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { BookOpen, Terminal, Code, Cpu, Database, Settings, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Documentation() {
  const sections = [
    {
      title: "Getting Started",
      icon: <BookOpen className="w-6 h-6 text-green-500" />,
      items: [
        "Introduction to AgroSmart",
        "Quick Start Guide",
        "System Requirements",
        "Installation Guide"
      ]
    },
    {
      title: "Hardware Integration",
      icon: <Cpu className="w-6 h-6 text-blue-500" />,
      items: [
        "Supported Sensors",
        "Connecting Arduino/Raspberry Pi",
        "Calibration Guide",
        "Troubleshooting Hardware"
      ]
    },
    {
      title: "API Reference",
      icon: <Code className="w-6 h-6 text-purple-500" />,
      items: [
        "Authentication",
        "REST API Endpoints",
        "WebSocket Real-time Data",
        "Rate Limits"
      ]
    },
    {
      title: "Data & Analytics",
      icon: <Database className="w-6 h-6 text-orange-500" />,
      items: [
        "Understanding Dashboards",
        "Exporting Data (CSV/PDF)",
        "Custom Reports",
        "AI Crop Analysis"
      ]
    },
    {
      title: "Configuration",
      icon: <Settings className="w-6 h-6 text-slate-500" />,
      items: [
        "User Roles & Permissions",
        "Alerts & Notifications",
        "Account Settings",
        "Billing Management"
      ]
    },
    {
      title: "Developer Tools",
      icon: <Terminal className="w-6 h-6 text-red-500" />,
      items: [
        "SDKs and Libraries",
        "Webhooks",
        "Custom Integrations",
        "Changelog"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Documentation – AgroSmart</title>
        <meta name="description" content="AgroSmart platform documentation and guides." />
      </Helmet>



      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-foreground mb-6"
          >
            AgroSmart <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Documentation</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Everything you need to know to build, integrate, and manage your smart farms with AgroSmart.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all hover:border-green-500/50"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-background rounded-lg border border-border">
                  {section.icon}
                </div>
                <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
              </div>
              <ul className="space-y-3">
                {section.items.map((item, itemIdx) => (
                  <li key={itemIdx}>
                    <Link to="#" className="group flex items-center justify-between text-muted-foreground hover:text-green-400 transition-colors">
                      <span className="text-sm">{item}</span>
                      <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
