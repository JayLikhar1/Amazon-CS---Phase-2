"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { formatCurrency } from "@/lib/utils"

// Icons
const Filter = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
  </svg>
)

const X = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const Search = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

interface FilterState {
  dateRange: {
    start: string
    end: string
  }
  ageRange: [number, number]
  incomeRange: [number, number]
  spendingRange: [number, number]
  segments: string[]
  searchTerm: string
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterState) => void
  availableSegments: string[]
}

export default function AdvancedFilters({ onFiltersChange, availableSegments }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    dateRange: {
      start: '',
      end: ''
    },
    ageRange: [18, 90],
    incomeRange: [0, 200000],
    spendingRange: [0, 10000],
    segments: [],
    searchTerm: ''
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFiltersChange(updatedFilters)
  }

  const resetFilters = () => {
    const defaultFilters: FilterState = {
      dateRange: { start: '', end: '' },
      ageRange: [18, 90],
      incomeRange: [0, 200000],
      spendingRange: [0, 10000],
      segments: [],
      searchTerm: ''
    }
    setFilters(defaultFilters)
    onFiltersChange(defaultFilters)
  }

  const toggleSegment = (segment: string) => {
    const newSegments = filters.segments.includes(segment)
      ? filters.segments.filter(s => s !== segment)
      : [...filters.segments, segment]
    updateFilters({ segments: newSegments })
  }

  const activeFiltersCount = [
    filters.dateRange.start || filters.dateRange.end,
    filters.ageRange[0] !== 18 || filters.ageRange[1] !== 90,
    filters.incomeRange[0] !== 0 || filters.incomeRange[1] !== 200000,
    filters.spendingRange[0] !== 0 || filters.spendingRange[1] !== 10000,
    filters.segments.length > 0,
    filters.searchTerm.length > 0
  ].filter(Boolean).length

  // Modal component
  const Modal = () => (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)'
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="relative bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            style={{ zIndex: 99999 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Advanced Filters</span>
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors duration-200"
              >
                <X className="h-5 w-5 text-white/70" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                  <input
                    type="text"
                    value={filters.searchTerm}
                    onChange={(e) => updateFilters({ searchTerm: e.target.value })}
                    placeholder="Search customers..."
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                  />
                </div>
              </div>

              {/* Age Range */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-white/80">Age Range</label>
                  <span className="text-sm text-white/60 bg-white/10 px-3 py-1 rounded-full">
                    {filters.ageRange[0]} - {filters.ageRange[1]} years
                  </span>
                </div>
                <Slider
                  value={filters.ageRange}
                  onValueChange={(value) => updateFilters({ ageRange: value as [number, number] })}
                  min={18}
                  max={90}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Income Range */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-white/80">Income Range</label>
                  <span className="text-sm text-white/60 bg-white/10 px-3 py-1 rounded-full">
                    {formatCurrency(filters.incomeRange[0])} - {formatCurrency(filters.incomeRange[1])}
                  </span>
                </div>
                <Slider
                  value={filters.incomeRange}
                  onValueChange={(value) => updateFilters({ incomeRange: value as [number, number] })}
                  min={0}
                  max={200000}
                  step={5000}
                  className="w-full"
                />
              </div>

              {/* Spending Range */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-white/80">Spending Range</label>
                  <span className="text-sm text-white/60 bg-white/10 px-3 py-1 rounded-full">
                    {formatCurrency(filters.spendingRange[0])} - {formatCurrency(filters.spendingRange[1])}
                  </span>
                </div>
                <Slider
                  value={filters.spendingRange}
                  onValueChange={(value) => updateFilters({ spendingRange: value as [number, number] })}
                  min={0}
                  max={10000}
                  step={100}
                  className="w-full"
                />
              </div>

              {/* Segments */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-white/80">Customer Segments</label>
                <div className="flex flex-wrap gap-2">
                  {availableSegments.map((segment) => (
                    <motion.button
                      key={segment}
                      onClick={() => toggleSegment(segment)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        filters.segments.includes(segment)
                          ? 'bg-blue-500 text-white shadow-lg'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {segment}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6 border-t border-white/20">
                <Button
                  onClick={resetFilters}
                  variant="outline"
                  className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30"
                >
                  Reset All
                </Button>
                <Button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )

  return (
    <>
      {/* Filter Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="apple-glass px-6 py-3 rounded-2xl text-white font-medium flex items-center space-x-3 hover:bg-white/10 transition-all duration-300 border border-white/10"
      >
        <Filter className="h-5 w-5" />
        <span>Advanced Filters</span>
        {activeFiltersCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold"
          >
            {activeFiltersCount}
          </motion.div>
        )}
      </motion.button>

      {/* Render Modal using Portal */}
      {mounted && createPortal(<Modal />, document.body)}
    </>
  )
}