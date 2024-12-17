/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useLayoutEffect, useMemo } from "react";

function debounce(func: (...args: any[]) => void, timeout = 300) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
}

export function useDebounce(callback: (...args: any[]) => void, delay: number) {
  const callbackRef = useRef(callback)
  useLayoutEffect(() => {
    callbackRef.current = callback
  })
  return useMemo(
    () => debounce((...args) => callbackRef.current(...args), delay),
    [delay],
  )
}