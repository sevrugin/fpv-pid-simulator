import React, { useState } from "react";
import { ControlPanel } from "./components/ControlPanel";
import { CopterView } from "./components/CopterView";
import { PidGraph } from "./components/PidGraph";

export default function App() {
    const motorPresets = [
        {
            "name": "T-Motor F80 Pro (7-8 inch)",
            "size": "2508",
            "kv": 1900,
            "weight": 0.054,
            "thrust": 2.2
        },
        {
            "name": "BrotherHobby Avenger (7-9 inch)",
            "size": "2806.5",
            "kv": 1500,
            "weight": 0.060,
            "thrust": 2.5
        },
        {
            "name": "iFlight Xing2 (8-10 inch)",
            "size": "2809",
            "kv": 1250,
            "weight": 0.072,
            "thrust": 2.8
        },
        {
            "name": "T-Motor Velox V2806 (7-8 inch)",
            "size": "2806",
            "kv": 1300,
            "weight": 0.063,
            "thrust": 2.4
        },
        {
            "name": "RCINPOWER GTS V2 (7 inch)",
            "size": "2507",
            "kv": 1500,
            "weight": 0.052,
            "thrust": 2.1
        },
        {
            "name": "Sunnysky X4108S (9-10 inch)",
            "size": "4108",
            "kv": 480,
            "weight": 0.095,
            "thrust": 3.5
        },
        {
            "name": "T-Motor MN3110 (8-9 inch)",
            "size": "3110",
            "kv": 700,
            "weight": 0.080,
            "thrust": 3.0
        },
        {
            "name": "T-Motor U7 V2 (10 inch)",
            "size": "3520",
            "kv": 420,
            "weight": 0.123,
            "thrust": 4.5
        },
        {
            "name": "T-Motor U8 Lite (10 inch)",
            "size": "3525",
            "kv": 150,
            "weight": 0.130,
            "thrust": 5.0
        },
        {
            "name": "iFlight Xing X3115 (8-10 inch)",
            "size": "3115",
            "kv": 1050,
            "weight": 0.090,
            "thrust": 3.2
        },
        {
            "name": "BrotherHobby Tornado T5 (8-9 inch)",
            "size": "2808",
            "kv": 900,
            "weight": 0.065,
            "thrust": 2.7
        },
        {
            "name": "Sunnysky V4008 (9 inch)",
            "size": "4008",
            "kv": 900,
            "weight": 0.085,
            "thrust": 3.1
        }
    ];

    const [pid, setPid] = useState({ p: 45, i: 80, d: 30 });
    const [angle, setAngle] = useState(0);
    const [correction, setCorrection] = useState(0);
    const [motorIndex, setMotorIndex] = useState(0);
    const [frameSize, setFrameSize] = useState(7);

    return (
        <div className="flex flex-col md:flex-row h-screen p-4 gap-4">
            <div className="md:w-1/3">
                <ControlPanel
                    pid={pid}
                    setPid={setPid}
                    motorPresets={motorPresets}
                    motorIndex={motorIndex}
                    setMotorIndex={setMotorIndex}
                    frameSize={frameSize}
                    setFrameSize={setFrameSize}
                />
            </div>
            <div className="md:w-1/4 relative justify-center">
                <div style={{fontSize: 12, textIndent: "2rem", textAlign: "justify", marginBottom: 50}}>
                    <p>
                        This is the <b>PID Simulator</b>, a fun and interactive tool designed to experiment with different PID (Proportional, Integral, Derivative) settings, frame sizes, and motor configurations. It allows you to visualize how these parameters affect the behavior of a quadcopter in real-time.
                    </p>
                    <p>
                        The PID system in this simulator works similarly to the ones used in platforms like <b>Betaflight</b>, making it a great way to understand and tweak PID settings without needing a physical quadcopter.
                    </p>
                    <p>
                        You are welcome to use this simulator for educational purposes, and I hope you find it as enjoyable as I do!
                    </p>
                </div>
                <CopterView
                    pid={pid}
                    setAngle={setAngle}
                    setCorrection={setCorrection}
                    motor={motorPresets[motorIndex]}
                    frameSize={frameSize}
                />
            </div>
            <div className="md:w-1/3">
                <PidGraph angle={angle} correction={correction} />            </div>
        </div>
    );
}