import React from 'react';

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
    return (
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className={`h-1 rounded-lg appearance-none cursor-pointer ${className}`}
            style={{
                backgroundColor: 'var(--elevated)',
                accentColor: 'var(--accent)',
            }}
        />
    );
};
