import React, { useState, useEffect, useRef } from 'react';

const __TWEAKS_STYLE = `
  .twk-panel { position: fixed; left: 16px; bottom: 16px; z-index: 2147483646; width: 280px; max-height: calc(100vh - 32px); display: flex; flex-direction: column; background: rgba(30, 30, 30, 0.95); color: #fff; backdrop-filter: blur(24px) saturate(160%); -webkit-backdrop-filter: blur(24px) saturate(160%); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; box-shadow: 0 12px 40px rgba(0,0,0,0.4); font: 11.5px/1.4 ui-sans-serif, system-ui, -apple-system, sans-serif; overflow: hidden; transform-origin: bottom left; }
  .twk-hd { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; cursor: move; user-select: none; border-bottom: 1px solid rgba(255,255,255,0.05); }
  .twk-hd b { font-size: 12px; font-weight: 600; letter-spacing: .02em; text-transform: uppercase; color: rgba(255,255,255,0.8); }
  .twk-x { appearance: none; border: 0; background: transparent; color: rgba(255,255,255,0.5); width: 22px; height: 22px; border-radius: 6px; cursor: pointer; font-size: 13px; line-height: 1; display:flex; align-items:center; justify-content:center; }
  .twk-x:hover { background: rgba(255,255,255,0.1); color: #fff; }
  .twk-body { padding: 14px; display: flex; flex-direction: column; gap: 14px; overflow-y: auto; overflow-x: hidden; min-height: 0; }
  .twk-row { display: flex; flex-direction: column; gap: 6px; }
  .twk-row-h { flex-direction: row; align-items: center; justify-content: space-between; gap: 10px; }
  .twk-lbl { display: flex; justify-content: space-between; align-items: baseline; color: rgba(255,255,255,0.7); }
  .twk-lbl > span:first-child { font-weight: 500; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
  
  .twk-toggle { position: relative; width: 36px; height: 20px; border: 0; border-radius: 999px; background: rgba(255,255,255,0.15); transition: background .15s; cursor: pointer; padding: 0; }
  .twk-toggle[data-on="1"] { background: var(--accent, #e87722); }
  .twk-toggle i { position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,.25); transition: transform .15s; }
  .twk-toggle[data-on="1"] i { transform: translateX(16px); }

  .twk-chips { display: flex; gap: 8px; flex-wrap: wrap; }
  .twk-chip { position: relative; appearance: none; width: 36px; height: 36px; padding: 0; border: 0; border-radius: 50%; overflow: hidden; cursor: pointer; box-shadow: 0 0 0 1px rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.2); transition: transform .12s, box-shadow .12s; }
  .twk-chip:hover { transform: translateY(-2px); box-shadow: 0 0 0 1px rgba(255,255,255,0.3), 0 4px 10px rgba(0,0,0,0.3); }
  .twk-chip[data-on="1"] { box-shadow: 0 0 0 2px #fff, 0 2px 6px rgba(0,0,0,.15); }
  .twk-chip svg { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 16px; height: 16px; filter: drop-shadow(0 1px 1px rgba(0,0,0,.3)); }
  
  .twk-fab { position: fixed; left: 16px; bottom: 16px; z-index: 2147483645; width: 44px; height: 44px; border-radius: 50%; background: #161616; border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; color: #fff; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.3); transition: transform 0.2s, background 0.2s; }
  .twk-fab:hover { transform: scale(1.05); background: #222; }
`;

interface TweakRowProps {
  label: string;
  children: React.ReactNode;
  inline?: boolean;
}

function TweakRow({ label, children, inline = false }: TweakRowProps) {
  return (
    <div className={inline ? 'twk-row twk-row-h' : 'twk-row'}>
      <div className="twk-lbl">
        <span>{label}</span>
      </div>
      {children}
    </div>
  );
}

interface TweakToggleProps {
  label: string;
  value: boolean;
  onChange: (val: boolean) => void;
}

function TweakToggle({ label, value, onChange }: TweakToggleProps) {
  return (
    <div className="twk-row twk-row-h">
      <div className="twk-lbl"><span>{label}</span></div>
      <button type="button" className="twk-toggle" data-on={value ? '1' : '0'} onClick={() => onChange(!value)}>
        <i />
      </button>
    </div>
  );
}

const TwkCheck = () => (
  <svg viewBox="0 0 14 14" aria-hidden="true">
    <path d="M3 7.2 5.8 10 11 4.2" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" stroke="#fff" />
  </svg>
);

interface TweakColorProps {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
}

function TweakColor({ label, value, options, onChange }: TweakColorProps) {
  return (
    <TweakRow label={label}>
      <div className="twk-chips" role="radiogroup">
        {options.map((hex, i) => {
          const on = hex.toLowerCase() === value.toLowerCase();
          return (
            <button key={i} type="button" className="twk-chip" role="radio" aria-checked={on} data-on={on ? '1' : '0'} style={{ background: hex }} onClick={() => onChange(hex)}>
              {on && <TwkCheck />}
            </button>
          );
        })}
      </div>
    </TweakRow>
  );
}

export default function ThemeTweaks() {
  const [open, setOpen] = useState(false);
  const [accent, setAccent] = useState('#e87722');
  const [dark, setDark] = useState(true);
  const dragRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 16, y: 16 });

  // Update CSS Variables and Classes real-time
  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accent);
    
    // We update all static instances of the orange color as well
    const accentElements = document.querySelectorAll<HTMLElement>('.text-\\[\\#e87722\\]');
    accentElements.forEach(el => el.style.color = accent);
  }, [accent]);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  }, [dark]);

  const onDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX, sy = e.clientY;
    const startLeft = r.left;
    const startBottom = window.innerHeight - r.bottom;
    
    const move = (ev: MouseEvent) => {
      offsetRef.current = {
        x: Math.max(16, startLeft + (ev.clientX - sx)),
        y: Math.max(16, startBottom - (ev.clientY - sy)),
      };
      panel.style.left = offsetRef.current.x + 'px';
      panel.style.bottom = offsetRef.current.y + 'px';
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  if (!open) {
    return (
      <>
        <style>{__TWEAKS_STYLE}</style>
        <button className="twk-fab" onClick={() => setOpen(true)} title="Customize Theme">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20.5S2 16 2 10.5C2 7.5 4.5 5 7.5 5c1.7 0 3.3 1 4.5 2.5C13.2 6 14.8 5 16.5 5 19.5 5 22 7.5 22 10.5c0 5.5-10 10.5-10 10.5z"></path>
          </svg>
        </button>
      </>
    );
  }

  return (
    <>
      <style>{__TWEAKS_STYLE}</style>
      <div ref={dragRef} className="twk-panel" style={{ left: offsetRef.current.x, bottom: offsetRef.current.y }}>
        <div className="twk-hd" onMouseDown={onDragStart}>
          <b>Personalizar Marca</b>
          <button className="twk-x" onClick={() => setOpen(false)}>✕</button>
        </div>
        <div className="twk-body">
          <TweakColor 
            label="Color de Énfasis" 
            value={accent} 
            options={['#e87722', '#2A6FDB', '#1F8A5B', '#D93B57', '#8A2BE2', '#FFFFFF']} 
            onChange={setAccent} 
          />
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '4px 0' }} />
          <TweakToggle 
            label="Modo Oscuro" 
            value={dark} 
            onChange={setDark} 
          />
        </div>
      </div>
    </>
  );
}
