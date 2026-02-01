"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { FloatingNav } from "@/components/aceternity/floating-navbar"
import { BackgroundBeams } from "@/components/aceternity/background-beams"
import { Meteors } from "@/components/aceternity/meteors"
import CustomerInputForm from "@/components/customer-input-form"
import PredictionResults from "@/components/prediction-results"
import AdvancedSegmentationAnalytics from "@/components/advanced-segmentation-analytics"
import AdvancedFilters from "@/components/advanced-filters"
import ExportFunctionality from "@/components/export-functionality"
import { analyticsStore } from "@/lib/analytics-store"
// Icons will be defined inline to avoid import issues
const HomeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)

const BarChart3 = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

const Users = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
)

// Mock cluster data (in a real app, this would come from your ML model)
const clusterStats = {
  0: {
    name: "High-Value Loyal",
    income: 76667,
    age: 57,
    totalSpending: 1200,
    recency: 45,
    customerSince: 2500,
    numWebPurchases: 5,
    numStorePurchases: 9,
    numWebVisitsMonth: 2,
    description: "High-value, loyal customers with strong purchasing power and consistent engagement",
    recommendations: [
      "Offer premium loyalty rewards and exclusive benefits",
      "Provide early access to new products and services",
      "Implement personalized high-end product recommendations",
      "Create VIP customer service experiences"
    ]
  },
  1: {
    name: "Budget-Conscious",
    income: 29382,
    age: 50,
    totalSpending: 400,
    recency: 55,
    customerSince: 2000,
    numWebPurchases: 2,
    numStorePurchases: 3,
    numWebVisitsMonth: 7,
    description: "Budget-conscious customers who are price-sensitive but engaged",
    recommendations: [
      "Promote deals, discounts, and special offers",
      "Create bundle offers for better value perception",
      "Highlight budget-friendly alternatives",
      "Implement loyalty programs with cost savings"
    ]
  },
  2: {
    name: "Senior Customers",
    income: 49086,
    age: 68,
    totalSpending: 600,
    recency: 50,
    customerSince: 3000,
    numWebPurchases: 3,
    numStorePurchases: 5,
    numWebVisitsMonth: 6,
    description: "Senior customers with consistent but moderate spending patterns",
    recommendations: [
      "Focus on traditional communication channels",
      "Offer senior discounts and age-appropriate products",
      "Provide clear, detailed product information",
      "Ensure excellent customer support accessibility"
    ]
  },
  3: {
    name: "Active Balanced",
    income: 61240,
    age: 60,
    totalSpending: 900,
    recency: 40,
    customerSince: 2200,
    numWebPurchases: 6,
    numStorePurchases: 8,
    numWebVisitsMonth: 6,
    description: "Active customers with balanced online and offline shopping behavior",
    recommendations: [
      "Implement omnichannel marketing strategies",
      "Offer cross-channel promotions and rewards",
      "Provide flexible delivery and pickup options",
      "Create seamless online-to-offline experiences"
    ]
  },
  4: {
    name: "Premium",
    income: 666666,
    age: 49,
    totalSpending: 5000,
    recency: 30,
    customerSince: 1500,
    numWebPurchases: 8,
    numStorePurchases: 3,
    numWebVisitsMonth: 6,
    description: "Premium customers with exceptional spending power and digital preference",
    recommendations: [
      "Provide VIP customer service and concierge support",
      "Offer exclusive premium products and limited editions",
      "Implement personal shopping assistance",
      "Create luxury brand partnerships and experiences"
    ]
  },
  5: {
    name: "Moderate",
    income: 39446,
    age: 54,
    totalSpending: 500,
    recency: 48,
    customerSince: 1800,
    numWebPurchases: 2,
    numStorePurchases: 3,
    numWebVisitsMonth: 5,
    description: "Moderate customers with average engagement and spending levels",
    recommendations: [
      "Launch re-engagement campaigns to increase activity",
      "Offer win-back promotions and incentives",
      "Increase communication frequency with valuable content",
      "Provide personalized product recommendations"
    ]
  }
}

