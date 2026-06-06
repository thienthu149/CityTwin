import { useEffect, useRef, useState } from 'react';

// ── Category colours ────────────────────────────────────────────────────────
const COLORS = {
  funding:    '#FFD700',
  scholarship:'#4FC3F7',
  community:  '#CE93D8',
  education:  '#A5D6A7',
  social:     '#F48FB1',
  event:      '#FFAB40',
};

// ── Helpers ─────────────────────────────────────────────────────────────────

function easeOutBack(x) {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

function easeInOut(x) {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

function calcPosition(index, w, h) {
  if (index === 0) {
    return { x: w / 2 + (Math.random() - 0.5) * 40, y: h / 2 + (Math.random() - 0.5) * 40 };
  }
  const goldenAngle = 2.39996; // ~137.5°
  const angle  = index * goldenAngle + Math.random() * 0.4;
  const radius = 65 + Math.sqrt(index) * 72;
  const margin = 95;
  return {
    x: Math.max(margin, Math.min(w - margin, w / 2 + Math.cos(angle) * radius)),
    y: Math.max(margin, Math.min(h - margin, h / 2 + Math.sin(angle) * radius * 0.75)),
  };
}

function drawLabel(ctx, x, y, text, color, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.font = '10px "Space Mono", monospace';
  ctx.textAlign = 'center';
  const tw = ctx.measureText(text).width;
  const pad = 5, bh = 16, bw = tw + pad * 2;
  const bx = x - bw / 2, by = y + 13;

  // rounded rect
  const r = 3;
  ctx.beginPath();
  ctx.moveTo(bx + r, by);
  ctx.lineTo(bx + bw - r, by);
  ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + r);
  ctx.lineTo(bx + bw, by + bh - r);
  ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - r, by + bh);
  ctx.lineTo(bx + r, by + bh);
  ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - r);
  ctx.lineTo(bx, by + r);
  ctx.quadraticCurveTo(bx, by, bx + r, by);
  ctx.closePath();

  ctx.fillStyle = 'rgba(5,5,16,0.88)';
  ctx.fill();
  ctx.strokeStyle = color + '55';
  ctx.lineWidth = 0.5;
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.fillText(text, x, by + 11);
  ctx.restore();
}

// ── Component ────────────────────────────────────────────────────────────────

