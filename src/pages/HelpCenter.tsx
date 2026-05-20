import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Search, Book, MessageCircle, FileText, User, Sprout, Activity } from 'lucide-react';

export default function HelpCenter() {
  const categories = [
    { icon: <Sprout className="w-8 h-8 text-green-500" />, title: 'Farm Management', desc: 'Learn how to add and manage your farms' },
    { icon: <Activity className="w-8 h-8 text-blue-500" />, title: 'Sensors & Devices', desc: 'Connecting and troubleshooting IoT devices' },
    { icon: <User className="w-8 h-8 text-purple-500" />, title: 'Account Settings', desc: 'Manage your profile and preferences' },
    { icon: <FileText className="w-8 h-8 text-orange-500" />, title: 'Billing & Subscriptions', desc: 'Payment methods and invoices' },
  ];

  const faqs = [
    { q: 'How do I add a new farm?', a: 'Navigate to the Farms page from your dashboard and click on the "Add Farm" button. Fill in the required details such as location, crop type, and area.' },
    { q: 'Can I monitor multiple sensors?', a: 'Yes! AgroSmart supports adding multiple sensors to a single farm. You can view aggregated data in the Analysis tab.' },
    { q: 'How does the Smart Eye feature work?', a: 'Smart Eye uses AI to analyze images of your crops and identify potential diseases or nutrient deficiencies. Simply upload a photo to get started.' },
    { q: 'Is my data secure?', a: 'We take data security very seriously. All your farm data is encrypted and stored securely. Please refer to our Privacy Policy for more details.' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Help Center – AgroSmart</title>
        <meta name="description" content="Get help and support for AgroSmart platform." />
      </Helmet>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-green-500/10 to-background pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-foreground mb-6"
          >
            How can we <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">help you?</span>
          </motion.h1>

        
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/5 transition-all cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-xl bg-background flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{cat.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{cat.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Quick answers to common questions about AgroSmart.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-card border border-border rounded-xl p-6"
              >
                <h4 className="text-lg font-semibold text-foreground mb-2 flex items-start gap-3">
                  <div className="mt-1 w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                  {faq.q}
                </h4>
                <p className="text-muted-foreground pl-5">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
