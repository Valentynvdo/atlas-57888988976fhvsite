import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Play } from "lucide-react";

const slides = [
  { id: 1, videoSrc: "/videos/slides/IMG_7379.MP4", color: "rgba(0,122,255,0.45)", accent: "#007AFF", altText: "Демонстрація інтерфейсу штучного інтелекту Atlas AI на macOS" },
  { id: 2, videoSrc: "/videos/slides/IMG_7382.MP4", color: "rgba(157,76,221,0.45)", accent: "#9D4CDD", altText: "Безшовна інтеграція та автоматизація щоденних рутинних завдань" },
  { id: 3, videoSrc: "/videos/slides/IMG_7384.MOV", color: "rgba(0, 0, 0,0.3)", accent: "#ffffff", altText: "Локальна безпека даних та персональний асистент для Mac" },
  { id: 4, videoSrc: "/videos/slides/IMG_7383.MOV", color: "rgba(0,229,255,0.45)", accent: "#ffffff", altText: "Проактивний аналіз та генерація контенту з Atlas AI" },
];

export default function VideoSlider() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRefs = useRef([]);
  
  // Для кінематографічного інтро
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-20%" });
  const [introState, setIntroState] = useState("idle"); // idle -> playing -> done

  const total = slides.length;

  // Запуск інтро при появі компонента на екрані
  useEffect(() => {
    if (isInView && introState === "idle") {
      setIntroState("playing");
    }
  }, [isInView, introState]);

  useEffect(() => {
    if (introState === "playing") {
      const timer = setTimeout(() => {
        setIntroState("done");
      }, 2500); // Інтро триває 2.5 секунди
      return () => clearTimeout(timer);
    }
  }, [introState]);

  const introDone = introState === "done" || introState === "idle"; // Якщо ще не почалось або вже закінчилось

  useEffect(() => {
    let animationFrameId;
    const updateProgress = () => {
      const activeVideo = videoRefs.current[currentIndex];
      // Прогрес оновлюється тільки якщо інтро закінчилось
      if (activeVideo && isPlaying && introState === "done") {
        const current = activeVideo.currentTime;
        const duration = activeVideo.duration;
        if (duration > 0) {
          setProgress((current / duration) * 100);
        }
      }
      animationFrameId = requestAnimationFrame(updateProgress);
    };
    if (isPlaying) {
      updateProgress();
    }
    return () => cancelAnimationFrame(animationFrameId);
  }, [currentIndex, isPlaying, introState]);

  useEffect(() => {
    videoRefs.current.forEach((vid, idx) => {
      if (vid) {
        vid.playbackRate = 2.5; // Прискорення відео в 2.5 рази для максимальної динаміки
        if (idx === currentIndex) {
          vid.currentTime = 0; 
          // Запускаємо відео тільки після того як інтро текст зникає
          if (isPlaying && introState === "done") {
             vid.play().catch(e => console.error("Autoplay prevented", e));
          } else {
             vid.pause();
          }
        } else {
          vid.pause();
        }
      }
    });
  }, [currentIndex, isPlaying, introState]);

  const paginate = (newDirection) => {
    if (introState !== "done") return; // Блокуємо навігацію під час інтро
    setCurrentIndex((prev) => {
      let nextIndex = prev + newDirection;
      if (nextIndex >= slides.length) nextIndex = 0;
      if (nextIndex < 0) nextIndex = slides.length - 1;
      return nextIndex;
    });
    setProgress(0);
  };

  const getPosition = (idx) => {
    if (idx === currentIndex) return "active";
    if (idx === (currentIndex - 1 + total) % total) return "prev";
    if (idx === (currentIndex + 1) % total) return "next";
    return "hidden";
  };

  // Варіанти анімації (БЕЗ blur/filter для максимальної продуктивності GPU)
  const galleryVariants = {
    active: { 
      x: "0%", y: "0%", scale: 1, rotate: 0, zIndex: 10, 
      opacity: introState === "playing" ? 0.3 : 1 
    },
    prev:   { 
      x: "-45%", y: "4%", scale: 0.7, rotate: -6, zIndex: 5, 
      opacity: introState === "playing" ? 0 : 0.8 
    },
    next:   { 
      x: "45%", y: "-4%", scale: 0.7, rotate: 6, zIndex: 5, 
      opacity: introState === "playing" ? 0 : 0.8 
    },
    hidden: { x: "0%", y: "15%", scale: 0.5, rotate: 0, zIndex: 1, opacity: 0 }
  };

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", maxWidth: 1200, margin: "0 auto", padding: "40px 0" }}>
      
      {/* Ambient Glow */}
      <div 
        style={{
          position: "absolute",
          top: "20%", left: "20%", right: "20%", bottom: "20%",
          zIndex: -1,
          background: slides[currentIndex].color,
          filter: "blur(120px)",
          transition: "background 1.4s ease-in-out",
          opacity: introState === "playing" ? 0.1 : 0.5,
          borderRadius: "50%"
        }}
      />

      {/* Величезний текст Інтро поверх розмитих відео */}
      <AnimatePresence>
        {introState === "playing" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)", transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] } }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 30,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              textAlign: "center"
            }}
          >
            <h2 style={{
              fontSize: "clamp(3rem, 7vw, 6rem)",
              fontWeight: 700,
              margin: 0,
              color: "#ffffff",
              fontFamily: "var(--sf-display, -apple-system, BlinkMacSystemFont, sans-serif)",
              letterSpacing: "-0.04em",
              textShadow: "0 10px 40px rgba(0,0,0,0.8)",
            }}>
              Повний Огляд
            </h2>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
              style={{
                fontSize: "clamp(1.1rem, 1.8vw, 1.4rem)",
                color: "rgba(0, 0, 0,0.8)",
                marginTop: "1.5rem",
                maxWidth: "600px",
                lineHeight: 1.5,
                textShadow: "0 4px 12px rgba(0,0,0,0.8)",
                fontFamily: "var(--sf-text, -apple-system, BlinkMacSystemFont, sans-serif)",
            }}>
              Відчуйте всі потужні можливості Atlas AI на одній єдиній платформі.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Collage Gallery */}
      <div 
        style={{
          position: "relative",
          width: "100%",
          height: "600px", 
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          perspective: "1200px"
        }}
      >
        {slides.map((slide, idx) => {
          const pos = getPosition(idx);
          return (
            <motion.div
              key={slide.id}
              variants={galleryVariants}
              initial={false}
              animate={pos}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: "absolute",
                height: "100%",
                maxWidth: "80%",
                borderRadius: 28,
                overflow: "hidden",
                boxShadow: pos === "active" && introState === "done"
                  ? "0 30px 60px -12px rgba(0,0,0,0.8), 0 0 0 1px rgba(0, 0, 0,0.15)"
                  : "0 15px 30px -10px rgba(0,0,0,0.5), 0 0 0 1px rgba(0, 0, 0,0.05)",
                cursor: pos === "prev" ? "w-resize" : pos === "next" ? "e-resize" : (pos === "active" ? "pointer" : "default"),
                backgroundColor: "#050505",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              onClick={() => {
                if (pos === "prev") paginate(-1);
                if (pos === "next") paginate(1);
                if (pos === "active" && introState === "done") setIsPlaying(!isPlaying);
              }}
            >
              <video
                ref={el => videoRefs.current[idx] = el}
                src={slide.videoSrc}
                title={slide.altText}
                aria-label={slide.altText}
                muted
                playsInline
                disablePictureInPicture
                preload="auto"
                onEnded={() => { if (idx === currentIndex) paginate(1) }}
                style={{
                  height: "100%",
                  width: "auto", 
                  objectFit: "contain",
                  maxWidth: "100%", 
                  WebkitTransform: "translateZ(0)", // Force hardware acceleration
                  transform: "translateZ(0)",
                }}
              />
              
              {/* Overlay для неактивних відео (додає глибину) */}
              <motion.div 
                animate={{ opacity: pos === "active" ? 0 : 0.3 }}
                transition={{ duration: 1 }}
                style={{ position: "absolute", inset: 0, backgroundColor: "#000", pointerEvents: "none" }} 
              />
            </motion.div>
          );
        })}
      </div>

      {/* Прогрес бар під відео (З'являється після інтро) */}
      <AnimatePresence>
        {introState === "done" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 40,
              padding: "0 20px"
            }}
          >
            <div 
              style={{
                width: "100%",
                maxWidth: "600px",
                height: 2,
                background: "rgba(0, 0, 0,0.1)",
                display: "flex",
                position: "relative",
                borderRadius: 2,
                overflow: "hidden"
              }}
            >
              <div 
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: slides[currentIndex].accent,
                  boxShadow: `0 0 16px ${slides[currentIndex].accent}`,
                  transition: "width 0.1s linear, background 0.5s ease",
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
