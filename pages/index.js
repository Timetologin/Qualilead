import { useState, useEffect } from 'react'
import Head from 'next/head'
import { motion } from 'framer-motion'

// Toast Notification Component
function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl max-w-md"
    >
      <div className="flex items-center gap-3">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <p className="font-medium">{message}</p>
      </div>
    </motion.div>
  )
}

// Header Component
function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToForm = () => {
    document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-dark/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}
    >
      <nav className="container-custom px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="AutoLead לוגו" className="h-10 w-10" />
            <span className="text-2xl font-bold gradient-text">AutoLead</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#why-us" className="text-gray-300 hover:text-white transition-colors">
              למה אנחנו
            </a>
            <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">
              איך זה עובד
            </a>
            <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">
              המלצות
            </a>
            <a href="#faq" className="text-gray-300 hover:text-white transition-colors">
              שאלות נפוצות
            </a>
          </div>

          <button onClick={scrollToForm} className="btn-primary text-sm sm:text-base px-6 py-3">
            השאר פרטים
          </button>
        </div>
      </nav>
    </header>
  )
}

// Hero Section
function Hero() {
  const scrollToForm = () => {
    document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 gradient-bg">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary rounded-full filter blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-red-600 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>

      <div className="relative container-custom px-4 sm:px-6 lg:px-8 py-32 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight"
        >
          אנחנו מביאים את הלידים,{' '}
          <span className="gradient-text">אתם סוגרים את העסקאות</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
        >
          רוצה להחליף את הרכב הישן או לקבל מימון משתלם? השאר פרטים ונחזור אליך תוך דקות.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button onClick={scrollToForm} className="btn-primary">
            שלח פרטים עכשיו
          </button>
          <a
            href="https://wa.me/972501234567?text=היי, אני מעוניין בפרטים על AutoLead"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex items-center gap-2"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            שיחה בווטסאפ
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="animate-bounce">
            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Lead Form Component
function LeadForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    inquiryType: '',
    termsAccepted: false,
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 10) {
      return numbers.slice(0, 3) + '-' + numbers.slice(3)
    }
    return numbers.slice(0, 3) + '-' + numbers.slice(3, 10)
  }

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value)
    setFormData({ ...formData, phone: formatted })
    if (errors.phone) setErrors({ ...errors, phone: '' })
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'נא להזין שם מלא'
    }
    
    const phoneNumbers = formData.phone.replace(/\D/g, '')
    if (!phoneNumbers) {
      newErrors.phone = 'נא להזין מספר טלפון'
    } else if (phoneNumbers.length < 9 || phoneNumbers.length > 10) {
      newErrors.phone = 'מספר טלפון לא תקין'
    } else if (!phoneNumbers.startsWith('05')) {
      newErrors.phone = 'מספר טלפון חייב להתחיל ב-05'
    }
    
    if (!formData.inquiryType) {
      newErrors.inquiryType = 'נא לבחור סוג פנייה'
    }
    
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'יש לאשר את התקנון'
    }
    
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setIsSubmitting(true)
    
    // Save to localStorage
    const lead = {
      ...formData,
      timestamp: new Date().toISOString(),
      id: Date.now(),
    }
    
    const existingLeads = JSON.parse(localStorage.getItem('autolead-leads') || '[]')
    existingLeads.push(lead)
    localStorage.setItem('autolead-leads', JSON.stringify(existingLeads))
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      onSuccess()
      setFormData({
        fullName: '',
        phone: '',
        inquiryType: '',
        termsAccepted: false,
      })
      setErrors({})
    }, 500)
  }

  return (
    <section id="lead-form" className="section-padding bg-dark-gray/50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <div className="glass-card p-8 lg:p-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4">
              השאר פרטים ונחזור אליך
            </h2>
            <p className="text-center text-gray-300 mb-8">
              מלא את הפרטים ונציג יחזור אליך תוך דקות ספורות
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                  שם מלא *
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => {
                    setFormData({ ...formData, fullName: e.target.value })
                    if (errors.fullName) setErrors({ ...errors, fullName: '' })
                  }}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-gray-500"
                  placeholder="ישראל ישראלי"
                  aria-required="true"
                  aria-invalid={!!errors.fullName}
                />
                {errors.fullName && (
                  <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  מספר טלפון *
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-gray-500"
                  placeholder="050-1234567"
                  aria-required="true"
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && (
                  <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label htmlFor="inquiryType" className="block text-sm font-medium mb-2">
                  סוג הפנייה *
                </label>
                <select
                  id="inquiryType"
                  value={formData.inquiryType}
                  onChange={(e) => {
                    setFormData({ ...formData, inquiryType: e.target.value })
                    if (errors.inquiryType) setErrors({ ...errors, inquiryType: '' })
                  }}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
                  aria-required="true"
                  aria-invalid={!!errors.inquiryType}
                >
                  <option value="" className="bg-dark">בחר סוג פנייה</option>
                  <option value="trade-in" className="bg-dark">טרייד-אין</option>
                  <option value="financing" className="bg-dark">מימון רכב</option>
                </select>
                {errors.inquiryType && (
                  <p className="text-red-400 text-sm mt-1">{errors.inquiryType}</p>
                )}
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.termsAccepted}
                  onChange={(e) => {
                    setFormData({ ...formData, termsAccepted: e.target.checked })
                    if (errors.termsAccepted) setErrors({ ...errors, termsAccepted: '' })
                  }}
                  className="mt-1 w-5 h-5 rounded border-white/10 bg-white/5 text-primary focus:ring-primary focus:ring-2"
                  aria-required="true"
                  aria-invalid={!!errors.termsAccepted}
                />
                <label htmlFor="terms" className="text-sm text-gray-300">
                  אני מאשר את{' '}
                  <a href="/terms" className="text-primary hover:underline">
                    התקנון
                  </a>{' '}
                  ומסכים לקבל עדכונים שיווקיים *
                </label>
              </div>
              {errors.termsAccepted && (
                <p className="text-red-400 text-sm">{errors.termsAccepted}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'שולח...' : 'שלח פרטים'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Why Choose Us Section
function WhyChooseUs() {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'מענה מהיר',
      description: 'נציג חוזר אליך תוך דקות ספורות, 7 ימים בשבוע',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'שותפים מהימנים',
      description: 'עובדים רק עם חברות מימון ויבואני רכב מובילים',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'תנאים בלעדיים',
      description: 'הצעות מימון מיוחדות שלא תמצא במקום אחר',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'שירות אישי',
      description: 'ליווי מקצועי ואישי לאורך כל התהליך',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      title: 'ללא עלות',
      description: 'כל השירות שלנו ללא תשלום עבור הלקוח',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'ניסיון מוכח',
      description: 'אלפי עסקאות מוצלחות ולקוחות מרוצים',
    },
  ]

  return (
    <section id="why-us" className="section-padding">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            למה לבחור ב-<span className="gradient-text">AutoLead</span>?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            אנחנו מחברים אותך לעסקאות הכי טובות בשוק הרכב הישראלי
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass-card p-6 hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="text-primary mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// How It Works Section
function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'ממלאים פרטים',
      description: 'מלא את הטופס הקצר עם הפרטים הבסיסיים שלך',
      icon: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      number: '02',
      title: 'שיחה להתאמה',
      description: 'נציג יחזור אליך תוך דקות לשיחת היכרות קצרה',
      icon: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
    },
    {
      number: '03',
      title: 'מקבלים הצעות',
      description: 'נמצא עבורך את העסקה המתאימה ביותר מבין השותפים שלנו',
      icon: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      number: '04',
      title: 'סוגרים עסקה',
      description: 'מתקדמים לסגירה מהירה עם התנאים הכי טובים',
      icon: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
  ]

  return (
    <section id="how-it-works" className="section-padding bg-dark-gray/30">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">איך זה עובד?</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            תהליך פשוט ומהיר שיחסוך לך זמן וכסף
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              <div className="glass-card p-6 text-center hover:bg-white/10 transition-all duration-300">
                <div className="text-primary/20 text-7xl font-bold mb-4">
                  {step.number}
                </div>
                <div className="text-primary mb-4 flex justify-center">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2">
                  <svg className="w-8 h-8 text-primary/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Testimonials Section
function Testimonials() {
  const testimonials = [
    {
      name: 'דוד כהן',
      text: 'קיבלתי מענה תוך 5 דקות והצעת מימון מעולה. התהליך היה מהיר ומקצועי.',
      rating: 5,
    },
    {
      name: 'שרה לוי',
      text: 'עברתי מהרכב הישן לחדש בתנאים שלא האמנתי שאפשריים. תודה רבה!',
      rating: 5,
    },
    {
      name: 'יוסי מזרחי',
      text: 'השירות הכי טוב שקיבלתי. ליווי אישי לאורך כל הדרך.',
      rating: 5,
    },
    {
      name: 'רונית אברהם',
      text: 'חסכתי המון כסף והזמן בזכות AutoLead. ממליצה בחום!',
      rating: 5,
    },
  ]

  return (
    <section id="testimonials" className="section-padding">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">לקוחות ממליצים</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            אלפי לקוחות מרוצים כבר סגרו עסקאות דרכנו
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
              <p className="font-semibold">{testimonial.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// FAQ Section
function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: 'כמה זמן לוקח לקבל מענה?',
      answer: 'נציג חוזר אליך תוך מקסימום 15 דקות בימי עבודה ובשעות הפעילות. אנחנו זמינים 7 ימים בשבוע.',
    },
    {
      question: 'האם השירות עולה כסף?',
      answer: 'לא! כל השירות שלנו ללא עלות עבור הלקוח. אנחנו מקבלים עמלה מהחברות השותפות.',
    },
    {
      question: 'איזה חברות אתם עובדים איתן?',
      answer: 'אנחנו עובדים עם כל היבואנים המובילים בישראל וחברות המימון הגדולות, כולל הבנקים המובילים.',
    },
    {
      question: 'מה זה טרייד-אין?',
      answer: 'טרייד-אין זה החלפת רכב ישן ברכב חדש, כאשר ערך הרכב הישן מנוכה ממחיר הרכב החדש.',
    },
    {
      question: 'האם אני מתחייב לעסקה?',
      answer: 'ממש לא! תקבל הצעות ותוכל לבחור אם להמשיך או לא. אין שום התחייבות.',
    },
    {
      question: 'איך אני יודע שאקבל את העסקה הטובה ביותר?',
      answer: 'אנחנו משווים עבורך הצעות ממספר גורמים ומציגים לך את האופציות הטובות ביותר בשוק.',
    },
  ]

  return (
    <section id="faq" className="section-padding bg-dark-gray/30">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">שאלות נפוצות</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            כל מה שרצית לדעת על השירות שלנו
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="glass-card overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-right hover:bg-white/5 transition-colors"
                aria-expanded={openIndex === index}
              >
                <span className="font-semibold text-lg">{faq.question}</span>
                <svg
                  className={`w-6 h-6 text-primary transition-transform ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-5 text-gray-300"
                >
                  {faq.answer}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// CTA Section
function CTASection() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              מוכנים להתחיל?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              השאר פרטים עכשיו וקבל את העסקה הטובה ביותר בשוק
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="tel:+972501234567" className="btn-primary flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                התקשר עכשיו
              </a>
              <a
                href="https://wa.me/972501234567?text=היי, אני מעוניין בפרטים"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex items-center gap-2"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                שלח הודעה בווטסאפ
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Footer Component
function Footer() {
  return (
    <footer className="bg-dark-gray/80 border-t border-white/10">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.svg" alt="AutoLead" className="h-10 w-10" />
              <span className="text-2xl font-bold gradient-text">AutoLead</span>
            </div>
            <p className="text-gray-400">
              הפתרון המוביל לליווי בקניית רכב ומימון ברחבי ישראל
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">צור קשר</h3>
            <div className="space-y-3 text-gray-400">
              <a href="tel:+972501234567" className="flex items-center gap-2 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                050-123-4567
              </a>
              <a href="mailto:info@autolead.co.il" className="flex items-center gap-2 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@autolead.co.il
              </a>
              <p className="flex items-start gap-2">
                <svg className="w-5 h-5 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                תל אביב, ישראל
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">קישורים מהירים</h3>
            <div className="space-y-2 text-gray-400">
              <a href="#why-us" className="block hover:text-white transition-colors">למה אנחנו</a>
              <a href="#how-it-works" className="block hover:text-white transition-colors">איך זה עובד</a>
              <a href="#testimonials" className="block hover:text-white transition-colors">המלצות</a>
              <a href="#faq" className="block hover:text-white transition-colors">שאלות נפוצות</a>
              <a href="/admin" className="block hover:text-white transition-colors">ניהול</a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-gray-400">
          <p>© 2025 AutoLead. כל הזכויות שמורות.</p>
        </div>
      </div>
    </footer>
  )
}

// Main Home Page Component
export default function Home() {
  const [showToast, setShowToast] = useState(false)

  const handleFormSuccess = () => {
    setShowToast(true)
  }

  return (
    <>
      <Head>
        <title>AutoLead - לידים איכותיים לרכב | טרייד-אין ומימון רכב בישראל</title>
        <meta 
          name="description" 
          content="AutoLead מביאה לך את ההצעות הטובות ביותר לטרייד-אין ומימון רכב בישראל. שירות מהיר, אמין ומקצועי. השאר פרטים ונחזור אליך תוך דקות." 
        />
        <meta name="keywords" content="טרייד-אין, מימון רכב, קניית רכב, החלפת רכב, ליסינג, הלוואה לרכב" />
        <link rel="canonical" href="https://autolead.co.il" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="AutoLead - לידים איכותיים לרכב בישראל" />
        <meta property="og:description" content="קבל את העסקה הטובה ביותר לטרייד-אין ומימון רכב. שירות מהיר ומקצועי." />
        <meta property="og:url" content="https://autolead.co.il" />
        <meta property="og:image" content="https://autolead.co.il/og-image.jpg" />
        <meta property="og:locale" content="he_IL" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AutoLead - לידים איכותיים לרכב" />
        <meta name="twitter:description" content="טרייד-אין ומימון רכב בתנאים הטובים ביותר" />
        <meta name="twitter:image" content="https://autolead.co.il/og-image.jpg" />

        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'AutoLead',
              description: 'שירותי ליווי בקניית רכב ומימון',
              url: 'https://autolead.co.il',
              logo: 'https://autolead.co.il/logo.svg',
              telephone: '+972-50-123-4567',
              email: 'info@autolead.co.il',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'תל אביב',
                addressCountry: 'IL',
              },
              sameAs: [
                'https://www.facebook.com/autolead',
                'https://www.instagram.com/autolead',
              ],
            }),
          }}
        />
      </Head>

      <main id="main-content">
        <Header />
        <Hero />
        <LeadForm onSuccess={handleFormSuccess} />
        <WhyChooseUs />
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <CTASection />
        <Footer />
        
        {showToast && (
          <Toast
            message="הפרטים נשלחו בהצלחה! נציג יחזור אליך בקרוב."
            onClose={() => setShowToast(false)}
          />
        )}
      </main>
    </>
  )
}
