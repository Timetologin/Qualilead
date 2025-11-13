import { useState, useEffect } from 'react'
import Head from 'next/head'
import { motion } from 'framer-motion'

export default function Admin() {
  const [leads, setLeads] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    loadLeads()
  }, [])

  const loadLeads = () => {
    const storedLeads = JSON.parse(localStorage.getItem('autolead-leads') || '[]')
    // Sort by most recent first
    storedLeads.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    setLeads(storedLeads)
  }

  const deleteLead = (id) => {
    if (confirm('האם אתה בטוח שברצונך למחוק ליד זה?')) {
      const updatedLeads = leads.filter(lead => lead.id !== id)
      localStorage.setItem('autolead-leads', JSON.stringify(updatedLeads))
      setLeads(updatedLeads)
    }
  }

  const exportToCSV = () => {
    if (leads.length === 0) {
      alert('אין לידים לייצוא')
      return
    }

    const headers = ['שם מלא', 'טלפון', 'סוג פנייה', 'תאריך ושעה']
    const rows = filteredLeads.map(lead => [
      lead.fullName,
      lead.phone,
      lead.inquiryType === 'trade-in' ? 'טרייד-אין' : 'מימון רכב',
      formatDateTime(lead.timestamp),
    ])

    const csvContent = [
      '\uFEFF' + headers.join(','), // BOM for Excel Hebrew support
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `autolead-leads-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp)
    return new Intl.DateTimeFormat('he-IL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const filteredLeads = leads.filter(lead => {
    const matchesSearch =
      lead.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm)
    const matchesFilter =
      filterType === 'all' || lead.inquiryType === filterType
    return matchesSearch && matchesFilter
  })

  return (
    <>
      <Head>
        <title>ניהול לידים - AutoLead</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gradient-bg">
        {/* Warning Banner */}
        <div className="bg-yellow-600/20 border-b border-yellow-600/50 py-3">
          <div className="container-custom px-4 text-center">
            <p className="text-yellow-300 font-medium">
              ⚠️ עמוד ניהול – ללא אבטחה, לשימוש פנימי בלבד
            </p>
          </div>
        </div>

        {/* Header */}
        <header className="bg-dark-gray/80 border-b border-white/10">
          <div className="container-custom px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <a href="/" className="flex items-center gap-3">
                  <img src="/logo.svg" alt="AutoLead" className="h-10 w-10" />
                  <span className="text-2xl font-bold gradient-text">AutoLead</span>
                </a>
                <span className="text-gray-400">|</span>
                <h1 className="text-xl font-semibold">ניהול לידים</h1>
              </div>
              <a href="/" className="text-gray-400 hover:text-white transition-colors">
                חזרה לדף הבית
              </a>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container-custom px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">סך הכל לידים</p>
                  <p className="text-3xl font-bold">{leads.length}</p>
                </div>
                <div className="bg-primary/20 p-3 rounded-lg">
                  <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">טרייד-אין</p>
                  <p className="text-3xl font-bold">
                    {leads.filter(l => l.inquiryType === 'trade-in').length}
                  </p>
                </div>
                <div className="bg-blue-500/20 p-3 rounded-lg">
                  <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">מימון רכב</p>
                  <p className="text-3xl font-bold">
                    {leads.filter(l => l.inquiryType === 'financing').length}
                  </p>
                </div>
                <div className="bg-green-500/20 p-3 rounded-lg">
                  <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Filters and Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 mb-6"
          >
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <div className="relative flex-1 sm:flex-initial sm:w-64">
                  <svg
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="חיפוש לפי שם או טלפון"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pr-10 pl-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-gray-500"
                  />
                </div>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
                >
                  <option value="all" className="bg-dark">כל הפניות</option>
                  <option value="trade-in" className="bg-dark">טרייד-אין</option>
                  <option value="financing" className="bg-dark">מימון רכב</option>
                </select>
              </div>

              <button
                onClick={exportToCSV}
                className="w-full sm:w-auto btn-primary flex items-center justify-center gap-2 text-sm px-6 py-2"
                disabled={filteredLeads.length === 0}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                ייצוא ל-CSV
              </button>
            </div>

            <div className="mt-4 text-sm text-gray-400">
              מציג {filteredLeads.length} מתוך {leads.length} לידים
            </div>
          </motion.div>

          {/* Leads Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card overflow-hidden"
          >
            {filteredLeads.length === 0 ? (
              <div className="p-12 text-center">
                <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-gray-400 text-lg">
                  {searchTerm || filterType !== 'all' 
                    ? 'לא נמצאו לידים התואמים לחיפוש' 
                    : 'אין לידים עדיין'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 text-right text-sm font-semibold">שם מלא</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">טלפון</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">סוג פנייה</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">תאריך ושעה</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">פעולות</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredLeads.map((lead, index) => (
                      <motion.tr
                        key={lead.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-primary font-semibold">
                                {lead.fullName.charAt(0)}
                              </span>
                            </div>
                            <span className="font-medium">{lead.fullName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <a 
                            href={`tel:${lead.phone.replace(/\D/g, '')}`}
                            className="text-primary hover:underline flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {lead.phone}
                          </a>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            lead.inquiryType === 'trade-in'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-green-500/20 text-green-400'
                          }`}>
                            {lead.inquiryType === 'trade-in' ? 'טרייד-אין' : 'מימון רכב'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-sm">
                          {formatDateTime(lead.timestamp)}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => deleteLead(lead.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            aria-label={`מחק ליד של ${lead.fullName}`}
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </>
  )
}
