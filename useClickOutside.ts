import { useEffect } from "react";

const useClickOutside = (reference: any, whatHappens: () => unknown, condition = true) => {
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (reference.current && !reference.current.contains(event.target) && condition)
        whatHappens();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [reference, condition]);
};

export { useClickOutside };
