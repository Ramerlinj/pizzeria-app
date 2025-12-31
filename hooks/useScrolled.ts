import { useEffect, useState } from "react";

/**
 * useScrolled
 * Devuelve true cuando el scrollY supera el umbral indicad
 * @param threshold número de píxeles de desplazamiento para activar el estado
 */
export function useScrolled(threshold: number = 10) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      setScrolled(y > threshold);
    };

    // Inicia el estado por si la página ya está desplazada
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);

  return scrolled;
}