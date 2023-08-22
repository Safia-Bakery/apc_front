import { useState, useEffect } from "react";
import { Subject, debounceTime, distinctUntilChanged } from "rxjs";
const time = 800;
const useDebounce = <T>(defaultValue: T): [T, (v: T) => void] => {
  const [value, setValue] = useState<T>(defaultValue);
  const [base$] = useState(() => new Subject<T>());

  useEffect(() => {
    const sub = base$
      .pipe(debounceTime(time), distinctUntilChanged())
      .subscribe(setValue);

    return () => sub.unsubscribe();
  }, []);

  return [value, (v) => base$.next(v)];
};

export default useDebounce;
