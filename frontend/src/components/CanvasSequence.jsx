import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CanvasSequence() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const container = containerRef.current;
    
    // Total frames for animation
    const frameCount = 100;
    const imageSequence = { frame: 0 };
    const images = [];
    
    // Note: Since we don't have actual CDN images, we will use a fallback drawing logic
    // if the images fail to load.
    const currentFrameURL = (index) => `https://cdn.atlas.com/anim/sequence/${(index + 1).toString().padStart(4, '0')}.webp`;

    let imagesLoaded = false;

    const preloadImages = async () => {
      const promises = [];
      for (let i = 0; i < frameCount; i++) {
        promises.push(new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
          // Uncomment to attempt loading actual images
          // img.src = currentFrameURL(i); 
          // For now, immediately resolve null to use fallback drawing
          resolve(null);
        }));
      }
      const loaded = await Promise.all(promises);
      const validImages = loaded.filter(Boolean);
      
      if (validImages.length === frameCount) {
        images.push(...validImages);
        imagesLoaded = true;
      }
    };

    // Draw the frame
    const drawFrame = (index) => {
      if (!canvas || !context) return;
      
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      context.scale(dpr, dpr);
      
      context.clearRect(0, 0, rect.width, rect.height);

      if (imagesLoaded && images[index]) {
        // Draw the preloaded image
        context.drawImage(images[index], 0, 0, rect.width, rect.height);
      } else {
        // Fallback: draw a dynamic 3D-ish sphere using canvas gradients
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const radius = Math.min(cx, cy) * 0.6;
        
        // Progress from 0 to 1
        const progress = index / (frameCount - 1);
        
        // Change colors based on progress
        const r1 = Math.floor(0 + progress * 157); // 0 to 157
        const g1 = Math.floor(122 + progress * (-46)); // 122 to 76
        const b1 = Math.floor(255 + progress * (-34)); // 255 to 221
        
        const gradient = context.createRadialGradient(
          cx - radius * 0.3, cy - radius * 0.3, radius * 0.1,
          cx, cy, radius
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, 0.9)`);
        gradient.addColorStop(0.3, `rgba(${r1}, ${g1}, ${b1}, 0.8)`);
        gradient.addColorStop(1, `rgba(0, 0, 0, 0)`);
        
        context.fillStyle = gradient;
        
        // Animate position slightly to simulate 3D rotation
        const yOffset = Math.sin(progress * Math.PI * 2) * 20;
        
        context.beginPath();
        context.arc(cx, cy + yOffset, radius, 0, Math.PI * 2);
        context.fill();
        
        // Add a wireframe-like rotating ring
        context.strokeStyle = "rgba(34, 211, 238, 0.3)";
        context.lineWidth = 2;
        context.beginPath();
        context.ellipse(cx, cy + yOffset, radius * 1.2, radius * 0.3 * (1 - progress), progress * Math.PI, 0, Math.PI * 2);
        context.stroke();
      }
    };

    preloadImages().then(() => {
      drawFrame(0);
      
      const ctx = gsap.context(() => {
        gsap.to(imageSequence, {
          frame: frameCount - 1,
          snap: "frame",
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            pin: canvasRef.current,
            invalidateOnRefresh: true
          },
          onUpdate: () => drawFrame(imageSequence.frame)
        });
      }, container);
      
      return () => ctx.revert(); // cleanup
    });
    
  }, []);

  return (
    <div ref={containerRef} className="sequence-container w-full h-[300vh] relative bg-black">
      <div className="absolute top-0 left-0 w-full h-screen sticky">
        <canvas
          id="atlas-sequence-canvas"
          ref={canvasRef}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
