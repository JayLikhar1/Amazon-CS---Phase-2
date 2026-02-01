"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"

// Icons
const Download = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
)

const FileText = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

const Table = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0V4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H5a1 1 0 01-1-1V10z" />
  </svg>
)

const Image = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const X = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

interface ExportData {
  customerData?: any
  predictionResult?: any
  analyticsData?: any
  timestamp: string
}

interface ExportFunctionalityProps {
  data: ExportData
  title?: string
}

export default function ExportFunctionality({ data, title = "Customer Analysis Report" }: ExportFunctionalityProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportType, setExportType] = useState<string | null>(null)

  const exportOptions = [
    {
      id: 'pdf',
      name: 'PDF Report',
      description: 'Comprehensive report with charts and insights',
      icon: FileText,
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'csv',
      name: 'CSV Data',
      description: 'Raw data in spreadsheet format',
      icon: Table,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'json',
      name: 'JSON Export',
      description: 'Structured data for developers',
      icon: FileText,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'png',
      name: 'Chart Images',
      description: 'Export charts as PNG images',
      icon: Image,
      color: 'from-purple-500 to-purple-600'
    }
  ]

  const handleExport = async (type: string) => {
    setIsExporting(true)
    setExportType(type)

    try {
      switch (type) {
        case 'pdf':
          await exportToPDF()
          break
        case 'csv':
          await exportToCSV()
          break
        case 'json':
          await exportToJSON()
          break
        case 'png':
          await exportChartsToPNG()
          break
      }
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
      setExportType(null)
      setIsOpen(false)
    }
  }

  const exportToPDF = async () => {
    // Simulate PDF generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Create a simple HTML report and convert to PDF
    const reportContent = generateHTMLReport()
    const blob = new Blob([reportContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `${title.replace(/\s+/g, '_')}_${data.timestamp}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const exportToCSV = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const csvContent = generateCSVContent()
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `customer_data_${data.timestamp}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const exportToJSON = async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const jsonContent = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `customer_analysis_${data.timestamp}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const exportChartsToPNG = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // In a real implementation, you would capture chart elements as images
    // For now, we'll create a simple notification
    alert('Chart export functionality would capture all visible charts as PNG images')
  }

  const generateHTMLReport = () => {
    const { customerData, predictionResult } = data
    
    return `
<!DOCTYPE html>
<html>
<head>
    <title>${title}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 40px; color: #333; }
        .header { text-align: center; margin-bottom: 40px; }
        .section { margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .metric { display: inline-block; margin: 10px; padding: 15px; background: #f5f5f5; border-radius: 6px; }
        .metric-value { font-size: 24px; font-weight: bold; color: #007AFF; }
        .metric-label { font-size: 12px; color: #666; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f8f9fa; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${title}</h1>
        <p>Generated on ${new Date(data.timestamp).toLocaleString()}</p>
    </div>
    
    ${customerData ? `
    <div class="section">
        <h2>Customer Profile</h2>
        <div class="metric">
            <div class="metric-value">${customerData.age}</div>
            <div class="metric-label">Age</div>
        </div>
        <div class="metric">
            <div class="metric-value">${formatCurrency(customerData.income)}</div>
            <div class="metric-label">Income</div>
        </div>
        <div class="metric">
            <div class="metric-value">${formatCurrency(customerData.totalSpending)}</div>
            <div class="metric-label">Total Spending</div>
        </div>
        <div class="metric">
            <div class="metric-value">${customerData.recency}</div>
            <div class="metric-label">Days Since Last Purchase</div>
        </div>
    </div>
    ` : ''}
    
    ${predictionResult ? `
    <div class="section">
        <h2>Prediction Results</h2>
        <p><strong>Predicted Segment:</strong> ${predictionResult.clusterName}</p>
        <p><strong>Match Score:</strong> ${predictionResult.matchScore}%</p>
        <p><strong>Description:</strong> ${predictionResult.description}</p>
        
        <h3>Recommendations</h3>
        <ul>
            ${predictionResult.recommendations.map((rec: string) => `<li>${rec}</li>`).join('')}
        </ul>
    </div>
    ` : ''}
    
    <div class="section">
        <h2>Report Details</h2>
        <table>
            <tr><th>Report Generated</th><td>${new Date(data.timestamp).toLocaleString()}</td></tr>
            <tr><th>Analysis Type</th><td>Customer Segmentation</td></tr>
            <tr><th>Data Source</th><td>Customer Intelligence Dashboard</td></tr>
        </table>
    </div>
</body>
</html>
    `
  }

  const generateCSVContent = () => {
    const { customerData, predictionResult } = data
    
    let csv = 'Field,Value\n'
    
    if (customerData) {
      csv += `Age,${customerData.age}\n`
      csv += `Income,${customerData.income}\n`
      csv += `Total Spending,${customerData.totalSpending}\n`
      csv += `Recency,${customerData.recency}\n`
      csv += `Customer Since,${customerData.customerSince}\n`
      csv += `Web Purchases,${customerData.numWebPurchases}\n`
      csv += `Store Purchases,${customerData.numStorePurchases}\n`
      csv += `Web Visits per Month,${customerData.numWebVisitsMonth}\n`
    }
    
    if (predictionResult) {
      csv += `Predicted Cluster,${predictionResult.cluster}\n`
      csv += `Cluster Name,${predictionResult.clusterName}\n`
      csv += `Match Score,${predictionResult.matchScore}\n`
      csv += `Description,"${predictionResult.description}"\n`
    }
    
    csv += `Export Timestamp,${data.timestamp}\n`
    
    return csv
  }

  return (
    <div className="relative apple-dropdown">
      {/* Export Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="apple-button px-6 py-3 rounded-2xl text-white font-medium flex items-center space-x-3 transition-all duration-300"
      >
        <Download className="h-5 w-5" />
        <span>Export Report</span>
      </motion.button>

      {/* Export Options Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            
            <div className="fixed inset-0 z-[101] pointer-events-none flex items-start justify-end p-4">
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                className="pointer-events-auto w-80 mt-20 mr-4"
                style={{
                  position: 'relative',
                  zIndex: 101
                }}
              >
                <Card className="apple-glass border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Download className="h-5 w-5 text-white/70" />
                    <span>Export Options</span>
                  </CardTitle>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-xl hover:bg-white/10 transition-colors duration-200"
                  >
                    <X className="h-4 w-4 text-white/50" />
                  </button>
                </div>
                <p className="text-sm text-white/60">Choose your preferred export format</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {exportOptions.map((option) => {
                  const IconComponent = option.icon
                  const isCurrentlyExporting = isExporting && exportType === option.id
                  
                  return (
                    <motion.button
                      key={option.id}
                      onClick={() => handleExport(option.id)}
                      disabled={isExporting}
                      whileHover={{ scale: isExporting ? 1 : 1.02 }}
                      whileTap={{ scale: isExporting ? 1 : 0.98 }}
                      className={`w-full p-4 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 text-left ${
                        isExporting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${option.color}`}>
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-white">{option.name}</div>
                          <div className="text-sm text-white/60">{option.description}</div>
                        </div>
                        {isCurrentlyExporting && (
                          <div className="apple-spinner w-5 h-5" />
                        )}
                      </div>
                    </motion.button>
                  )
                })}
                
                <div className="pt-4 border-t border-white/10">
                  <div className="text-xs text-white/50 text-center">
                    Export includes all current analysis data and insights
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          </div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}