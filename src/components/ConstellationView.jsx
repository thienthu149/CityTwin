import { useEffect, useRef, useCallback } from 'react';

const CATS = [
  { id: 'community',       label: 'Community',       color: '#e91e8c', angle: -90,  anchor: 'top',    subs: ['Co-working Spaces', 'Meetup Groups', 'Local Forums'] },
  { id: 'education',       label: 'Education',       color: '#4488ff', angle: -22,  anchor: 'right',  subs: ['Universities', 'Online Courses', 'Workshops'] },
  { id: 'scholarships',    label: 'Scholarships',    color: '#4caf50', angle:  33,  anchor: 'right',  subs: ['Research Grants', 'Study Abroad', 'Innovation Awards'] },
  { id: 'grants',          label: 'Grants',          color: '#ff9800', angle:  90,  anchor: 'bottom', subs: ['Innovation Grants', 'Government Grants', 'Startup Funding'] },
  { id: 'entrepreneurship',label: 'Entrepreneurship',color: '#9c27b0', angle: 152,  anchor: 'left',   subs: ['Mentor Network', 'Pitch Events', 'Incubators'] },
  { id: 'culture',         label: 'Culture',         color: '#00bcd4', angle: 213,  anchor: 'left',   subs: ['Museums', 'Festivals', 'Art Galleries'] },
];

function drawBauhinia(ctx, cx, cy, nodeR) {
  const pr = nodeR * 0.7;
  const pw = nodeR * 0.29;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(0.35); // slight tilt matching the HK flag orientation

  for (let i = 0; i < 5; i++) {
    ctx.save();
    ctx.rotate(i * (2 * Math.PI / 5));

    // White petal
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(pw, -pr * 0.12, pw * 1.1, -pr * 0.62, pw * 0.26, -pr);
    ctx.lineTo(0, -pr * 0.86);        // V-notch at tip
    ctx.lineTo(-pw * 0.26, -pr);
    ctx.bezierCurveTo(-pw * 1.1, -pr * 0.62, -pw, -pr * 0.12, 0, 0);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255,255,255,0.94)';
    ctx.fill();

    // Red stripe vein
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(pw * 0.08, -pr * 0.35, pw * 0.05, -pr * 0.72, 0, -pr * 0.88);
    ctx.strokeStyle = '#e53935';
    ctx.lineWidth = nodeR * 0.065;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.restore();
  }

  ctx.restore();
}

function drawCatLabel(ctx, x, y, nodeR, text, anchor) {
  const pad = 10;
  ctx.fillStyle = '#ffffff';
  ctx.font = '13px system-ui, -apple-system, sans-serif';
  switch (anchor) {
    case 'top':    ctx.textAlign = 'center'; ctx.fillText(text, x, y - nodeR - pad); break;
    case 'bottom': ctx.textAlign = 'center'; ctx.fillText(text, x, y + nodeR + 20);  break;
    case 'right':  ctx.textAlign = 'left';   ctx.fillText(text, x + nodeR + pad, y + 5); break;
    case 'left':   ctx.textAlign = 'right';  ctx.fillText(text, x - nodeR - pad, y + 5); break;
  }
}

