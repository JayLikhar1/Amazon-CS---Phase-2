"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { analyticsStore, AnalyticsData } from "@/lib/analytics-store"

// Icons
const Users = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
)

const TrendingUp = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
)

const Target = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const DollarSign = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
  </svg>
)

const BarChart3 = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

const Lightbulb = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
)

const SegmentOverview = ({ analyticsData }: { analyticsData: AnalyticsData }) => {
  const segmentColors = [
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500', 
    'from-purple-500 to-violet-500',
    'from-orange-500 to-red-500',
    'from-pink-500 to-rose-500',
    'from-indigo-500 to-blue-500'
  ]

  const segmentDescriptions = {
    0: "High-income, loyal customers with consistent purchasing behavior",
    1: "Price-sensitive customers who respond well to promotions",
    2: "Mature customers with traditional shopping preferences",
    3: "Balanced customers using both online and offline channels",
    4: "Premium customers with exceptional spending power",
    5: "Average customers with moderate engagement levels"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-blue-400" />
          <span>Customer Segment Overview</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {analyticsData.topSegments.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Segmentation Data</h3>
            <p>Start making predictions to see detailed customer segment analysis</p>
          </div>
        ) : (
          <div className="space-y-4">
            {analyticsData.topSegments.map((segment, index) => {
              const conversionData = analyticsData.conversionTrends.find(t => t.segment === segment.segment)
              return (
                <motion.div
                  key={segment.segment}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card rounded-xl p-6 relative overflow-hidden"
                >
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${segmentColors[segment.segment] || segmentColors[0]} opacity-5`} />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${segmentColors[segment.segment] || segmentColors[0]}`} />
                        <div>
                          <h3 className="text-lg font-semibold text-white">{segment.name}</h3>
                          <p className="text-sm text-gray-400">{segmentDescriptions[segment.segment as keyof typeof segmentDescriptions]}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">{segment.percentage.toFixed(1)}%</div>
                        <div className="text-sm text-gray-400">{segment.count} customers</div>
                      </div>
                    </div>
                    
                    {conversionData && (
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                          <div className="text-lg font-semibold text-white">{formatCurrency(conversionData.avgSpending)}</div>
                          <div className="text-xs text-gray-400">Avg Spending</div>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                          <div className="text-lg font-semibold text-white">{formatCurrency(conversionData.avgIncome)}</div>
                          <div className="text-xs text-gray-400">Avg Income</div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const SegmentComparison = ({ analyticsData }: { analyticsData: AnalyticsData }) => {
  const getSegmentMetrics = () => {
    return analyticsData.topSegments.map(segment => {
      const conversionData = analyticsData.conversionTrends.find(t => t.segment === segment.segment)
      return {
        ...segment,
        avgSpending: conversionData?.avgSpending || 0,
        avgIncome: conversionData?.avgIncome || 0,
        valueRatio: conversionData ? (conversionData.avgSpending / conversionData.avgIncome) * 100 : 0
      }
    }).sort((a, b) => b.avgSpending - a.avgSpending)
  }

  const metrics = getSegmentMetrics()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-purple-400" />
          <span>Segment Performance Comparison</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {metrics.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No comparison data available yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {metrics.map((segment, index) => (
              <motion.div
                key={segment.segment}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 glass-card rounded-xl"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl font-bold text-white">#{index + 1}</div>
                  <div>
                    <div className="font-medium text-white">{segment.name}</div>
                    <div className="text-sm text-gray-400">{segment.count} customers ({segment.percentage.toFixed(1)}%)</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="font-semibold text-green-400">{formatCurrency(segment.avgSpending)}</div>
                    <div className="text-xs text-gray-400">Avg Spending</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-blue-400">{segment.valueRatio.toFixed(1)}%</div>
                    <div className="text-xs text-gray-400">Value Ratio</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const SegmentInsights = ({ analyticsData }: { analyticsData: AnalyticsData }) => {
  const generateAdvancedInsights = (): string[] => {
    const insights: string[] = []
    
    if (analyticsData.topSegments.length > 0) {
      // Top segment analysis
      const topSegment = analyticsData.topSegments[0]
      insights.push(`${topSegment.name} is your dominant segment with ${topSegment.percentage.toFixed(1)}% of customers`)
      
      // High-value segment identification
      const highValueSegments = analyticsData.conversionTrends
        .filter(trend => trend.avgSpending > 2000)
        .map(trend => analyticsData.topSegments.find(s => s.segment === trend.segment))
        .filter(Boolean)
      
      if (highValueSegments.length > 0) {
        insights.push(`${highValueSegments.length} segment(s) show high-value characteristics (>$2000 avg spending)`)
      }
      
      // Segment diversity analysis
      if (analyticsData.topSegments.length >= 4) {
        insights.push(`Good customer diversity with ${analyticsData.topSegments.length} active segments`)
      } else if (analyticsData.topSegments.length <= 2) {
        insights.push(`Limited segment diversity - consider expanding customer acquisition`)
      }
      
      // Value concentration analysis
      const totalValue = analyticsData.conversionTrends.reduce((sum, trend) => {
        const segment = analyticsData.topSegments.find(s => s.segment === trend.segment)
        return sum + (segment ? trend.avgSpending * segment.count : 0)
      }, 0)
      
      if (totalValue > 0) {
        const topSegmentValue = analyticsData.conversionTrends.find(t => t.segment === topSegment.segment)
        if (topSegmentValue) {
          const topSegmentContribution = (topSegmentValue.avgSpending * topSegment.count / totalValue) * 100
          if (topSegmentContribution > 60) {
            insights.push(`${topSegment.name} segment contributes ${topSegmentContribution.toFixed(1)}% of total customer value`)
          }
        }
      }
      
      // Confidence analysis
      if (analyticsData.averageConfidence > 90) {
        insights.push(`High prediction confidence (${analyticsData.averageConfidence.toFixed(1)}%) indicates strong segmentation model`)
      } else if (analyticsData.averageConfidence < 80) {
        insights.push(`Lower confidence scores suggest need for model refinement or more data`)
      }
    }
    
    return insights.slice(0, 6)
  }

  const insights = generateAdvancedInsights()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Lightbulb className="h-5 w-5 text-yellow-400" />
          <span>Advanced Segmentation Insights</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Generate predictions to unlock advanced segmentation insights</p>
          </div>
        ) : (
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-4 glass-card rounded-xl ${index === 0 ? 'border border-yellow-400/30' : ''}`}
              >
                <div className="flex items-start space-x-3">
                  {index === 0 && <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 animate-pulse" />}
                  <p className="text-sm text-white leading-relaxed">{insight}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const SegmentationSummary = ({ analyticsData }: { analyticsData: AnalyticsData }) => {
  const summaryCards = [
    {
      icon: Users,
      value: analyticsData.totalPredictions,
      label: "Total Predictions",
      gradient: "apple-gradient-blue",
      delay: 0
    },
    {
      icon: Target,
      value: `${analyticsData.averageConfidence.toFixed(1)}%`,
      label: "Avg Confidence",
      gradient: "apple-gradient-green",
      delay: 0.1
    },
    {
      icon: DollarSign,
      value: formatCurrency(analyticsData.averageCustomerValue),
      label: "Avg Customer Value",
      gradient: "apple-gradient-purple",
      delay: 0.2
    },
    {
      icon: TrendingUp,
      value: analyticsData.topSegments.length,
      label: "Active Segments",
      gradient: "apple-gradient-orange",
      delay: 0.3
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {summaryCards.map((card, index) => {
        const Icon = card.icon
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.6, 
              delay: card.delay,
              ease: [0.23, 1, 0.32, 1]
            }}
            className="apple-carousel-card p-6 text-center group"
          >
            <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${card.gradient} flex items-center justify-center apple-shadow group-hover:scale-110 transition-transform duration-500`}>
              <Icon className="h-8 w-8 text-white" />
            </div>
            <div className="text-3xl font-bold apple-subtitle mb-2">{card.value}</div>
            <div className="apple-caption">{card.label}</div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default function AdvancedSegmentationAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalPredictions: 0,
    predictionsToday: 0,
    averageConfidence: 0,
    segmentDistribution: {},
    hourlyPredictions: [],
    topSegments: [],
    averageCustomerValue: 0,
    conversionTrends: []
  })

  useEffect(() => {
    // Subscribe to analytics updates
    const unsubscribe = analyticsStore.subscribe((data) => {
      setAnalyticsData(data)
    })

    return unsubscribe
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="text-center mb-12"
      >
        <h2 className="text-5xl md:text-6xl font-bold apple-title mb-4">
          Advanced Customer Segmentation Analytics
        </h2>
        <p className="apple-body text-lg max-w-3xl mx-auto">Deep insights based on your customer segmentation predictions</p>
      </motion.div>

      {/* Summary Cards */}
      <SegmentationSummary analyticsData={analyticsData} />

      {/* Main Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SegmentOverview analyticsData={analyticsData} />
        <SegmentComparison analyticsData={analyticsData} />
      </div>

      {/* Advanced Insights */}
      <SegmentInsights analyticsData={analyticsData} />
    </div>
  )
}