import React, { useMemo } from 'react';

interface SliderProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    className?: string;
}

export const Slider: React.FC<SliderProps> = ({
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    className = ''
}) => {
    const percentage = useMemo(() => ((value - min) / (max - min)) * 100, [value, min, max]);

    return (
        <div className={`relative ${className}`}>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="absolute inset-0 z-10 h-1 rounded-lg appearance-none cursor-pointer"
                style={{
                    backgroundColor: 'transparent',
                }}
            />
            <div className="absolute inset-0 h-1 rounded-lg pointer-events-none" style={{ backgroundColor: 'var(--text-tertiary)', opacity: 0.3 }} />
            <div className="absolute bottom-0 left-0 h-1 rounded-lg pointer-events-none" style={{ backgroundColor: 'var(--primary)', width: `${percentage}%` }} />
        </div>
    );
    };
