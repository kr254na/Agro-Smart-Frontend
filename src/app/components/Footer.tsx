import { Sprout, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';


export default function Footer() {
  return (
    <footer className="bg-background border-t border-border py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
                <Sprout className="w-6 h-6 text-foreground" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                AgroSmart
              </span>
            </div>
            <p className="text-muted-foreground mb-4">
              Empowering farmers with IoT and AI technology for smarter, more sustainable agriculture.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center hover:bg-green-500/20 transition-all">
                <Facebook className="w-5 h-5 text-muted-foreground hover:text-green-400" />
              </a>
              <a href="#" className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center hover:bg-green-500/20 transition-all">
                <Twitter className="w-5 h-5 text-muted-foreground hover:text-green-400" />
              </a>
              <a href="#" className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center hover:bg-green-500/20 transition-all">
                <Instagram className="w-5 h-5 text-muted-foreground hover:text-green-400" />
              </a>
              <a href="#" className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center hover:bg-green-500/20 transition-all">
                <Linkedin className="w-5 h-5 text-muted-foreground hover:text-green-400" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-muted-foreground hover:text-green-400 transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-green-400 transition-colors">About Us</Link></li>
              <li><Link to="/weather" className="text-muted-foreground hover:text-green-400 transition-colors">Weather</Link></li>
              <li><Link to="/community" className="text-muted-foreground hover:text-green-400 transition-colors">Community</Link></li>
              <li><Link to="/marketplace" className="text-muted-foreground hover:text-green-400 transition-colors">Marketplace</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-green-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-green-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-green-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-green-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-5 h-5 text-green-400" />
                <span>+91 9554054732</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-5 h-5 text-green-400" />
                <span>agrosmart254@gmail.com</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5 text-green-400" />
                <span>Lucknow, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center">
          <p className="text-muted-foreground">
            © 2026 AgroSmart. All rights reserved. Built with ❤️ for farmers.
          </p>
        </div>
      </div>
    </footer>
  );
}