// Simple clustering algorithm (in production, use your trained model)
function predictCluster(customerData: any) {
  // This is a simplified version - replace with actual ML model prediction
  const { income, age, totalSpending, recency } = customerData
  
  // Simple rule-based classification for demo
  if (income > 100000 && totalSpending > 2000) return 4 // Premium
  if (income > 70000 && age > 55) return 0 // High-Value Loyal
  if (age > 65) return 2 // Senior
  if (income < 35000) return 1 // Budget-Conscious
  if (totalSpending > 800) return 3 // Active Balanced
  return 5 // Moderate
}

function calculateMatchScore(customerData: any, clusterData: any) {
  // Simple similarity calculation
  const features = ['income', 'age', 'totalSpending', 'recency']
  let totalDiff = 0
  
  features.forEach(feature => {
    const customerValue = customerData[feature === 'totalSpending' ? 'totalSpending' : feature]
    const clusterValue = clusterData[feature === 'totalSpending' ? 'totalSpending' : feature]
    const maxValue = Math.max(customerValue, clusterValue)
    if (maxValue > 0) {
      totalDiff += Math.abs(customerValue - clusterValue) / maxValue
    }
  })
  
  return Math.max(0, Math.round((1 - totalDiff / features.length) * 100))
}

const navItems = [
  { name: "Analytics", link: "analytics", icon: <BarChart3 className="h-4 w-4" /> },
  { name: "Predictions", link: "prediction", icon: <HomeIcon className="h-4 w-4" /> },
  { name: "Segments", link: "analytics", icon: <Users className="h-4 w-4" /> },
]

