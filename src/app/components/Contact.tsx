import { useState } from 'react';
import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '../contexts/LanguageContext';
import { Send, Mail, Github, Linkedin, Phone } from 'lucide-react';
import { MagneticButton } from './MagneticButton';

const socialLinks = [
  {
    icon: Mail,
    label: 'Email',
    href: 'mailto:younes@example.com',
    gradient: 'from-red-500 to-orange-500',
  },
  {
    icon: Github,
    label: 'GitHub',
    href: 'https://github.com',
    gradient: 'from-gray-700 to-gray-900',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    gradient: 'from-blue-600 to-blue-800',
  },
  {
    icon: Phone,
    label: 'Phone',
    href: 'tel:+212600000000',
    gradient: 'from-green-500 to-emerald-500',
  },
];

export function Contact() {
  const { t } = useLanguage();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isFocused, setIsFocused] = useState({
    name: false,
    email: false,
    message: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission
  };

  return (
    <section id="contact" className="relative py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            {t('contact.title')}
          </h2>
          <p className="text-xl text-muted-foreground">
            {t('contact.description')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div className="relative group">
                <motion.div
                  className={`relative backdrop-blur-xl rounded-2xl border transition-colors duration-300 ${
                    isFocused.name ? 'border-blue-500/50' : 'border-white/10'
                  }`}
                  animate={isFocused.name ? { scale: 1.02 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 blur-xl transition-opacity duration-300 ${
                    isFocused.name ? 'opacity-20' : ''
                  }`} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    onFocus={() => setIsFocused({ ...isFocused, name: true })}
                    onBlur={() => setIsFocused({ ...isFocused, name: false })}
                    placeholder={t('contact.name')}
                    className="relative z-10 w-full px-6 py-4 bg-transparent outline-none"
                    required
                  />
                </motion.div>
              </div>

              {/* Email Input */}
              <div className="relative group">
                <motion.div
                  className={`relative backdrop-blur-xl rounded-2xl border transition-colors duration-300 ${
                    isFocused.email ? 'border-blue-500/50' : 'border-white/10'
                  }`}
                  animate={isFocused.email ? { scale: 1.02 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 blur-xl transition-opacity duration-300 ${
                    isFocused.email ? 'opacity-20' : ''
                  }`} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    onFocus={() => setIsFocused({ ...isFocused, email: true })}
                    onBlur={() => setIsFocused({ ...isFocused, email: false })}
                    placeholder={t('contact.email')}
                    className="relative z-10 w-full px-6 py-4 bg-transparent outline-none"
                    required
                  />
                </motion.div>
              </div>

              {/* Message Input */}
              <div className="relative group">
                <motion.div
                  className={`relative backdrop-blur-xl rounded-2xl border transition-colors duration-300 ${
                    isFocused.message ? 'border-blue-500/50' : 'border-white/10'
                  }`}
                  animate={isFocused.message ? { scale: 1.02 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 blur-xl transition-opacity duration-300 ${
                    isFocused.message ? 'opacity-20' : ''
                  }`} />
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    onFocus={() => setIsFocused({ ...isFocused, message: true })}
                    onBlur={() => setIsFocused({ ...isFocused, message: false })}
                    placeholder={t('contact.message')}
                    rows={5}
                    className="relative z-10 w-full px-6 py-4 bg-transparent outline-none resize-none"
                    required
                  />
                </motion.div>
              </div>

              {/* Submit Button */}
              <MagneticButton
                className="group relative w-full px-8 py-4 rounded-full overflow-hidden backdrop-blur-xl border border-white/10"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center justify-center gap-2 text-white font-medium">
                  {t('contact.send')}
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </MagneticButton>
            </form>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            {socialLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: 50 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="group relative block"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="relative backdrop-blur-xl rounded-2xl border border-white/10 p-6 overflow-hidden transition-all duration-300 hover:border-white/20">
                    <div className={`absolute inset-0 bg-gradient-to-r ${link.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className={`absolute -inset-1 bg-gradient-to-r ${link.gradient} blur-xl opacity-20`} />
                    </div>
                    
                    <div className="relative z-10 flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${link.gradient} p-3`}>
                        <Icon className="w-full h-full text-white" />
                      </div>
                      <span className="font-medium">{link.label}</span>
                    </div>
                  </div>
                </motion.a>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Decorative element */}
      <motion.div
        className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </section>
  );
}
