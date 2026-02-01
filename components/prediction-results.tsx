"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { BentoGrid, BentoGridItem } from "@/components/aceternity/bento-grid"
import PredictionAnalyticsCharts from "./prediction-analytics-charts"

// Define icons inline to avoid import issues
const TrendingUp = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
)

const Users = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
)

const Target = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const Lightbulb = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
)

const BarChart3 = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

const Star = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
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

interface PredictionResultsProps {
  result: PredictionResult
  customerData: any
}

const Badge = ({ children, variant = "default", className = "" }: { 
  children: React.ReactNode
  variant?: "default" | "secondary" | "destructive" | "outline"
  className?: string 
}) => {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground border border-input bg-background hover:bg-accent hover:text-accent-foreground"
  }
  
  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  )
}

const MetricCard = ({ 
  title, 
  customerValue, 
  clusterValue, 
  icon: Icon, 
  formatter 
}: {
  title: string
  customerValue: number
  clusterValue: number
  icon: React.ElementType
  formatter?: (value: number) => string
}) => {
  const difference = customerValue - clusterValue
  const isPositive = difference > 0
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="glass-card rounded-xl p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon className="h-4 w-4 text-blue-400" />
          <span className="text-sm font-medium text-white">{title}</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">Your Customer</span>
          <span className="text-sm font-semibold text-white">
            {formatter ? formatter(customerValue) : customerValue}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">Cluster Average</span>
          <span className="text-sm font-semibold text-gray-300">
            {formatter ? formatter(clusterValue) : clusterValue}
          </span>
        </div>
        
        <div className="flex justify-between items-center pt-1 border-t border-white/10">
          <span className="text-xs text-gray-400">Difference</span>
          <span className={`text-sm font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{formatter ? formatter(difference) : difference}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default function PredictionResults({ result, customerData }: PredictionResultsProps) {
  const [showCharts, setShowCharts] = useState(true)
  
  const getClusterColor = (cluster: number) => {
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500', 
      'from-purple-500 to-violet-500',
      'from-orange-500 to-red-500',
      'from-pink-500 to-rose-500',
      'from-indigo-500 to-blue-500'
    ]
    return colors[cluster] || colors[0]
  }

  const getClusterIcon = (cluster: number) => {
    const icons = [Star, TrendingUp, Users, Target, BarChart3, Lightbulb]
    return icons[cluster] || Star
  }

  const ClusterIcon = getClusterIcon(result.cluster)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-6xl mx-auto space-y-8"
    >
      {/* Main Result Card */}
      <Card className="relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${getClusterColor(result.cluster)} opacity-10`} />
        <CardHeader className="text-center relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="mx-auto mb-4"
          >
            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getClusterColor(result.cluster)} flex items-center justify-center ios-shadow-lg`}>
              <ClusterIcon className="h-10 w-10 text-white" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="text-6xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
              {result.cluster}
            </div>
            <CardTitle className={`text-2xl font-bold bg-gradient-to-r ${getClusterColor(result.cluster)} bg-clip-text text-transparent`}>
              {result.clusterName}
            </CardTitle>
            <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
              {result.description}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center mt-6"
          >
            <Badge className={`bg-gradient-to-r ${getClusterColor(result.cluster)} text-white px-4 py-2 text-sm font-semibold`}>
              {result.matchScore}% Match Score
            </Badge>
          </motion.div>
        </CardHeader>
      </Card>

      {/* Quick Analytics Summary */}
      <Card className="apple-glass border border-white/10 rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-white/70" />
            <span>Analytics Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center space-y-2 apple-card p-4 rounded-xl border border-white/5"
            >
              <div className="text-2xl font-bold text-white">{result.matchScore}%</div>
              <div className="text-xs text-white/60">Segment Match</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center space-y-2 apple-card p-4 rounded-xl border border-white/5"
            >
              <div className="text-2xl font-bold text-white">
                {Math.round(((customerData.income / result.characteristics.income) * 100))}%
              </div>
              <div className="text-xs text-white/60">Income vs Avg</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center space-y-2 apple-card p-4 rounded-xl border border-white/5"
            >
              <div className="text-2xl font-bold text-white">
                {customerData.numWebPurchases + customerData.numStorePurchases}
              </div>
              <div className="text-xs text-white/60">Total Purchases</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center space-y-2 apple-card p-4 rounded-xl border border-white/5"
            >
              <div className="text-2xl font-bold text-white">
                {Math.max(1, Math.round(100 - customerData.recency))}
              </div>
              <div className="text-xs text-white/60">Activity Score</div>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Charts Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="apple-glass border border-white/10 rounded-2xl mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-white/70" />
                <span>Detailed Analytics</span>
              </CardTitle>
              <motion.button
                onClick={() => setShowCharts(!showCharts)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="apple-glass px-4 py-2 rounded-xl text-sm font-medium text-white hover:bg-white/10 transition-all duration-300 border border-white/10"
              >
                {showCharts ? 'Hide Charts' : 'Show Charts'}
              </motion.button>
            </div>
            <p className="text-white/60 text-sm">
              Interactive charts and graphs showing detailed customer analysis
            </p>
          </CardHeader>
        </Card>
        
        {showCharts && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PredictionAnalyticsCharts result={result} customerData={customerData} />
          </motion.div>
        )}
      </motion.div>

      {/* Metrics Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-400" />
            <span>Detailed Comparison</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Income"
              customerValue={customerData.income}
              clusterValue={result.characteristics.income}
              icon={TrendingUp}
              formatter={formatCurrency}
            />
            <MetricCard
              title="Age"
              customerValue={customerData.age}
              clusterValue={result.characteristics.age}
              icon={Users}
            />
            <MetricCard
              title="Total Spending"
              customerValue={customerData.totalSpending}
              clusterValue={result.characteristics.totalSpending}
              icon={Target}
              formatter={formatCurrency}
            />
            <MetricCard
              title="Recency"
              customerValue={customerData.recency}
              clusterValue={result.characteristics.recency}
              icon={BarChart3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem]">
        <BentoGridItem
          title="Marketing Recommendations"
          description="Tailored strategies for this customer segment"
          header={
            <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
              <Lightbulb className="h-8 w-8 text-blue-400" />
            </div>
          }
          className="md:col-span-2"
          icon={<Lightbulb className="h-4 w-4 text-neutral-500" />}
        />
        <BentoGridItem
          title="Segment Insights"
          description={`Cluster ${result.cluster} represents ${result.clusterName} customers`}
          header={
            <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 flex items-center justify-center">
              <Users className="h-8 w-8 text-green-400" />
            </div>
          }
          icon={<Users className="h-4 w-4 text-neutral-500" />}
        />
      </BentoGrid>

      {/* Recommendations List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-yellow-400" />
            <span>Actionable Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {result.recommendations.map((recommendation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-start space-x-3 p-4 glass-card rounded-xl"
              >
                <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getClusterColor(result.cluster)} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <span className="text-white text-sm font-bold">{index + 1}</span>
                </div>
                <p className="text-gray-300 leading-relaxed">{recommendation}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}