
import * as React from "react"

const useClickOutside = (ref: React.RefObject<HTMLElement>, handler: () => void) => {
  React.useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return
      }
      handler()
    }

    document.addEventListener("mousedown", listener)
    document.addEventListener("touchstart", listener)

    return () => {
      document.removeEventListener("mousedown", listener)
      document.removeEventListener("touchstart", listener)
    }
  }, [ref, handler])

  return null
}

export default useClickOutside


import { RefObject, useEffect } from 'react'

type Handler = (event: MouseEvent | TouchEvent) => void

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: Handler,
  mouseEvent: 'mousedown' | 'mouseup' = 'mousedown'
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref?.current
      const target = event.target

      // Do nothing if clicking ref's element or descendent elements
      if (!el || !target || el.contains(target as Node)) {
        return
      }

      handler(event)
    }

    document.addEventListener(mouseEvent, listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener(mouseEvent, listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler, mouseEvent])
}

// UI

'use client'

import { useRef, useState } from 'react'
import { useOnClickOutside } from '@/components/hooks/use-click-outside'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

function SimpleDropdownDemo() {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useOnClickOutside(ref, () => setIsOpen(false))

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Simple Dropdown</label>
      <div className="relative" ref={ref}>
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
        >
          Toggle Dropdown
        </Button>
        {isOpen && (
          <div className="absolute top-full mt-2 w-48 rounded-md border bg-popover shadow-lg">
            <div className="p-2">
              <p className="text-sm">Click outside to close</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ModalDemo() {
  const [isOpen, setIsOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(modalRef, () => setIsOpen(false))

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Modal Example</label>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>

      {isOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm">
          <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
            <div
              ref={modalRef}
              className="w-[300px] rounded-lg border bg-card p-4 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Modal Title</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Click outside or the X button to close this modal.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MenuDemo() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(menuRef, () => setIsOpen(false))

  const menuItems = [
    'Profile',
    'Settings',
    'Notifications',
    'Help',
    'Sign out'
  ]

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Menu Example</label>
      <div className="relative" ref={menuRef}>
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
        >
          Menu
        </Button>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 rounded-md border bg-popover shadow-lg">
            <div className="py-1">
              {menuItems.map((item) => (
                <button
                  key={item}
                  className="flex w-full items-center px-4 py-2 text-sm hover:bg-accent"
                  onClick={() => {
                    console.log(`Clicked: ${item}`)
                    setIsOpen(false)
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export { SimpleDropdownDemo, ModalDemo, MenuDemo };



