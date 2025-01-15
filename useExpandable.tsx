import { useState, useCallback } from "react";
import { useSpring } from "framer-motion";

export function useExpandable(initialState = false) {
  const [isExpanded, setIsExpanded] = useState(initialState);

  const springConfig = { stiffness: 300, damping: 30 };
  const animatedHeight = useSpring(0, springConfig);

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return { isExpanded, toggleExpand, animatedHeight };
}


// UI
'use client'

import { useExpandable } from "@/components/hooks/use-expandable"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { useRef, useEffect } from "react"

export function UseExpandableDemo() {
  const contentRef = useRef<HTMLDivElement>(null)
  const { isExpanded, toggleExpand, animatedHeight } = useExpandable(false)

  useEffect(() => {
    if (contentRef.current) {
      animatedHeight.set(isExpanded ? contentRef.current.offsetHeight : 0)
    }
  }, [isExpanded, animatedHeight])

  return (
    <Card className="p-6 max-w-md mx-auto w-[400px]">
      <div className="space-y-4">
        <div className="flex justify-between items-center gap-2">
          <h3 className="font-medium">Expandable Demo</h3>
          <Button 
            variant="outline"
            size="sm"
            onClick={toggleExpand}
          >
            {isExpanded ? 'Hide' : 'Show'} Content
          </Button>
        </div>

        <motion.div 
          style={{ height: animatedHeight }}
          className="overflow-hidden bg-muted rounded-lg"
        >
          <div ref={contentRef} className="p-4">
            <h4 className="font-medium mb-2">Features Overview</h4>
            <ul className="space-y-2 text-sm">
              <li>• Smooth spring animations</li>
              <li>• Height transitions</li>
              <li>• Simple toggle control</li>
              <li>• Configurable initial state</li>
            </ul>
          </div>
        </motion.div>

        <div className="text-sm text-muted-foreground">
          Current state: <code className="px-2 py-0.5 bg-muted rounded">{isExpanded ? 'expanded' : 'collapsed'}</code>
        </div>
      </div>
    </Card>
  )
}