export default function ConstellationMap({ nodes }) {
  const canvasRef  = useRef(null);
  const stateRef   = useRef({ bgStars: [], positions: {}, startTimes: {} });
  const tooltipRef = useRef({ node: null, x: 0, y: 0 });
  const [tooltip, setTooltip] = useState(null);

  // ── Resize + init bg stars ────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas.parentElement;

    const init = () => {
      canvas.width  = container.clientWidth;
      canvas.height = container.clientHeight;
      stateRef.current.bgStars = Array.from({ length: 200 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.15,
        opacity: Math.random() * 0.55 + 0.08,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    init();
    const ro = new ResizeObserver(init);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // ── Update positions when nodes arrive ───────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const s = stateRef.current;
    nodes.forEach((node, idx) => {
      if (!s.positions[node.id]) {
        s.positions[node.id] = calcPosition(idx, canvas.width, canvas.height);
        s.startTimes[node.id] = performance.now();
      }
    });
  }, [nodes]);

  // ── Animation loop ───────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const s   = stateRef.current;
    let rafId;

    const draw = (ts) => {
      const W = canvas.width, H = canvas.height;

      // Background fill
      ctx.fillStyle = '#050510';
      ctx.fillRect(0, 0, W, H);

      // Subtle city grid
      ctx.strokeStyle = 'rgba(79,195,247,0.025)';
      ctx.lineWidth = 1;
      for (let gx = 0; gx < W; gx += 90) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
      }
      for (let gy = 0; gy < H; gy += 90) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
      }

      // Background stars
      s.bgStars.forEach(star => {
        const twinkle = (Math.sin(ts * 0.0007 + star.phase) + 1) * 0.5;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${star.opacity * (0.45 + twinkle * 0.55)})`;
        ctx.fill();
      });

      // Empty state hint
      if (nodes.length === 0) {
        ctx.save();
        ctx.globalAlpha = 0.22;
        ctx.fillStyle   = '#4fc3f7';
        ctx.font        = '28px "Space Mono", monospace';
        ctx.textAlign   = 'center';
        ctx.fillText('◉', W / 2, H / 2 - 6);
        ctx.font = '11px "Space Mono", monospace';
        ctx.fillText('Your constellation builds as we talk', W / 2, H / 2 + 28);
        ctx.restore();
        rafId = requestAnimationFrame(draw);
        return;
      }

      // Connection lines (dashed, between nearby nodes)
      const visible = nodes.filter(n => s.positions[n.id]);
      ctx.setLineDash([4, 10]);
      for (let i = 0; i < visible.length; i++) {
        for (let j = i + 1; j < visible.length; j++) {
          const p1 = s.positions[visible[i].id];
          const p2 = s.positions[visible[j].id];
          const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
          if (dist > 300) continue;

          const t1 = Math.min((ts - s.startTimes[visible[i].id]) / 700, 1);
          const t2 = Math.min((ts - s.startTimes[visible[j].id]) / 700, 1);
          const lineAlpha = Math.min(t1, t2) * 0.22;

          ctx.strokeStyle = `rgba(79,195,247,${lineAlpha})`;
          ctx.lineWidth   = 0.5;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
      ctx.setLineDash([]);

      // Nodes
      visible.forEach(node => {
        const pos     = s.positions[node.id];
        const elapsed = ts - s.startTimes[node.id];
        const prog    = Math.min(elapsed / 680, 1);
        const scale   = easeOutBack(prog);
        const alpha   = Math.min(prog * 2.2, 1);
        if (alpha <= 0) return;

        const color  = COLORS[node.category] || '#ffffff';
        const pulse  = (Math.sin(ts * 0.0018 + pos.x * 0.009) + 1) * 0.5;
        const isHov  = tooltipRef.current.node?.id === node.id;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(pos.x, pos.y);
        ctx.scale(scale, scale);

        // Outer glow
        const glowR = isHov ? 32 + pulse * 10 : 20 + pulse * 7;
        const glow  = ctx.createRadialGradient(0, 0, 0, 0, 0, glowR);
        glow.addColorStop(0, color + (isHov ? '66' : '44'));
        glow.addColorStop(1, color + '00');
        ctx.beginPath();
        ctx.arc(0, 0, glowR, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Inner core
        ctx.beginPath();
        ctx.arc(0, 0, isHov ? 5.5 : 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Coloured ring
        ctx.beginPath();
        ctx.arc(0, 0, isHov ? 9 : 7, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth   = isHov ? 2 : 1.5;
        ctx.stroke();

        ctx.restore();

        // Label (unscaled)
        if (prog > 0.35) {
          const labelAlpha = easeInOut(Math.min((prog - 0.35) / 0.65, 1)) * alpha;
          drawLabel(ctx, pos.x, pos.y, node.name, color, labelAlpha);
        }
      });

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [nodes]);

  // ── Mouse hover → tooltip ────────────────────────────────────────────────
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    const rect   = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const s  = stateRef.current;

    let hovered = null;
    for (const node of nodes) {
      const pos = s.positions[node.id];
      if (!pos) continue;
      if (Math.hypot(mx - pos.x, my - pos.y) < 20) { hovered = { node, pos }; break; }
    }

    tooltipRef.current.node = hovered?.node ?? null;

    if (hovered) {
      setTooltip({
        node: hovered.node,
        x: Math.min(e.clientX - rect.left + 16, canvas.width - 240),
        y: e.clientY - rect.top - 10,
      });
    } else {
      setTooltip(null);
    }
  };

  return (
    <div className="constellation-panel">
      <canvas
        ref={canvasRef}
        className="constellation-canvas"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { tooltipRef.current.node = null; setTooltip(null); }}
        style={{ cursor: tooltip ? 'pointer' : 'default' }}
      />

      {nodes.length === 0 && (
        <div className="constellation-empty-hint">
          <p>AWAITING SIGNAL</p>
        </div>
      )}

      {tooltip && (
        <div
          className="node-tooltip"
          style={{ 
            left: tooltip.x, 
            top: tooltip.y,
            pointerEvents: 'auto' // Allows the user to click the link
          }}
          onMouseLeave={() => { tooltipRef.current.node = null; setTooltip(null); }}
        >
          {/* Display the chronological month */}
          {tooltip.node.month && (
            <div className="node-tooltip-month" style={{ fontSize: '10px', color: '#888', marginBottom: '4px' }}>
              🗓️ {tooltip.node.month}
            </div>
          )}

          <div
            className="node-tooltip-name"
            style={{ color: COLORS[tooltip.node.category] || '#fff', fontWeight: 'bold', marginBottom: '2px' }}
          >
            {tooltip.node.name}
          </div>
          
          <div
            className="node-tooltip-cat"
            style={{ color: COLORS[tooltip.node.category] || '#fff', fontSize: '10px', textTransform: 'uppercase', marginBottom: '6px' }}
          >
            {tooltip.node.category}
          </div>
          
          <div className="node-tooltip-reason" style={{ fontSize: '12px', marginBottom: '8px' }}>
            {tooltip.node.reason}
          </div>

          {/* Render the clickable link */}
          {tooltip.node.link && (
            <a 
              href={tooltip.node.link} 
              target="_blank" 
              rel="noreferrer"
              className="node-tooltip-link"
              style={{
                display: 'inline-block',
                color: '#050510',
                background: COLORS[tooltip.node.category] || '#fff',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              Visit Website ↗
            </a>
          )}
        </div>
      )}
    </div>
  );
}
