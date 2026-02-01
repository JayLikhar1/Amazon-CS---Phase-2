"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { formatCurrency } from "@/lib/utils"

// Define icons inline to avoid import issues
const User = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

const DollarSign = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
  </svg>
)

const ShoppingCart = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
  </svg>
)

const Calendar = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const Globe = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
)

const Store = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
)

const MousePointer = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
  </svg>
)

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

interface CustomerInputFormProps {
  onPredict: (data: CustomerData) => void
  isLoading?: boolean
}

const SliderField = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  icon: Icon,
  formatter,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
  icon: React.ElementType
  formatter?: (value: number) => string
}) => {
  const [inputValue, setInputValue] = useState(value.toString())
  const [isEditing, setIsEditing] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputBlur = () => {
    const numValue = parseFloat(inputValue)
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue)
    } else {
      setInputValue(value.toString())
    }
    setIsEditing(false)
  }

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur()
    }
    if (e.key === 'Escape') {
      setInputValue(value.toString())
      setIsEditing(false)
    }
  }

  useEffect(() => {
    if (!isEditing) {
      setInputValue(value.toString())
    }
  }, [value, isEditing])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.01 }}
      className="space-y-4 apple-card p-6 rounded-2xl border border-white/5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-white/5 border border-white/10">
            <Icon className="h-4 w-4 text-white/70" />
          </div>
          <label className="text-sm font-medium text-white/90 apple-body">{label}</label>
        </div>
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <input
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyPress}
              min={min}
              max={max}
              step={step}
              className="w-24 px-3 py-2 text-sm font-medium bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 apple-focus"
              autoFocus
            />
          ) : (
            <motion.button
              onClick={() => setIsEditing(true)}
              key={value}
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="text-sm font-medium px-4 py-2 rounded-xl bg-white/8 hover:bg-white/12 transition-all duration-300 cursor-pointer text-white/90 border border-white/10"
              title="Click to edit manually"
            >
              {formatter ? formatter(value) : value}
            </motion.button>
          )}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 rounded-xl hover:bg-white/5 transition-colors duration-200 border border-transparent hover:border-white/10"
            title={isEditing ? "Cancel editing" : "Edit manually"}
          >
            {isEditing ? (
              <svg className="h-4 w-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-4 w-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            )}
          </button>
        </div>
      </div>
      <Slider
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        min={min}
        max={max}
        step={step}
        className={`w-full transition-opacity duration-300 ${isEditing ? 'opacity-40' : 'opacity-100'}`}
        disabled={isEditing}
      />
      <div className="flex justify-between text-xs apple-caption">
        <span className="text-white/50">{formatter ? formatter(min) : min}</span>
        <span className="text-center flex-1 text-white/40">
          {isEditing ? (
            <span>Press Enter to confirm, Escape to cancel</span>
          ) : (
            <span>Drag slider or click value to edit</span>
          )}
        </span>
        <span className="text-white/50">{formatter ? formatter(max) : max}</span>
      </div>
    </motion.div>
  )
}

