import React, { useMemo } from "react";

interface CarouselItem {
  id: string;
  label: string;
  symbol: string;
}

interface PhonemeCarouselProps {
  items: CarouselItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
  displaySymbol?: string; // Complete symbol with diacritics for active item
}

const PhonemeCarousel: React.FC<PhonemeCarouselProps> = ({ items, activeId, onSelect, displaySymbol }) => {
  if (items.length === 0) {
    return (
      <div className="px-3 py-2 text-xs" style={{ color: "var(--text-tertiary)" }}>
        No phonemes available
      </div>
    );
  }

  // Find active index
  const activeIndex = items.findIndex((item) => item.id === activeId);
  const actualActive = activeIndex >= 0 ? activeIndex : 0;

  // Use displaySymbol if provided, otherwise use item symbol
  const activeDisplaySymbol = displaySymbol || items[actualActive]?.symbol || "";

  // Build visible items: previous, active, next (with wrapping)
  const getPrevIndex = (idx: number) => (idx - 1 + items.length) % items.length;
  const getNextIndex = (idx: number) => (idx + 1) % items.length;

  const prevIndex = getPrevIndex(actualActive);
  const nextIndex = getNextIndex(actualActive);

  // Determine if carousel should be shown (need at least 3 items)
  const showCarousel = items.length >= 3;

  if (!showCarousel) {
    // For less than 3 items, show as simple carousel without side buttons
    return (
      <div className="flex gap-3 items-center justify-center py-4 px-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`flex-shrink-0 flex flex-col items-center justify-center rounded-lg border transition-all duration-300 ${
              item.id === activeId ? "w-36 h-36 border-2" : "w-16 h-20 opacity-50"
            }`}
            style={{
              borderColor: item.id === activeId ? "var(--accent)" : "var(--border)",
              backgroundColor: item.id === activeId ? "rgba(var(--accent-rgb, 0, 0, 0), 0.1)" : "var(--inputfield)",
            }}
          >
            <div
              className={item.id === activeId ? "text-4xl font-bold mb-2" : "text-sm font-medium"}
              style={{ color: item.id === activeId ? "var(--accent)" : "var(--text-tertiary)" }}
            >
              {item.id === activeId ? activeDisplaySymbol : item.symbol}
            </div>
            {item.id === activeId && (
              <div className="text-xs font-semibold text-center px-2" style={{ color: "var(--text-secondary)" }}>
                {item.label}
              </div>
            )}
          </button>
        ))}
      </div>
    );
  }

  // Carousel layout with smooth transitions
  return (
    <div className="flex gap-3 items-center justify-center py-4 px-2">
      {/* Previous item */}
      <button
        onClick={() => onSelect(items[prevIndex].id)}
        className="flex-shrink-0 w-16 h-20 flex flex-col items-center justify-center rounded-lg border transition-all duration-300 hover:opacity-70 cursor-pointer"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--inputfield)",
          opacity: 0.5,
        }}
        title={items[prevIndex].label}
      >
        <div className="text-sm font-medium" style={{ color: "var(--text-tertiary)" }}>
          {items[prevIndex].symbol}
        </div>
      </button>

      {/* Active item (center) - larger */}
      <div className="flex-shrink-0 w-36 h-36 flex flex-col items-center justify-center rounded-lg border-2 transition-all duration-300"
        style={{
          borderColor: "var(--accent)",
          backgroundColor: "rgba(var(--accent-rgb, 0, 0, 0), 0.1)",
        }}
      >
        <div
          className="text-4xl font-bold mb-2"
          style={{ color: "var(--accent)" }}
        >
          {activeDisplaySymbol}
        </div>
        <div
          className="text-xs font-semibold text-center px-2"
          style={{ color: "var(--text-secondary)" }}
        >
          {items[actualActive].label}
        </div>
      </div>

      {/* Next item */}
      <button
        onClick={() => onSelect(items[nextIndex].id)}
        className="flex-shrink-0 w-16 h-20 flex flex-col items-center justify-center rounded-lg border transition-all duration-300 hover:opacity-70 cursor-pointer"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--inputfield)",
          opacity: 0.5,
        }}
        title={items[nextIndex].label}
      >
        <div className="text-sm font-medium" style={{ color: "var(--text-tertiary)" }}>
          {items[nextIndex].symbol}
        </div>
      </button>
    </div>
  );
};

export default PhonemeCarousel;
