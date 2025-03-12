"use client"

import React, { createContext, useContext, useState } from "react"
import { cn } from "../../../lib/utils"

// Create context for tabs state management
type TabsContextValue = {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined)

// Hook to use tabs context
const useTabsContext = () => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs component")
  }
  return context
}

// Main Tabs container component
interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
  ...props
}: TabsProps) {
  // Use controlled state if provided, otherwise use internal state
  const [activeTab, setActiveTab] = useState(defaultValue || "")
  
  const currentValue = value !== undefined ? value : activeTab
  const handleValueChange = onValueChange || setActiveTab

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

// TabsList component for containing tab triggers
interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function TabsList({ children, className, ...props }: TabsListProps) {
  return (
    <div 
      className={cn(
        "flex items-center w-full bg-gray-100 rounded-md p-1 overflow-auto",
        className
      )}
      role="tablist"
      {...props}
    >
      {children}
    </div>
  )
}

// TabsTrigger component for individual tab buttons
interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  children: React.ReactNode
}

export function TabsTrigger({ 
  value, 
  children, 
  className, 
  ...props 
}: TabsTriggerProps) {
  const { value: activeValue, onValueChange } = useTabsContext()
  const isActive = activeValue === value
  
  return (
    <button
      role="tab"
      type="button"
      aria-selected={isActive}
      data-state={isActive ? "active" : "inactive"}
      className={cn(
        "flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
        isActive 
          ? "bg-white text-blue-600 shadow-sm" 
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-200",
        className
      )}
      onClick={() => onValueChange(value)}
      {...props}
    >
      {children}
    </button>
  )
}

// TabsContent component for tab content areas
interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  children: React.ReactNode
}

export function TabsContent({ 
  value, 
  children, 
  className, 
  ...props 
}: TabsContentProps) {
  const { value: activeValue } = useTabsContext()
  const isActive = activeValue === value
  
  if (!isActive) return null
  
  return (
    <div
      role="tabpanel"
      data-state={isActive ? "active" : "inactive"}
      className={cn(
        "mt-2 transition-opacity duration-200 ease-in-out",
        isActive ? "opacity-100" : "opacity-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
} 