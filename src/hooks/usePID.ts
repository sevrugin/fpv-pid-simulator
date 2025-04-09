// src/hooks/usePID.ts
import { useRef } from "react";

export function usePID(p: number, i: number, d: number) {
    // BF pid.h:46
    const PTERM_SCALE = 0.032029;
    const ITERM_SCALE = 0.244381;
    const DTERM_SCALE = 0.000529;

    const prevError = useRef(0);
    const integral = useRef(0);
    const lastTime = useRef(performance.now());

    return (target: number, current: number) => {
        const now = performance.now();
        let dt = (now - lastTime.current) / 1000;
        lastTime.current = now;

        // Безопасное значение dt
        dt = Math.min(Math.max(dt, 0.001), 0.1);

        const error = target - current;

        // Интегральная часть с анти-виндапом
        integral.current += error * dt;
        integral.current = Math.max(-250, Math.min(250, integral.current));

        // Производная часть
        const derivative = (error - prevError.current) / dt * 10;
        prevError.current = error;

        // Выход
        const output =
            p * PTERM_SCALE * error +
            i * ITERM_SCALE * integral.current +
            d * DTERM_SCALE * derivative;

        // Ограничение выхода
        return Math.max(-250, Math.min(250, output));
    };
}
