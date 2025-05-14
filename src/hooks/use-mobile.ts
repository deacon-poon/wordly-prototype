"use client";

import { useState, useEffect } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    
    // Set size on initial load
    handleResize();
    
    // Add event listener
    window.addEventListener("resize", handleResize);
    
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures effect is only run on mount and unmount

  return isMobile;
}

export function useIsTablet() {
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      setIsTablet(window.innerWidth >= 480 && window.innerWidth < 768);
    }
    
    // Set size on initial load
    handleResize();
    
    // Add event listener
    window.addEventListener("resize", handleResize);
    
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isTablet;
}

export function useViewportSize() {
  const [width, setWidth] = useState(0);
  
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      setWidth(window.innerWidth);
    }
    
    // Set size on initial load
    handleResize();
    
    // Add event listener
    window.addEventListener("resize", handleResize);
    
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { width };
}
