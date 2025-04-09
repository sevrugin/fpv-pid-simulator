import React, { useEffect, useRef } from "react";
import { usePID } from "../hooks/usePID";

interface CopterViewProps {
    pid: { p: number; i: number; d: number };
    setAngle: (value: number) => void; // Prop to update angle in App
    setCorrection: (value: number) => void; // Prop to update correction in App
    motor: { name: string; size: string; kv: number; weight: number; thrust: number };
    frameSize: number; // Optional prop for frame size
}

export const CopterView: React.FC<CopterViewProps> = ({ pid, setAngle, setCorrection, motor, frameSize }) => {
    const angleRef = useRef(0); // Current angle of the copter
    const velocityRef = useRef(0); // Angular velocity
    const requestRef = useRef<number | null>(null);

    const pidController = usePID(pid.p, pid.i, pid.d); // PID controller instance

    // Handle keyboard input for controlling throttle and angular velocity
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") velocityRef.current = -25; // Decrease angular velocity
            if (e.key === "ArrowRight") velocityRef.current = 25; // Increase angular velocity
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Animation loop for simulating the copter's behavior
    const previousTimeRef = React.useRef(0);

    useEffect(() => {
        const animate = () => {
            let angle = (angleRef.current + 360) % 360; // Normalize angle
            if (angle > 180) angle -= 360; // Normalize angle
            if (angle < -180) angle += 360; // Normalize angle

            const deltaTime = (performance.now() - previousTimeRef.current) / 1000; // Time since last frame
            previousTimeRef.current = performance.now();

            const correction = pidController(0, angle) / 250; // PID correction to stabilize angle

            const motorDistance = (15/frameSize) * 0.00254; // Convert frame size from inches to meters
            const thrust = motor.thrust * 9.8 - motor.weight * 9.8;

            velocityRef.current += correction * thrust * motorDistance * deltaTime * 10000; // Update angular velocity based on correction

            angleRef.current += velocityRef.current; // Update angle based on velocity

            velocityRef.current *= 0.98; // Apply damping to angular velocity

            setAngle(angleRef.current); // Update angle in App
            setCorrection(correction); // Update correction in App

            requestRef.current = requestAnimationFrame(animate); // Continue animation
        };

        requestRef.current = requestAnimationFrame(animate);
        return () => {
            if (requestRef.current !== null) {
                cancelAnimationFrame(requestRef.current); // Cancel animation on unmount
            }
        };
    }, [pidController, setAngle, setCorrection, frameSize, motor]);

    return (
        <div className="w-full h-64 bg-blue-50 border rounded flex flex-col items-center justify-center">
            <div className="relative -top-20 text-sm">
                Press Left or Right Arrow to start moving
            </div>
            <div
                className="w-40 h-2 bg-gray-800 relative"
                style={{ transform: `rotate(${angleRef.current}deg)`, transition: 'transform 0.05s linear' }}
            >
                <div
                    className="absolute -left-3 -top-2 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `rgba(255, 0, 0, 1)` }}
                >
                </div>
                <div
                    className="absolute -right-3 -top-2 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `rgba(0, 255, 0, 1)` }}
                >
                </div>
            </div>
        </div>
    );
};