'use client';

import React from 'react';

interface AdaptiveTextProps {
  children: React.ReactNode;
  className?: string;
  backgroundClass?: string;
  isUsername?: boolean;
  variant?: 'primary' | 'secondary' | 'accent';
}

/**
 * AdaptiveText component that automatically adjusts text color based on background
 * for optimal contrast and readability
 */
export default function AdaptiveText({ 
  children, 
  className = '', 
  backgroundClass = '', 
  isUsername = false,
  variant = 'primary'
}: AdaptiveTextProps) {
  
  // Function to determine text color based on background
  const getTextColorClass = (bgClass: string, isUser: boolean, textVariant: string) => {
    if (isUser) {
      return 'text-blue-600 font-semibold'; // Username always in distinct blue
    }
    
    // For light backgrounds, use dark text
    if (bgClass.includes('white') || bgClass.includes('gray-50') || bgClass.includes('gray-100') || bgClass.includes('yellow-50')) {
      switch (textVariant) {
        case 'primary':
          return 'text-gray-800';
        case 'secondary':
          return 'text-gray-600';
        case 'accent':
          return 'text-blue-600';
        default:
          return 'text-gray-800';
      }
    }
    
    // For colored backgrounds, use white text
    if (bgClass.includes('purple') || bgClass.includes('blue') || bgClass.includes('yellow') || bgClass.includes('red')) {
      return 'text-white';
    }
    
    // For dark backgrounds, use white text
    if (bgClass.includes('gray-800') || bgClass.includes('gray-900') || bgClass.includes('black')) {
      return 'text-white';
    }
    
    // Default fallback - light text on dark backgrounds
    return 'text-gray-800';
  };

  const textColorClass = getTextColorClass(backgroundClass, isUsername, variant);
  
  return (
    <span className={`${textColorClass} ${className}`}>
      {children}
    </span>
  );
}

/**
 * Hook for determining text color based on background
 */
export function useAdaptiveTextColor(backgroundClass: string, isUsername: boolean = false) {
  const getTextColor = (bgClass: string, isUser: boolean) => {
    if (isUser) {
      return 'text-blue-600 font-semibold';
    }
    
    if (bgClass.includes('white') || bgClass.includes('gray-50') || bgClass.includes('gray-100')) {
      return 'text-gray-800';
    }
    
    if (bgClass.includes('purple') || bgClass.includes('blue') || bgClass.includes('yellow') || bgClass.includes('red')) {
      return 'text-white';
    }
    
    if (bgClass.includes('gray-800') || bgClass.includes('gray-900') || bgClass.includes('black')) {
      return 'text-white';
    }
    
    return 'text-gray-800';
  };

  return getTextColor(backgroundClass, isUsername);
}

/**
 * Utility function for getting contrast-safe text color
 */
export function getContrastTextColor(backgroundColor: string): string {
  // Simple contrast calculation
  const isLight = backgroundColor.includes('white') || 
                  backgroundColor.includes('gray-50') || 
                  backgroundColor.includes('gray-100') ||
                  backgroundColor.includes('yellow-50');
  
  return isLight ? 'text-gray-800' : 'text-white';
}
