import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useScannerStore = defineStore('scanner', () => {
  const scanHistory = ref([])
  const feedbackReports = ref([])
  
  // Mock threat detection
  const analyzeThreat = (url) => {
    const threats = [
      { 
        score: 92, 
        status: 'Phishing',
        reason: 'URL contains suspicious subdomain pattern mimicking a legitimate banking institution. Domain registered recently (3 days ago). Uses HTTPS to appear secure but certificate is self-signed.',
        url,
        timestamp: new Date().toISOString()
      },
      { 
        score: 15, 
        status: 'Legitimate',
        reason: 'Domain has been active for 8 years with consistent WHOIS records. Valid SSL certificate from trusted authority. No phishing patterns detected in URL structure.',
        url,
        timestamp: new Date().toISOString()
      },
      { 
        score: 78, 
        status: 'Phishing',
        reason: 'Detected typosquatting attempt - domain closely resembles "paypal.com". Contains unicode characters to deceive users. Hosting provider flagged for malicious activity.',
        url,
        timestamp: new Date().toISOString()
      },
      { 
        score: 8, 
        status: 'Legitimate',
        reason: 'Official government domain with proper authentication. Domain matches expected patterns for legitimate services. No security concerns identified.',
        url,
        timestamp: new Date().toISOString()
      },
    ]
    
    return threats[Math.floor(Math.random() * threats.length)]
  }

  const performScan = async (scanData) => {
    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const result = analyzeThreat(scanData.url || scanData.data)
    
    const scanRecord = {
      id: Date.now(),
      type: scanData.type,
      ...result,
      userId: scanData.userId || 'anonymous'
    }
    
    scanHistory.value.unshift(scanRecord)
    
    // Keep only last 100 scans
    if (scanHistory.value.length > 100) {
      scanHistory.value = scanHistory.value.slice(0, 100)
    }
    
    return scanRecord
  }

  const submitFeedback = async (scanId, feedback) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const feedbackRecord = {
      id: Date.now(),
      scanId,
      keterangan: feedback.keterangan,
      proposedStatus: feedback.proposedStatus,
      timestamp: new Date().toISOString(),
      status: 'pending'
    }
    
    feedbackReports.value.unshift(feedbackRecord)
    return { success: true }
  }

  const getRecentScans = (limit = 10) => {
    return scanHistory.value.slice(0, limit)
  }

  return {
    scanHistory,
    feedbackReports,
    performScan,
    submitFeedback,
    getRecentScans
  }
})