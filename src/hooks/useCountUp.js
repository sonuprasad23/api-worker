import { useState, useEffect, useRef } from "react";

export function useCountUp(target, duration = 1200, active = true) {
    const [count, setCount] = useState(0);
    const rafRef = useRef(null);

    useEffect(() => {
        if (!active) return;
        if (target === 0) { setCount(0); return; }

        const start = performance.now();
        const startVal = 0;

        const tick = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(startVal + (target - startVal) * eased));
            if (progress < 1) {
                rafRef.current = requestAnimationFrame(tick);
            }
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, [target, duration, active]);

    return count;
}