export default function CustomerInputForm({ onPredict, isLoading }: CustomerInputFormProps) {
  const [customerData, setCustomerData] = useState<CustomerData>({
    age: 35,
    income: 50000,
    totalSpending: 1000,
    recency: 30,
    customerSince: 1000,
    numWebPurchases: 5,
    numStorePurchases: 3,
    numWebVisitsMonth: 4,
  })

  const updateField = (field: keyof CustomerData, value: number) => {
    setCustomerData(prev => ({ ...prev, [field]: value }))
  }

  const handlePredict = () => {
    onPredict(customerData)
  }

  // Preset customer profiles for quick testing
  const presets = [
    {
      name: "Young Professional",
      icon: "👤",
      description: "Tech-savvy, high income",
      data: { age: 28, income: 65000, totalSpending: 1500, recency: 15, customerSince: 800, numWebPurchases: 8, numStorePurchases: 2, numWebVisitsMonth: 6 }
    },
    {
      name: "Budget Conscious",
      icon: "💼",
      description: "Price-sensitive shopper",
      data: { age: 45, income: 35000, totalSpending: 400, recency: 60, customerSince: 2000, numWebPurchases: 2, numStorePurchases: 4, numWebVisitsMonth: 8 }
    },
    {
      name: "Premium Customer",
      icon: "⭐",
      description: "High-value, loyal buyer",
      data: { age: 52, income: 120000, totalSpending: 3500, recency: 10, customerSince: 1200, numWebPurchases: 12, numStorePurchases: 6, numWebVisitsMonth: 4 }
    },
    {
      name: "Senior Customer",
      icon: "👥",
      description: "Traditional shopping patterns",
      data: { age: 68, income: 45000, totalSpending: 800, recency: 45, customerSince: 3500, numWebPurchases: 3, numStorePurchases: 7, numWebVisitsMonth: 5 }
    }
  ]

  const applyPreset = (preset: typeof presets[0]) => {
    setCustomerData(preset.data)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      className="w-full max-w-5xl mx-auto"
    >
      <Card className="apple-glass border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl">
        <CardHeader className="text-center pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <CardTitle className="text-3xl font-bold apple-title mb-6">
              Customer Profile Input
            </CardTitle>
            <p className="apple-body text-white/70 mb-6 max-w-2xl mx-auto">
              Configure customer parameters to analyze segmentation patterns and generate insights
            </p>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="apple-glass rounded-2xl p-4 max-w-2xl mx-auto border border-white/10"
            >
              <div className="flex items-center justify-center space-x-6 text-sm text-white/60">
                <div className="flex items-center space-x-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <span>Click values to edit</span>
                </div>
                <div className="w-px h-4 bg-white/20"></div>
                <div className="flex items-center space-x-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                  <span>Drag sliders to adjust</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Quick Presets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white apple-subtitle mb-2">Quick Presets</h3>
              <p className="text-sm text-white/60">Select a customer profile to populate all fields</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {presets.map((preset, index) => (
                <motion.button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  className="apple-card p-4 rounded-2xl text-center hover:bg-white/8 transition-all duration-300 border border-white/5 hover:border-white/10 group"
                >
                  <div className="text-2xl mb-3 group-hover:scale-110 transition-transform duration-300">{preset.icon}</div>
                  <div className="text-sm font-medium text-white mb-1">{preset.name}</div>
                  <div className="text-xs text-white/50">{preset.description}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div className="space-y-6">
              <SliderField
                label="Age"
                value={customerData.age}
                onChange={(value) => updateField('age', value)}
                min={18}
                max={90}
                icon={User}
              />
              
              <SliderField
                label="Annual Income"
                value={customerData.income}
                onChange={(value) => updateField('income', value)}
                min={0}
                max={200000}
                step={1000}
                icon={DollarSign}
                formatter={formatCurrency}
              />
              
              <SliderField
                label="Total Spending"
                value={customerData.totalSpending}
                onChange={(value) => updateField('totalSpending', value)}
                min={0}
                max={10000}
                step={50}
                icon={ShoppingCart}
                formatter={formatCurrency}
              />
              
              <SliderField
                label="Recency (Days)"
                value={customerData.recency}
                onChange={(value) => updateField('recency', value)}
                min={0}
                max={100}
                icon={Calendar}
              />
            </div>
            
            <div className="space-y-6">
              <SliderField
                label="Customer Since (Days)"
                value={customerData.customerSince}
                onChange={(value) => updateField('customerSince', value)}
                min={0}
                max={5000}
                step={50}
                icon={Calendar}
              />
              
              <SliderField
                label="Web Purchases"
                value={customerData.numWebPurchases}
                onChange={(value) => updateField('numWebPurchases', value)}
                min={0}
                max={50}
                icon={Globe}
              />
              
              <SliderField
                label="Store Purchases"
                value={customerData.numStorePurchases}
                onChange={(value) => updateField('numStorePurchases', value)}
                min={0}
                max={50}
                icon={Store}
              />
              
              <SliderField
                label="Web Visits/Month"
                value={customerData.numWebVisitsMonth}
                onChange={(value) => updateField('numWebVisitsMonth', value)}
                min={0}
                max={30}
                icon={MousePointer}
              />
            </div>
          </motion.div>
          
          {/* Professional Summary Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, staggerChildren: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
          >
            <motion.div 
              whileHover={{ scale: 1.02, y: -2 }}
              className="apple-card rounded-2xl p-5 text-center border border-white/5 hover:border-white/10 transition-all duration-300"
            >
              <div className="text-2xl font-bold text-white mb-1">{customerData.age}</div>
              <div className="text-xs text-white/60 font-medium">Years Old</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02, y: -2 }}
              className="apple-card rounded-2xl p-5 text-center border border-white/5 hover:border-white/10 transition-all duration-300"
            >
              <div className="text-2xl font-bold text-white mb-1">{formatCurrency(customerData.income)}</div>
              <div className="text-xs text-white/60 font-medium">Annual Income</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02, y: -2 }}
              className="apple-card rounded-2xl p-5 text-center border border-white/5 hover:border-white/10 transition-all duration-300"
            >
              <div className="text-2xl font-bold text-white mb-1">{formatCurrency(customerData.totalSpending)}</div>
              <div className="text-xs text-white/60 font-medium">Total Spending</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02, y: -2 }}
              className="apple-card rounded-2xl p-5 text-center border border-white/5 hover:border-white/10 transition-all duration-300"
            >
              <div className="text-2xl font-bold text-white mb-1">{customerData.recency}</div>
              <div className="text-xs text-white/60 font-medium">Days Since Last Purchase</div>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="pt-8 space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handlePredict}
                disabled={isLoading}
                size="lg"
                className="flex-1 text-lg font-semibold apple-button relative overflow-hidden border-0"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-3">
                    <div className="apple-spinner"></div>
                    <span>Analyzing Customer Profile...</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center space-x-3">
                    <span>Analyze Customer Segment</span>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                )}
              </Button>
              <motion.button
                onClick={() => setCustomerData({
                  age: 35,
                  income: 50000,
                  totalSpending: 1000,
                  recency: 30,
                  customerSince: 1000,
                  numWebPurchases: 5,
                  numStorePurchases: 3,
                  numWebVisitsMonth: 4,
                })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 apple-glass text-white rounded-2xl hover:bg-white/8 transition-all duration-300 font-semibold flex items-center justify-center space-x-2 border border-white/10 hover:border-white/20"
                disabled={isLoading}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Reset to Default</span>
              </motion.button>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}