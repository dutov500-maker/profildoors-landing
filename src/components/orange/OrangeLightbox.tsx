import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Icon from "@/components/ui/icon";
import SmartImg from "./SmartImg";
import type { Photo } from "./orangeData";

type Props = { photos: Photo[]; index: number; title: string; onClose: () => void; onIndex: (i: number) => void };

const OrangeLightbox = ({ photos, index, title, onClose, onIndex }: Props) => {
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const touchX = useRef<number | null>(null);

  const go = useCallback(
    (dir: number) => {
      setZoom(1);
      setPos({ x: 0, y: 0 });
      onIndex((index + dir + photos.length) % photos.length);
    },
    [index, photos.length, onIndex],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [go, onClose]);

  const setZ = (z: number) => {
    const nz = Math.min(4, Math.max(1, z));
    setZoom(nz);
    if (nz === 1) setPos({ x: 0, y: 0 });
  };

  return createPortal(
    <div className="fixed inset-0 z-[200] flex flex-col bg-black/95 text-white animate-fade-in">
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <p className="truncate text-[0.9em] text-white/70">
          {title} <span className="ml-2 text-white/40">{index + 1} / {photos.length}</span>
        </p>
        <div className="flex items-center gap-1">
          <button onClick={() => setZ(zoom - 0.5)} className="rounded-full p-2.5 hover:bg-white/10" aria-label="Уменьшить">
            <Icon name="ZoomOut" size={20} />
          </button>
          <button onClick={() => setZ(zoom + 0.5)} className="rounded-full p-2.5 hover:bg-white/10" aria-label="Увеличить">
            <Icon name="ZoomIn" size={20} />
          </button>
          <button onClick={onClose} className="ml-2 rounded-full p-2.5 hover:bg-white/10" aria-label="Закрыть">
            <Icon name="X" size={22} />
          </button>
        </div>
      </div>

      <div
        className={`relative flex-1 select-none overflow-hidden ${zoom > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"}`}
        onWheel={(e) => setZ(zoom - e.deltaY * 0.002)}
        onDoubleClick={() => setZ(zoom > 1 ? 1 : 2.5)}
        onClick={() => zoom === 1 && setZ(2)}
        onMouseDown={(e) => zoom > 1 && (drag.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y })}
        onMouseMove={(e) => {
          if (!drag.current) return;
          setPos({ x: drag.current.px + e.clientX - drag.current.x, y: drag.current.py + e.clientY - drag.current.y });
        }}
        onMouseUp={() => (drag.current = null)}
        onMouseLeave={() => (drag.current = null)}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null || zoom > 1) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        <SmartImg
          key={photos[index].src}
          photo={photos[index]}
          alt={title}
          className="absolute inset-0 m-auto max-h-full max-w-full object-contain transition-transform duration-200"
          style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${zoom})` }}
        />
        {photos.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); go(-1); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 backdrop-blur hover:bg-white/20 sm:left-6"
              aria-label="Предыдущее фото"
            >
              <Icon name="ChevronLeft" size={24} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); go(1); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 backdrop-blur hover:bg-white/20 sm:right-6"
              aria-label="Следующее фото"
            >
              <Icon name="ChevronRight" size={24} />
            </button>
          </>
        )}
      </div>

      {photos.length > 1 && (
        <div className="flex justify-center gap-2 px-4 py-4">
          {photos.map((p, i) => (
            <button
              key={p.src}
              onClick={() => { setZ(1); onIndex(i); }}
              className={`h-14 w-14 overflow-hidden rounded-md border-2 transition ${i === index ? "border-[#E05A2B]" : "border-transparent opacity-50 hover:opacity-100"}`}
            >
              <SmartImg photo={p} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body,
  );
};

export default OrangeLightbox;
