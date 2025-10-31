// FIX: The `React.Dispatch` and `React.SetStateAction` types require the `React` namespace, which was not imported.
import React, { useState, useEffect } from 'react';

function getValue<T,>(key: string, initialValue: T | (() => T)): T {
  const savedValue = sessionStorage.getItem(key);
  if (savedValue !== null) {
    try {
      return JSON.parse(savedValue);
    } catch (error) {
      console.error(`Error parsing sessionStorage key "${key}":`, error);
      sessionStorage.removeItem(key);
    }
  }

  if (initialValue instanceof Function) {
    return initialValue();
  }
  return initialValue;
}

export function useSessionStorage<T,>(
  key: string,
  initialValue: T | (() => T)
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => getValue(key, initialValue));

  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue];
}
