import React, { useEffect, useRef } from 'react';

/**
 * InteractiveArtCanvas
 * A high-performance, 60fps ambient art canvas that reacts to mouse movement.
 * Creates delicate floating pigment particles, golden atelier motes, and soft watercolor glows.
 * Zero bundle overhead, zero lag, smooth hardware-accelerated rendering.
 */
export const InteractiveArtCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates with smooth interpolation
    let mouse = {
      x: width / 2,
      y: height / 3,
      targetX: width / 2,
      targetY: height / 3,
      isMoving: false,
      lastMoveTime: 0
    };

    // Color palette inspired by fine art pigments and blush & black aesthetic
    const PIGMENT_COLORS = [
      'rgba(247, 203, 215, ',  // Soft Blush Pink
      'rgba(220, 141, 163, ',  // Rose Mauve
      'rgba(212, 175, 55, ',   // Imperial Gilding Gold
      'rgba(235, 176, 192, ',  // Dusty Rose
      'rgba(30, 30, 30, ',     // Charcoal Pigment Mote
      'rgba(253, 232, 239, '   // Pale Blush Glow
    ];

    // Ambient floating particles (sunlit atelier dust motes)
    const NUM_AMBIENT = Math.min(35, Math.floor(width / 35));
    const particles = [];

    class Particle {
      constructor(isCursorSpurt = false, x = null, y = null) {
        this.reset(isCursorSpurt, x, y);
      }

      reset(isCursorSpurt = false, x = null, y = null) {
        this.isCursor = isCursorSpurt;
        this.x = x !== null ? x : Math.random() * width;
        this.y = y !== null ? y : Math.random() * height;
        
        const baseSpeed = isCursorSpurt ? 1.4 : 0.35;
        this.vx = (Math.random() - 0.5) * baseSpeed;
        this.vy = (Math.random() - 0.5) * baseSpeed - (isCursorSpurt ? 0.3 : 0.1);
        
        this.radius = isCursorSpurt ? Math.random() * 2.5 + 1.2 : Math.random() * 2.2 + 0.8;
        this.colorBase = PIGMENT_COLORS[Math.floor(Math.random() * PIGMENT_COLORS.length)];
        this.alpha = isCursorSpurt ? 0.65 : Math.random() * 0.35 + 0.12;
        this.maxLife = isCursorSpurt ? Math.random() * 80 + 40 : Infinity;
        this.life = this.maxLife;
        this.decay = isCursorSpurt ? 1 : 0;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Subtle organic wobble
        this.vx += (Math.random() - 0.5) * 0.04;
        this.vy += (Math.random() - 0.5) * 0.04;

        if (this.isCursor) {
          this.life -= this.decay;
          this.alpha = (this.life / this.maxLife) * 0.65;
          return this.life > 0;
        }

        // Screen wrap for ambient motes
        if (this.x < -20) this.x = width + 20;
        if (this.x > width + 20) this.x = -20;
        if (this.y < -20) this.y = height + 20;
        if (this.y > height + 20) this.y = -20;
        return true;
      }

      draw(c) {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = `${this.colorBase}${this.alpha})`;
        c.shadowColor = `${this.colorBase}0.4)`;
        c.shadowBlur = this.radius * 2.5;
        c.fill();
      }
    }

    // Initialize ambient studio particles
    for (let i = 0; i < NUM_AMBIENT; i++) {
      particles.push(new Particle(false));
    }

    const cursorParticles = [];

    // Resize handler
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    // Mouse movement tracker
    let throttleTimeout;
    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.isMoving = true;
      mouse.lastMoveTime = Date.now();

      // Spawn a burst of pigment particles on cursor movement
      if (cursorParticles.length < 50 && Math.random() > 0.45) {
        cursorParticles.push(new Particle(true, e.clientX + (Math.random() - 0.5) * 16, e.clientY + (Math.random() - 0.5) * 16));
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Main 60fps render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // Soft ambient cursor spotlight (simulates light beam in gallery)
      const spotlightRadius = Math.min(width, height) * 0.35;
      const gradient = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        spotlightRadius
      );
      gradient.addColorStop(0, 'rgba(246, 220, 176, 0.085)'); // Soft warm amber light
      gradient.addColorStop(0.5, 'rgba(242, 202, 219, 0.04)'); // Whispering rose
      gradient.addColorStop(1, 'rgba(253, 247, 241, 0)');     // Pure transparent canvas

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Render ambient motes
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(ctx);
      }

      // Render & prune cursor pigment particles
      for (let i = cursorParticles.length - 1; i >= 0; i--) {
        const alive = cursorParticles[i].update();
        if (alive) {
          cursorParticles[i].draw(ctx);
        } else {
          cursorParticles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Interactive Canvas Canvas Layer (Hardware Accelerated) */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0 opacity-80"
      />

      {/* Ultra-delicate Artists Canvas Linen Grain Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
    </>
  );
};

export default InteractiveArtCanvas;
