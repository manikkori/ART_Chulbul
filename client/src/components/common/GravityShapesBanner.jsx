import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import ScribbleWordmark from './ScribbleWordmark';

const SHAPE_COLORS = [
  '#ff0457',
  '#ffe5ee',
  '#ffc2d7',
  '#111827',
  '#facc15',
  '#fb923c',
  '#60a5fa',
  '#34d399',
  '#c084fc',
  '#f472b6',
];

const buildRandomBody = (Bodies, x, y, index = 0) => {
  const pick = index % 5;
  const fill = SHAPE_COLORS[index % SHAPE_COLORS.length];
  const stroke = fill === '#111827' ? '#000000' : '#ffffff';
  const common = {
    restitution: 0.65,
    friction: 0.14,
    frictionAir: 0.008,
    density: 0.0022,
    angle: (Math.random() - 0.5) * 1.4,
    render: {
      fillStyle: fill,
      strokeStyle: stroke,
      lineWidth: 2,
    },
  };

  if (pick === 0) {
    return Bodies.circle(x, y, 22 + (index % 3) * 6, common);
  }
  if (pick === 1) {
    return Bodies.rectangle(x, y, 48 + (index % 2) * 12, 48 + (index % 2) * 12, {
      ...common,
      chamfer: { radius: 14 },
    });
  }
  if (pick === 2) {
    return Bodies.polygon(x, y, 3, 28 + (index % 3) * 4, {
      ...common,
      chamfer: { radius: 6 },
    });
  }
  if (pick === 3) {
    return Bodies.rectangle(x, y, 66, 28, {
      ...common,
      chamfer: { radius: 14 },
    });
  }
  return Bodies.polygon(x, y, 5, 25 + (index % 2) * 4, {
    ...common,
    chamfer: { radius: 8 },
  });
};

export const GravityShapesBanner = ({ siteName = "chulbul's art" }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const countRef = useRef(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = Math.max(container.clientWidth || 800, 300);
    const height = 240;

    const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint } = Matter;
    const engine = Engine.create({
      gravity: { x: 0, y: 1.0, scale: 0.001 },
    });
    engineRef.current = engine;

    const render = Render.create({
      canvas,
      engine,
      options: {
        width,
        height,
        wireframes: false,
        background: 'transparent',
      },
    });
    canvas.width = width;
    canvas.height = height;

    const wallThickness = 60;
    const createBoundaries = (w) => [
      Bodies.rectangle(w / 2, height + wallThickness / 2 - 4, w + 120, wallThickness, {
        isStatic: true,
        render: { visible: false },
      }),
      Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height * 3, {
        isStatic: true,
        render: { visible: false },
      }),
      Bodies.rectangle(w + wallThickness / 2, height / 2, wallThickness, height * 3, {
        isStatic: true,
        render: { visible: false },
      }),
    ];

    let boundaries = createBoundaries(width);
    const initialCount = width < 640 ? 10 : 16;
    const shapes = Array.from({ length: initialCount }, (_, i) => {
      countRef.current += 1;
      const spreadX = width * 0.1 + width * 0.8 * (i / Math.max(1, initialCount - 1));
      const dropY = 55 + (i % 4) * 32;
      return buildRandomBody(Bodies, spreadX, dropY, i);
    });

    Composite.add(engine.world, [...boundaries, ...shapes]);

    // Pre-settle a few ticks immediately so shapes are visibly alive inside the card
    for (let tick = 0; tick < 45; tick += 1) {
      Engine.update(engine, 16.6);
    }

    const mouse = Mouse.create(canvas);
    mouse.element.removeEventListener('mousewheel', mouse.mousewheel);
    mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel);

    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.25,
        render: { visible: false },
      },
    });
    Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    const runner = Runner.create();
    Render.run(render);
    Runner.run(runner, engine);

    const handleResize = () => {
      if (!container || !canvas) return;
      const nextW = Math.max(container.clientWidth || 800, 300);
      canvas.width = nextW;
      render.bounds.max.x = nextW;
      render.options.width = nextW;
      Composite.remove(engine.world, boundaries);
      boundaries = createBoundaries(nextW);
      Composite.add(engine.world, boundaries);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      Render.stop(render);
      Runner.stop(runner);
      Composite.clear(engine.world, false);
      Engine.clear(engine);
      engineRef.current = null;
    };
  }, []);

  const handleDropShape = (e) => {
    const engine = engineRef.current;
    const canvas = canvasRef.current;
    if (!engine || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const allBodies = Matter.Composite.allBodies(engine.world).filter((b) => !b.isStatic);
    if (allBodies.length > 34) {
      Matter.Composite.remove(engine.world, allBodies[0]);
    }

    countRef.current += 1;
    const body = buildRandomBody(
      Matter.Bodies,
      Math.max(40, Math.min(rect.width - 40, clickX)),
      Math.max(20, Math.min(rect.height - 50, clickY)),
      countRef.current
    );
    Matter.Composite.add(engine.world, body);
    setHasInteracted(true);
  };

  const currentYear = new Date().getFullYear();

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[240px] rounded-[24px] bg-white border border-[#e8e8ed] overflow-hidden select-none shadow-[0_8px_30px_rgba(0,0,0,0.03)]"
    >
      {/* Top Overlay Header matching Footer_shapesBanner */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-5 sm:px-7 pt-5 pointer-events-none">
        <div className="flex items-center gap-3">
          <p className="text-[12px] sm:text-[13px] font-medium text-[#8e8e93]">
            © 2024–{currentYear} {siteName}. All rights reserved.
          </p>
          <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-[#f2f1f6] text-[#6e6e73]">
            {hasInteracted ? 'toss or tap to drop shapes' : 'interactive studio playground'}
          </span>
        </div>

        <div className="pointer-events-auto">
          <ScribbleWordmark
            text={siteName.toLowerCase()}
            variant="pink"
            size="footer"
            shimmer={false}
          />
        </div>
      </div>

      {/* Interactive Matter.js Canvas */}
      <canvas
        ref={canvasRef}
        onClick={handleDropShape}
        title="Click or drag shapes to play"
        className="absolute inset-0 w-full h-full z-0 touch-pan-y cursor-grab active:cursor-grabbing"
      />
    </div>
  );
};

export default GravityShapesBanner;
