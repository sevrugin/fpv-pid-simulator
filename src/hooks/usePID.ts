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
        const dt = (now - lastTime.current) / 1000;
        lastTime.current = now;

        const error = target - current;
        integral.current += error * dt; // Integral term
        if (integral.current > 250) {
            integral.current = 250;
        }
        if (integral.current < -250) {
            integral.current = -250;
        }

        const derivative = (error - prevError.current) / dt * 10; // Derivative term
        prevError.current = error;

        const output = p * PTERM_SCALE * error + i * ITERM_SCALE * integral.current + d * DTERM_SCALE * derivative;
        if (output > 250) {
            return 250;
        }
        if (output < -250) {
            return -250;
        }
        return output;
    };
}
