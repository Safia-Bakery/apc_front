import { useState, useEffect, useCallback } from "react";

const delay = 500;

function useDebounce<T>(initialValue: T): [T, (value: T) => void] {
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);
  const [value, setValue] = useState<T>(initialValue);

  const debouncedSetValue = useCallback((nextValue: T) => {
    setValue(nextValue);
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timerId);
    };
  }, [value, delay]);

  return [debouncedValue, debouncedSetValue];
}

export default useDebounce;
