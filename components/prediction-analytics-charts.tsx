"use client"

import React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

// Define icons inline
const BarChart3 = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

const PieChart = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
  </svg>
)

const TrendingUp = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
)

const Activity = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

interface PredictionResult {
  cluster: number
  clusterName: string
  description: string
  recommendations: string[]
  characteristics: {
    income: number
    age: number
    totalSpending: number
    recency: number
    customerSince: number
    numWebPurchases: number
    numStorePurchases: number
    numWebVisitsMonth: number
  }
  matchScore: number
}

interface CustomerData {
  age: number
  income: number
  totalSpending: number
  recency: number
  customerSince: number
  numWebPurchases: number
  numStorePurchases: number
  numWebVisitsMonth: number
}

interface PredictionAnalyticsChartsProps {
  result: PredictionResult
  customerData: CustomerData
}

// Simple Bar Chart Component
const BarChart = ({ 
  data, 
  title, 
  color = "bg-blue-500" 
}: { 
  data: { label: string; value: number; max: number }[]
  title: string
  color?: string
}) => {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-white/80">{title}</h4>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-white/70">{item.label}</span>
              <span className="text-white/90 font-medium">{item.value}</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(item.value / item.max) * 100}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className={`h-2 rounded-full ${color}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Simple Donut Chart Component
const DonutChart = ({ 
  data, 
  title, 
  centerValue, 
  centerLabel 
}: { 
  data: { label: string; value: number; color: string }[]
  title: string
  centerValue: string
  centerLabel: string
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let cumulativePercentage = 0

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-white/80">{title}</h4>
      <div className="flex items-center justify-center">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="2"
            />
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100
              const strokeDasharray = `${percentage} ${100 - percentage}`
              const strokeDashoffset = -cumulativePercentage
              cumulativePercentage += percentage
              
              return (
                <motion.path
                  key={index}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={item.color}
                  strokeWidth="2"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  initial={{ strokeDasharray: "0 100" }}
                  animate={{ strokeDasharray }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              )
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-lg font-bold text-white">{centerValue}</div>
            <div className="text-xs text-white/60">{centerLabel}</div>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }} />
              <span className="text-white/70">{item.label}</span>
            </div>
            <span className="text-white/90 font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Radar Chart Component (simplified)
const RadarChart = ({ 
  data, 
  title 
}: { 
  data: { label: string; customer: number; cluster: number; max: number }[]
  title: string
}) => {
  const size = 120
  const center = size / 2
  const radius = 40
  const angleStep = (2 * Math.PI) / data.length

  const getPoint = (value: number, index: number, maxValue: number) => {
    const angle = angleStep * index - Math.PI / 2
    const normalizedValue = (value / maxValue) * radius
    const x = center + normalizedValue * Math.cos(angle)
    const y = center + normalizedValue * Math.sin(angle)
    return { x, y }
  }

  const customerPoints = data.map((item, index) => getPoint(item.customer, index, item.max))
  const clusterPoints = data.map((item, index) => getPoint(item.cluster, index, item.max))

  const createPath = (points: { x: number; y: number }[]) => {
    return points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ') + ' Z'
  }

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-white/80">{title}</h4>
      <div className="flex justify-center">
        <svg width={size} height={size} className="overflow-visible">
          {/* Grid circles */}
          {[0.2, 0.4, 0.6, 0.8, 1].map((scale, index) => (
            <circle
              key={index}
              cx={center}
              cy={center}
              r={radius * scale}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
          ))}
          
          {/* Grid lines */}
          {data.map((_, index) => {
            const angle = angleStep * index - Math.PI / 2
            const x = center + radius * Math.cos(angle)
            const y = center + radius * Math.sin(angle)
            return (
              <line
                key={index}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            )
          })}
          
          {/* Cluster area */}
          <motion.path
            d={createPath(clusterPoints)}
            fill="rgba(156, 163, 175, 0.2)"
            stroke="rgb(156, 163, 175)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          
          {/* Customer area */}
          <motion.path
            d={createPath(customerPoints)}
            fill="rgba(59, 130, 246, 0.3)"
            stroke="rgb(59, 130, 246)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          />
          
          {/* Labels */}
          {data.map((item, index) => {
            const angle = angleStep * index - Math.PI / 2
            const labelRadius = radius + 15
            const x = center + labelRadius * Math.cos(angle)
            const y = center + labelRadius * Math.sin(angle)
            return (
              <text
                key={index}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs fill-white/70"
              >
                {item.label}
              </text>
            )
          })}
        </svg>
      </div>
      <div className="flex justify-center space-x-4 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-blue-500 rounded-full" />
          <span className="text-white/70">Your Customer</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-gray-400 rounded-full" />
          <span className="text-white/70">Cluster Average</span>
        </div>
      </div>
    </div>
  )
}

export default function PredictionAnalyticsCharts({ result, customerData }: PredictionAnalyticsChartsProps) {
  // Prepare data for charts
  const comparisonData = [
    { 
      label: "Income", 
      value: customerData.income, 
      max: Math.max(customerData.income, result.characteristics.income, 200000) 
    },
    { 
      label: "Total Spending", 
      value: customerData.totalSpending, 
      max: Math.max(customerData.totalSpending, result.characteristics.totalSpending, 10000) 
    },
    { 
      label: "Web Purchases", 
      value: customerData.numWebPurchases, 
      max: Math.max(customerData.numWebPurchases, result.characteristics.numWebPurchases, 50) 
    },
    { 
      label: "Store Purchases", 
      value: customerData.numStorePurchases, 
      max: Math.max(customerData.numStorePurchases, result.characteristics.numStorePurchases, 50) 
    }
  ]

  const clusterComparisonData = [
    { 
      label: "Income", 
      value: result.characteristics.income, 
      max: Math.max(customerData.income, result.characteristics.income, 200000) 
    },
    { 
      label: "Total Spending", 
      value: result.characteristics.totalSpending, 
      max: Math.max(customerData.totalSpending, result.characteristics.totalSpending, 10000) 
    },
    { 
      label: "Web Purchases", 
      value: result.characteristics.numWebPurchases, 
      max: Math.max(customerData.numWebPurchases, result.characteristics.numWebPurchases, 50) 
    },
    { 
      label: "Store Purchases", 
      value: result.characteristics.numStorePurchases, 
      max: Math.max(customerData.numStorePurchases, result.characteristics.numStorePurchases, 50) 
    }
  ]

  const behaviorData = [
    { label: "Web Purchases", value: customerData.numWebPurchases, color: "#3B82F6" },
    { label: "Store Purchases", value: customerData.numStorePurchases, color: "#10B981" },
    { label: "Web Visits/Month", value: customerData.numWebVisitsMonth, color: "#8B5CF6" }
  ]

  const radarData = [
    { 
      label: "Income", 
      customer: customerData.income / 1000, 
      cluster: result.characteristics.income / 1000, 
      max: 200 
    },
    { 
      label: "Spending", 
      customer: customerData.totalSpending / 100, 
      cluster: result.characteristics.totalSpending / 100, 
      max: 100 
    },
    { 
      label: "Age", 
      customer: customerData.age, 
      cluster: result.characteristics.age, 
      max: 90 
    },
    { 
      label: "Recency", 
      customer: 100 - customerData.recency, 
      cluster: 100 - result.characteristics.recency, 
      max: 100 
    },
    { 
      label: "Web Purchases", 
      customer: customerData.numWebPurchases, 
      cluster: result.characteristics.numWebPurchases, 
      max: 50 
    }
  ]

  const engagementScore = Math.round(
    ((customerData.numWebPurchases + customerData.numStorePurchases) * 10 + 
     customerData.numWebVisitsMonth * 5 + 
     (100 - customerData.recency)) / 4
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-6xl mx-auto space-y-6"
    >
      {/* Charts Header */}
      <Card className="apple-glass border border-white/10 rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <BarChart3 className="h-6 w-6 text-white/70" />
            <span className="apple-title text-xl">Analytics & Insights</span>
          </CardTitle>
          <p className="text-white/60 apple-body">
            Comprehensive analysis of customer behavior and segment characteristics
          </p>
        </CardHeader>
      </Card>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Profile Chart */}
        <Card className="apple-card border border-white/5 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <BarChart3 className="h-5 w-5 text-white/70" />
              <span>Customer Profile</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart 
              data={comparisonData} 
              title="Your Customer Metrics"
              color="bg-blue-500"
            />
          </CardContent>
        </Card>

        {/* Cluster Average Chart */}
        <Card className="apple-card border border-white/5 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <TrendingUp className="h-5 w-5 text-white/70" />
              <span>Cluster Average</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart 
              data={clusterComparisonData} 
              title={`${result.clusterName} Segment`}
              color="bg-gray-500"
            />
          </CardContent>
        </Card>

        {/* Behavior Distribution */}
        <Card className="apple-card border border-white/5 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <PieChart className="h-5 w-5 text-white/70" />
              <span>Behavior Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart 
              data={behaviorData}
              title="Purchase & Engagement Patterns"
              centerValue={`${engagementScore}`}
              centerLabel="Engagement Score"
            />
          </CardContent>
        </Card>

        {/* Radar Comparison */}
        <Card className="apple-card border border-white/5 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Activity className="h-5 w-5 text-white/70" />
              <span>Multi-Dimensional Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadarChart 
              data={radarData}
              title="Customer vs Cluster Comparison"
            />
          </CardContent>
        </Card>
      </div>

      {/* Key Insights */}
      <Card className="apple-card border border-white/5 rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg">
            <TrendingUp className="h-5 w-5 text-white/70" />
            <span>Key Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center space-y-2"
            >
              <div className="text-3xl font-bold text-white">{result.matchScore}%</div>
              <div className="text-sm text-white/60">Segment Match</div>
              <div className="text-xs text-white/50">
                How well this customer fits the predicted segment
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center space-y-2"
            >
              <div className="text-3xl font-bold text-white">{engagementScore}</div>
              <div className="text-sm text-white/60">Engagement Score</div>
              <div className="text-xs text-white/50">
                Overall customer activity and interaction level
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center space-y-2"
            >
              <div className="text-3xl font-bold text-white">
                {customerData.numWebPurchases + customerData.numStorePurchases}
              </div>
              <div className="text-sm text-white/60">Total Purchases</div>
              <div className="text-xs text-white/50">
                Combined online and offline purchase activity
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Predictive Insights */}
      <Card className="apple-card border border-white/5 rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Activity className="h-5 w-5 text-white/70" />
            <span>Predictive Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-white/80">Customer Behavior Trends</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 apple-card rounded-xl border border-white/5">
                  <span className="text-sm text-white/70">Purchase Frequency</span>
                  <span className="text-sm font-medium text-white">
                    {customerData.recency < 30 ? 'High' : customerData.recency < 60 ? 'Medium' : 'Low'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 apple-card rounded-xl border border-white/5">
                  <span className="text-sm text-white/70">Channel Preference</span>
                  <span className="text-sm font-medium text-white">
                    {customerData.numWebPurchases > customerData.numStorePurchases ? 'Online' : 'In-Store'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 apple-card rounded-xl border border-white/5">
                  <span className="text-sm text-white/70">Value Tier</span>
                  <span className="text-sm font-medium text-white">
                    {customerData.totalSpending > 2000 ? 'High' : customerData.totalSpending > 800 ? 'Medium' : 'Low'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-white/80">Segment Characteristics</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 apple-card rounded-xl border border-white/5">
                  <span className="text-sm text-white/70">Avg Income</span>
                  <span className="text-sm font-medium text-white">
                    {formatCurrency(result.characteristics.income)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 apple-card rounded-xl border border-white/5">
                  <span className="text-sm text-white/70">Avg Spending</span>
                  <span className="text-sm font-medium text-white">
                    {formatCurrency(result.characteristics.totalSpending)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 apple-card rounded-xl border border-white/5">
                  <span className="text-sm text-white/70">Avg Age</span>
                  <span className="text-sm font-medium text-white">
                    {result.characteristics.age} years
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}