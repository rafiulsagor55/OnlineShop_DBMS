import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = ({ outletRef }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (outletRef?.current) {
      outletRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname, outletRef]);

  return null;
};

export default ScrollToTop;
