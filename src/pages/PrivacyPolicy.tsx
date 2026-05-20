import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <Helmet>
        <title>Privacy Policy – AgroSmart</title>
        <meta name="description" content="Privacy policy for AgroSmart platform." />
      </Helmet>

      <div className="max-w-4xl mx-auto mt-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border">
            <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-green-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1">Privacy Policy</h1>
              <p className="text-muted-foreground">Last updated: May 21, 2026</p>
            </div>
          </div>

          <div className="prose prose-emerald dark:prose-invert max-w-none text-muted-foreground">
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Introduction</h2>
            <p className="mb-4 leading-relaxed">
              At AgroSmart, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our application. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. Collection of Your Information</h2>
            <p className="mb-4 leading-relaxed">
              We may collect information about you in a variety of ways. The information we may collect on the Site includes:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong className="text-foreground">Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information.</li>
              <li><strong className="text-foreground">Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
              <li><strong className="text-foreground">IoT Data:</strong> Data collected from sensors and devices connected to your farm, including temperature, humidity, soil moisture, and image data uploaded for analysis.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. Use of Your Information</h2>
            <p className="mb-4 leading-relaxed">
              Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Create and manage your account.</li>
              <li>Process transactions and send related information, including confirmations and invoices.</li>
              <li>Provide personalized agricultural insights and analytics based on your farm data.</li>
              <li>Improve our AI models for crop disease detection (data is anonymized).</li>
              <li>Respond to customer service requests and provide support.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Security of Your Information</h2>
            <p className="mb-4 leading-relaxed">
              We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">5. Contact Us</h2>
            <p className="mb-4 leading-relaxed bg-background p-6 rounded-2xl border border-border mt-6">
              If you have questions or comments about this Privacy Policy, please contact us at:
              <br /><br />
              <strong className="text-foreground">Email:</strong> agrosmart254@gmail.com
              <br />
              <strong className="text-foreground">Address:</strong> Lucknow, India
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
