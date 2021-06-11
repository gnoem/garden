import { useEffect, useRef } from "react";

const usePrevious = (value) => {
  const ref: any = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export default usePrevious;