function Home() {
  const [prediction, setPrediction] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [customerData, setCustomerData] = useState<any>(null)
  const [activeSection, setActiveSection] = useState<'analytics' | 'prediction'>('analytics')
  const [filters, setFilters] = useState<any>(null)

  const availableSegments = [
    "High-Value Loyal",
    "Budget-Conscious", 
    "Senior Customers",
    "Active Balanced",
    "Premium",
    "Moderate"
  ]

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters)
    // In a real app, you would apply these filters to your data
    console.log('Filters applied:', newFilters)
  }

  const handleNavClick = (link: string) => {
    switch (link) {
      case 'analytics':
        setActiveSection('analytics')
        setPrediction(null)
        setCustomerData(null)
        break
      case 'prediction':
        setActiveSection('prediction')
        break
      default:
        setActiveSection('analytics')
    }
  }

  const handlePredict = async (data: any) => {
    setIsLoading(true)
    setCustomerData(data)
    setActiveSection('prediction')
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const cluster = predictCluster(data)
    const clusterData = clusterStats[cluster as keyof typeof clusterStats]
    const matchScore = calculateMatchScore(data, clusterData)
    
    const prediction = {
      cluster,
      clusterName: clusterData.name,
      description: clusterData.description,
      recommendations: clusterData.recommendations,
      characteristics: clusterData,
      matchScore
    }
    
    // Add prediction to analytics store
    analyticsStore.addPrediction(data, prediction)
    
    setPrediction(prediction)
    setIsLoading(false)
  }

  const handleSectionChange = (section: 'analytics' | 'prediction') => {
    setActiveSection(section)
    if (section !== 'prediction') {
      setPrediction(null)
      setCustomerData(null)
    }
  }

  return (
    <main className="min-h-screen relative overflow-hidden apple-bg-enhanced">
      {/* Enhanced Background Effects */}
      <BackgroundBeams />
      <Meteors number={30} />
      
      {/* Additional ambient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      
      {/* Floating Navigation */}
      <FloatingNav navItems={navItems} onNavClick={handleNavClick} activeSection={activeSection} />
      
      {/* Main Content */}
      <div className="relative z-10 pt-24 pb-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
            className="relative"
          >
            <h1 className="text-6xl md:text-8xl font-bold apple-title mb-6 apple-float relative z-10">
              Customer Intelligence
            </h1>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl -z-10 animate-pulse" />
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-xl apple-body max-w-4xl mx-auto leading-relaxed mb-8 relative"
          >
            Advanced AI-powered customer segmentation with deep analytics and insights. 
            <br className="hidden md:block" />
            <span className="text-blue-300 font-semibold">Understand your customers</span> with comprehensive segmentation analysis.
          </motion.p>
          
          {/* Enhanced Navigation Pills with New Features */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="flex justify-center mt-12 space-x-4 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl blur-xl" />
            <div className="relative flex flex-wrap justify-center gap-4 p-2 apple-glass rounded-3xl border border-white/10">
              <motion.button
                onClick={() => handleSectionChange('analytics')}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`px-6 py-3 rounded-2xl font-semibold text-base transition-all duration-700 ease-out relative overflow-hidden ${
                  activeSection === 'analytics'
                    ? 'apple-button text-white apple-shadow-lg scale-105'
                    : 'text-white/80 hover:text-white hover:apple-card'
                }`}
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Analytics</span>
                </span>
                {activeSection === 'analytics' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
              
              <motion.button
                onClick={() => handleSectionChange('prediction')}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`px-6 py-3 rounded-2xl font-semibold text-base transition-all duration-700 ease-out relative overflow-hidden ${
                  activeSection === 'prediction'
                    ? 'apple-button text-white apple-shadow-lg scale-105'
                    : 'text-white/80 hover:text-white hover:apple-card'
                }`}
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <HomeIcon className="h-5 w-5" />
                  <span>Prediction</span>
                </span>
                {activeSection === 'prediction' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>

              {/* Advanced Features */}
              <AdvancedFilters 
                onFiltersChange={handleFiltersChange}
                availableSegments={availableSegments}
              />
              
              {(prediction && customerData) && (
                <ExportFunctionality 
                  data={{
                    customerData,
                    predictionResult: prediction,
                    analyticsData: filters,
                    timestamp: new Date().toISOString()
                  }}
                  title="Customer Segmentation Analysis"
                />
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Main Dashboard */}
        <div className="max-w-7xl mx-auto space-y-12">
          {activeSection === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -40 }}
              transition={{ 
                duration: 0.8, 
                ease: [0.23, 1, 0.32, 1],
                staggerChildren: 0.1
              }}
              className="apple-section-enter"
            >
              <AdvancedSegmentationAnalytics />
            </motion.div>
          )}

          {activeSection === 'prediction' && (
            <>
              {!prediction ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 40 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -40 }}
                  transition={{ 
                    duration: 0.8, 
                    ease: [0.23, 1, 0.32, 1] 
                  }}
                  className="apple-section-enter"
                >
                  <CustomerInputForm onPredict={handlePredict} isLoading={isLoading} />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 60, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -60, scale: 0.9 }}
                  transition={{ 
                    duration: 1, 
                    ease: [0.23, 1, 0.32, 1],
                    staggerChildren: 0.2
                  }}
                  className="space-y-8"
                >
                  <PredictionResults result={prediction} customerData={customerData} />
                  
                  {/* Enhanced Reset Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="text-center space-x-6"
                  >
                    <motion.button
                      onClick={() => {
                        setPrediction(null)
                        setCustomerData(null)
                      }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="apple-glass text-white px-8 py-4 rounded-2xl hover:apple-card transition-all duration-500 font-semibold apple-ripple relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center space-x-2">
                        <HomeIcon className="h-5 w-5" />
                        <span>Analyze Another Customer</span>
                      </span>
                    </motion.button>
                    <motion.button
                      onClick={() => handleSectionChange('analytics')}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="apple-button text-white px-8 py-4 rounded-2xl transition-all duration-500 font-semibold apple-ripple relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center space-x-2">
                        <BarChart3 className="h-5 w-5" />
                        <span>View Analytics</span>
                      </span>
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}
            </>
          )}
        </div>

        {/* Enhanced Footer */}
        <motion.footer
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mt-24 apple-caption relative"
        >
          <div className="apple-glass rounded-2xl px-8 py-4 inline-block">
            <p className="flex items-center justify-center space-x-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span>Powered by AI</span>
              <span className="text-white/40">•</span>
              <span>Advanced Analytics</span>
              <span className="text-white/40">•</span>
              <span>Built with Next.js & Aceternity UI</span>
            </p>
          </div>
        </motion.footer>
      </div>
    </main>
  )
}

export default Home