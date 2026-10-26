import { Star } from 'lucide-react';
import { useState } from 'react';

export default function RatingStars({
    rating = 0,
    size = 'sm',
    interactive = false,
    onChange,
    className = '',
}) {
    const [hovered, setHovered] = useState(0);
    const sizes = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-7 w-7',
    };
    const value = interactive ? hovered || rating : rating;

    return (
        <div className={`flex items-center gap-0.5 ${className}`}>
            {[1, 2, 3, 4, 5].map((star) => {
                const filled = star <= Math.round(value);
                const icon = (
                    <Star
                        className={`${sizes[size]} ${
                            filled ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-slate-300'
                        }`}
                    />
                );

                if (!interactive) {
                    return <span key={star}>{icon}</span>;
                }

                return (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onChange?.(star)}
                        onMouseEnter={() => setHovered(star)}
                        onMouseLeave={() => setHovered(0)}
                        className="rounded p-0.5 transition hover:scale-110"
                        aria-label={`Beri rating ${star} bintang`}
                    >
                        {icon}
                    </button>
                );
            })}
        </div>
    );
}
