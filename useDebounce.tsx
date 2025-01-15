"use client"

import * as React from "react"
import debounce from "lodash.debounce"

import { useUnmount } from "@/components/hooks/use-unmount"

type DebounceOptions = {
  leading?: boolean
  trailing?: boolean
  maxWait?: number
}

type ControlFunctions = {
  cancel: () => void
  flush: () => void
  isPending: () => boolean
}

export type DebouncedState<T extends (...args: any) => ReturnType<T>> = ((
  ...args: Parameters<T>
) => ReturnType<T> | undefined) &
  ControlFunctions

export function useDebounceCallback<T extends (...args: any) => ReturnType<T>>(
  func: T,
  delay = 500,
  options?: DebounceOptions
): DebouncedState<T> {
  const debouncedFunc = React.useRef<ReturnType<typeof debounce>>(null)

  useUnmount(() => {
    if (debouncedFunc.current) {
      debouncedFunc.current.cancel()
    }
  })

  const debounced = React.useMemo(() => {
    const debouncedFuncInstance = debounce(func, delay, options)

    const wrappedFunc: DebouncedState<T> = (...args: Parameters<T>) => {
      return debouncedFuncInstance(...args)
    }

    wrappedFunc.cancel = () => {
      debouncedFuncInstance.cancel()
    }

    wrappedFunc.isPending = () => {
      return !!debouncedFunc.current
    }

    wrappedFunc.flush = () => {
      return debouncedFuncInstance.flush()
    }

    return wrappedFunc
  }, [func, delay, options])

  React.useEffect(() => {
    debouncedFunc.current = debounce(func, delay, options)
  }, [func, delay, options])

  return debounced
}
//useUnmount
"use client"

import * as React from "react"

export function useUnmount(func: () => void) {
  const funcRef = React.useRef(func)

  funcRef.current = func

  React.useEffect(
    () => () => {
      funcRef.current()
    },
    []
  )
}
