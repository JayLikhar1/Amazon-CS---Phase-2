"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export const FloatingNav = ({
  navItems,
  className,
  onNavClick,
  activeSection,
}: {
  navItems: {
    name: string
    link: string
    icon?: JSX.Element
  }[]
  className?: string
  onNavClick?: (link: string) => void
  activeSection?: string
}) => {
  const handleNavClick = (item: any) => {
    if (onNavClick) {
      onNavClick(item.link)
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 0,
          y: -100,
          scale: 0.8,
        }}
        animate={{
          y: 0,
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 0.8,
          ease: [0.23, 1, 0.32, 1],
          delay: 0.2
        }}
        className={cn(
          "flex max-w-fit fixed top-6 inset-x-0 mx-auto border border-white/10 apple-glass rounded-full z-[5000] px-6 py-3 items-center justify-center space-x-2 backdrop-blur-xl",
          className
        )}
      >
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-xl" />
        
        {navItems.map((navItem: any, idx: number) => {
          const isActive = activeSection === navItem.link || 
                          (navItem.link === 'analytics' && activeSection === 'analytics')
          
          return (
            <motion.button
              key={`link-${idx}`}
              onClick={() => handleNavClick(navItem)}
              whileHover={{ 
                scale: 1.1, 
                y: -2,
                transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] }
              }}
              whileTap={{ 
                scale: 0.95,
                transition: { duration: 0.1 }
              }}
              className={cn(
                "relative items-center flex space-x-2 transition-all duration-500 px-4 py-3 rounded-full cursor-pointer group overflow-hidden",
                isActive 
                  ? "text-white scale-110" 
                  : "text-white/70 hover:text-white"
              )}
            >
              {/* Active background */}
              {isActive && (
                <motion.div
                  layoutId="navActive"
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/80 to-purple-600/80 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              {/* Hover background */}
              <motion.div
                className="absolute inset-0 bg-white/5 rounded-full opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.3 }}
              />
              
              <span className="relative z-10 block sm:hidden">{navItem.icon}</span>
              <span className="relative z-10 hidden sm:block text-sm font-semibold apple-body">
                {navItem.name}
              </span>
              
              {/* Ripple effect */}
              <motion.div
                className="absolute inset-0 rounded-full bg-white/20"
                initial={{ scale: 0, opacity: 0 }}
                whileTap={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.4 }}
              />
            </motion.button>
          )
        })}
      </motion.div>
    </AnimatePresence>
  )
}