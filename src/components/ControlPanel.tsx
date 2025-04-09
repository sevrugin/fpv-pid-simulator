// src/components/ControlPanel.tsx
import React from "react";

interface ControlPanelProps {
    pid: { p: number; i: number; d: number },
    setPid: (pid: { p: number; i: number; d: number }) => void,
    motorPresets: { name: string; size: string; kv: number; weight: number; thrust: number }[],
    motorIndex: number,
    setMotorIndex: (index: number) => void,
    frameSize: number,
    setFrameSize: (size: number) => void,
}

export const ControlPanel: React.FC<ControlPanelProps> = ({pid, setPid, motorPresets, motorIndex, setMotorIndex, frameSize, setFrameSize}) => {

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">PID settings</h2>
            <div>
                <label>
                    <input
                        className="w-2/3"
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={pid.p}
                        onChange={(e) => setPid({...pid, p: parseFloat(e.target.value)})}
                    />&nbsp;&nbsp;
                    P: {pid.p.toFixed(1)}
                </label>
            </div>
            <div>
                <label>
                    <input
                        className="w-2/3"
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={pid.i}
                        onChange={(e) => setPid({...pid, i: parseFloat(e.target.value)})}
                    />&nbsp;&nbsp;
                    I: {pid.i.toFixed(1)}
                </label>
            </div>
            <div>
                <label>
                    <input
                        className="w-2/3"
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={pid.d}
                        onChange={(e) => setPid({...pid, d: parseFloat(e.target.value)})}
                    />&nbsp;&nbsp;
                    D: {pid.d.toFixed(1)}
                </label>
            </div>

            <h2 className="text-xl font-bold mt-6">Quad Settings</h2>
            <div>
                <label>
                    Frame size (by prop inch):<br/>
                    <input className="w-2/3" type="range" min="5" max="15" step="1" value={frameSize} onChange={(e) => setFrameSize(parseFloat(e.target.value))}/>
                    &nbsp;&nbsp;{frameSize.toFixed(1)}"
                </label>
            </div>

            <div>
                <label>
                    Motor type:
                    <select
                        className="mt-1 block w-2/3 border border-gray-200 rounded px-2 py-1"
                        value={motorPresets[motorIndex].name}
                        onChange={(e) => {
                            const selectedMotor = motorPresets.find(motor => motor.name === e.target.value);
                            if (selectedMotor) {
                                setMotorIndex(motorPresets.indexOf(selectedMotor));
                            }
                        }}
                    >
                        {motorPresets.map((motor, index) => (
                            <option key={index} value={motor.name}>{motor.name}</option>
                        ))}
                    </select>
                </label>
                <div className="text-sm text-gray-600 mt-1">
                    Weight: {motorPresets[motorIndex].weight} г | Тяга: {motorPresets[motorIndex].thrust} кг
                </div>
            </div>
        </div>
    );
};
