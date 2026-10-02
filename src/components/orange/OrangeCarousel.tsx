import { useRef } from "react";
import Icon from "@/components/ui/icon";
import SmartImg from "./SmartImg";
import type { Photo } from "./orangeData";

type Props = {
  photos: Photo[];
  index: number;
  onIndex: (i: number) => void;
  onOpen: () => void;
  alt: string;
  eager?: boolean;
  className?: string;
};

const OrangeCarousel = ({ photos, index, onIndex, onOpen, alt, eager, className = "" }: Props) => {
  const startX = useRef<number | null>(null);
  const swiped = useRef(false);
  const many = photos.length > 1;
  const go = (dir: number) => onIndex((index + dir + photos.length) % photos.length);

  return (
    <div
      className={`group/c relative overflow-hidden bg-secondary ${className}`}
      onTouchStart={(e) => { startX.current = e.touches[0].clientX; swiped.current = false; }}
      onTouchEnd={(e) => {
        if (startX.current === null || !many) return;
        const dx = e.changedTouches[0].clientX - startX.current;
        if (Math.abs(dx) > 40) { swiped.current = true; go(dx < 0 ? 1 : -1); }
        startX.current = null;
      }}
    >
      <div className="flex h-full transition-transform duration-500 ease-out" style={{ transform: `translateX(-${index * 100}%)` }}>
        {photos.map((p, i) => (
          <button
            key={p.src}
            type="button"
            onClick={() => !swiped.current && onOpen()}
            className="h-full w-full shrink-0 cursor-zoom-in"
            aria-label="Открыть фото на весь экран"
          >
            <SmartImg
              photo={p}
              alt={`${alt} — фото ${i + 1}`}
              loading={eager && i === 0 ? "eager" : "lazy"}
              className="h-full w-full object-cover transition-transform duration-[1100ms] ease-out group-hover/c:scale-[1.04]"
            />
          </button>
        ))}
      </div>

      <span className="pointer-events-none absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur transition group-hover/c:opacity-100">
        <Icon name="Maximize2" size={14} />
      </span>

      {many && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); go(-1); }}
            className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/85 p-1.5 text-[#121316] opacity-0 shadow transition group-hover/c:opacity-100 sm:block"
            aria-label="Предыдущее фото"
          >
            <Icon name="ChevronLeft" size={16} />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); go(1); }}
            className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/85 p-1.5 text-[#121316] opacity-0 shadow transition group-hover/c:opacity-100 sm:block"
            aria-label="Следующее фото"
          >
            <Icon name="ChevronRight" size={16} />
          </button>
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
            {photos.map((p, i) => (
              <button
                key={p.src}
                type="button"
                onClick={(e) => { e.stopPropagation(); onIndex(i); }}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-white" : "w-1.5 bg-white/55 hover:bg-white/80"}`}
                aria-label={`Фото ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default OrangeCarousel;
