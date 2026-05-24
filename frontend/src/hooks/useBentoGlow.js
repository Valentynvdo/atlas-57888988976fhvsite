import { useEffect } from "react";

/**
 * Глобальний хук для ефекту свічення меж усіх bento-карток.
 * Відстежує координати курсора і оновлює CSS-змінні --mouse-x та --mouse-y.
 */
export default function useBentoGlow() {
  useEffect(() => {
    const handleMouseMove = (e) => {
      const cards = document.querySelectorAll(".bento-card");
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
}
