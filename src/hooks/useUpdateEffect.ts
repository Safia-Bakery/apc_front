import { useEffect, useRef } from "react";

const useUpdateEffect = (callback: () => void, dependencies: any[]) => {
  const initialLoadRef = useRef(true);
  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      return;
    }
    const navigateAsync = async () => {
      await callback();
    };

    navigateAsync();
  }, dependencies);
};

export default useUpdateEffect;
