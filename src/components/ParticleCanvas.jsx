import { useEffect, useRef } from "react";

export default function ParticleCanvas({ count = 180, className = "" }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let animFrame;
        let particles = [];

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        const init = () => {
            resize();
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.2 + 0.3,
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,
                opacity: Math.random() * 0.2 + 0.05,
            }));
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (const p of particles) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
                ctx.fill();

                p.x += p.vx;
                p.y += p.vy;

                if (p.x < -2) p.x = canvas.width + 2;
                if (p.x > canvas.width + 2) p.x = -2;
                if (p.y < -2) p.y = canvas.height + 2;
                if (p.y > canvas.height + 2) p.y = -2;
            }
            animFrame = requestAnimationFrame(draw);
        };

        init();
        draw();

        const observer = new ResizeObserver(resize);
        observer.observe(canvas);

        return () => {
            cancelAnimationFrame(animFrame);
            observer.disconnect();
        };
    }, [count]);

    return (
        <canvas
            ref={canvasRef}
            className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
        />
    );
}