export default function ConstellationView({ onOpenChat, onCategorySelect }) {
  const canvasRef  = useRef(null);
  const starsRef   = useRef([]);
  const expandedRef = useRef(new Set());

  useEffect(() => {
    starsRef.current = Array.from({ length: 120 }, () => ({
      xr: Math.random(), yr: Math.random(),
      r:  Math.random() * 1.3 + 0.3,
      op: Math.random() * 0.5 + 0.1,
      ph: Math.random() * Math.PI * 2,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement;

    const resize = () => {
      canvas.width  = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    let rafId;

    const draw = (ts) => {
      const W = canvas.width, H = canvas.height;
      if (!W || !H) { rafId = requestAnimationFrame(draw); return; }

      const ctx = canvas.getContext('2d');
      const cx = W / 2;
      const cy = H * 0.47;
      const r  = Math.min(W, H) * 0.3;

      ctx.fillStyle = '#0d1b2e';
      ctx.fillRect(0, 0, W, H);

      // Stars
      starsRef.current.forEach(s => {
        const tw = (Math.sin(ts * 0.0007 + s.ph) + 1) * 0.5;
        ctx.beginPath();
        ctx.arc(s.xr * W, s.yr * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.op * (0.4 + tw * 0.6)})`;
        ctx.fill();
      });

      const exp = expandedRef.current;

      // Lines center → categories
      CATS.forEach(cat => {
        const rad = cat.angle * Math.PI / 180;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(rad) * r, cy + Math.sin(rad) * r);
        ctx.strokeStyle = `${cat.color}55`;
        ctx.lineWidth = 1;
        ctx.setLineDash([]);
        ctx.stroke();
      });

      // Sub-nodes for expanded categories
      CATS.forEach(cat => {
        if (!exp.has(cat.id)) return;
        const rad  = cat.angle * Math.PI / 180;
        const nx   = cx + Math.cos(rad) * r;
        const ny   = cy + Math.sin(rad) * r;
        const dist = r * 0.52;

        cat.subs.forEach((sub, i) => {
          const spread = (i - 1) * 0.34;
          const sa = rad + spread;
          const sx = nx + Math.cos(sa) * dist;
          const sy = ny + Math.sin(sa) * dist;

          // Dashed line cat → sub
          ctx.beginPath();
          ctx.moveTo(nx, ny);
          ctx.lineTo(sx, sy);
          ctx.strokeStyle = `${cat.color}66`;
          ctx.lineWidth = 0.8;
          ctx.setLineDash([3, 7]);
          ctx.stroke();
          ctx.setLineDash([]);

          // Sub glow
          const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, 22);
          sg.addColorStop(0, `${cat.color}33`);
          sg.addColorStop(1, `${cat.color}00`);
          ctx.beginPath();
          ctx.arc(sx, sy, 22, 0, Math.PI * 2);
          ctx.fillStyle = sg;
          ctx.fill();

          // Sub circle
          ctx.beginPath();
          ctx.arc(sx, sy, 11, 0, Math.PI * 2);
          ctx.fillStyle = `${cat.color}55`;
          ctx.strokeStyle = `${cat.color}aa`;
          ctx.lineWidth = 1.5;
          ctx.fill();
          ctx.stroke();

          // Sub label (positioned away from parent)
          ctx.font = '10px system-ui, -apple-system, sans-serif';
          ctx.fillStyle = 'rgba(255,255,255,0.82)';
          ctx.textAlign = 'center';
          const above = Math.sin(sa) < -0.25;
          ctx.fillText(sub, sx, above ? sy - 17 : sy + 23);
        });
      });

      // Category nodes (drawn after lines so they're on top)
      CATS.forEach(cat => {
        const rad   = cat.angle * Math.PI / 180;
        const nx    = cx + Math.cos(rad) * r;
        const ny    = cy + Math.sin(rad) * r;
        const isExp = exp.has(cat.id);
        const nodeR = isExp ? 25 : 21;
        const pulse = (Math.sin(ts * 0.0013 + cat.angle * 0.04) + 1) * 0.5;
        const glowR = nodeR + 14 + pulse * 8;

        const glow = ctx.createRadialGradient(nx, ny, 0, nx, ny, glowR);
        glow.addColorStop(0, `${cat.color}${isExp ? '66' : '44'}`);
        glow.addColorStop(1, `${cat.color}00`);
        ctx.beginPath();
        ctx.arc(nx, ny, glowR, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(nx, ny, nodeR, 0, Math.PI * 2);
        ctx.fillStyle = cat.color + (isExp ? 'ff' : 'cc');
        ctx.fill();

        drawCatLabel(ctx, nx, ny, nodeR, cat.label, cat.anchor);
      });

      // Center "You" node
      const cp  = (Math.sin(ts * 0.0016) + 1) * 0.5;
      const cg  = ctx.createRadialGradient(cx, cy, 0, cx, cy, 52 + cp * 8);
      cg.addColorStop(0, 'rgba(229,57,53,0.65)');
      cg.addColorStop(1, 'rgba(229,57,53,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, 52 + cp * 8, 0, Math.PI * 2);
      ctx.fillStyle = cg;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, 30, 0, Math.PI * 2);
      ctx.fillStyle = '#e53935';
      ctx.fill();

      drawBauhinia(ctx, cx, cy, 30);

      ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('You', cx, cy + 30 + 20);

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(rafId); ro.disconnect(); };
  }, []);

  const hitTest = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = clientX - rect.left;
    const my = clientY - rect.top;
    const W  = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H * 0.47;
    const r  = Math.min(W, H) * 0.3;

    // Center → open chat
    if (Math.hypot(mx - cx, my - cy) < 36) { onOpenChat?.(); return; }

    // Sub-nodes of expanded categories
    for (const cat of CATS) {
      if (!expandedRef.current.has(cat.id)) continue;
      const rad  = cat.angle * Math.PI / 180;
      const nx   = cx + Math.cos(rad) * r;
      const ny   = cy + Math.sin(rad) * r;
      const dist = r * 0.52;
      for (let i = 0; i < cat.subs.length; i++) {
        const sa = rad + (i - 1) * 0.34;
        const sx = nx + Math.cos(sa) * dist;
        const sy = ny + Math.sin(sa) * dist;
        if (Math.hypot(mx - sx, my - sy) < 22) {
          onCategorySelect?.(cat.subs[i]);
          onOpenChat?.();
          return;
        }
      }
    }

    // Category nodes — toggle expanded
    for (const cat of CATS) {
      const rad = cat.angle * Math.PI / 180;
      const nx  = cx + Math.cos(rad) * r;
      const ny  = cy + Math.sin(rad) * r;
      if (Math.hypot(mx - nx, my - ny) < 32) {
        const next = new Set(expandedRef.current);
        next.has(cat.id) ? next.delete(cat.id) : next.add(cat.id);
        expandedRef.current = next;
        return;
      }
    }
  }, [onOpenChat, onCategorySelect]);

  const handleClick = useCallback(e => hitTest(e.clientX, e.clientY), [hitTest]);
  const handleTouch = useCallback(e => {
    e.preventDefault();
    const t = e.touches[0] || e.changedTouches[0];
    if (t) hitTest(t.clientX, t.clientY);
  }, [hitTest]);

  return (
    <div className="constellation-view">
      <canvas
        ref={canvasRef}
        className="constellation-canvas"
        onClick={handleClick}
        onTouchStart={handleTouch}
      />
    </div>
  );
}
