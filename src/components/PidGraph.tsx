import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Line, Text } from "react-konva";

interface PidGraphProps {
  angle: number;
  correction: number;
}

export const PidGraph: React.FC<PidGraphProps> = ({ angle, correction }) => {
  const [data, setData] = useState<{ time: number[]; angles: number[]; corrections: number[] }>({
    time: [],
    angles: [],
    corrections: [],
  });
  const [isCollecting, setIsCollecting] = useState(false); // State to control data collection
  const timeRef = useRef(0);

  const startCollectingData = () => {
    setData({ time: [], angles: [], corrections: [] }); // Reset data
    timeRef.current = 0; // Reset time
    setIsCollecting(true); // Start collecting data
  };

  // start collecting data if left or right arrow pressed
  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          startCollectingData();
      }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isCollecting) return;
    const interval = setInterval(() => {
      timeRef.current += 1;

      setData((prevData) => {
        const newData = {
          time: [...prevData.time, timeRef.current],
          angles: [...prevData.angles, angle],
          corrections: [...prevData.corrections, correction],
        };

        // Stop collecting if data size reaches 100
        if (newData.time.length > 1) {
            setIsCollecting(false);
            clearInterval(interval);
        }

        return newData;
      });
      return () => clearInterval(interval);
    }, 1000); // Collect data every 10ms
  }, [angle, correction, isCollecting]);

  const anglePoints = data.angles.map((value, index) => [index*5+50, 300 - value*4]).flat();
  const correctionPoints = data.corrections.map((value, index) => [index*5+50, 300 - value * 100]).flat();

  return (
      <div>
        <button
            onClick={startCollectingData}
            disabled={isCollecting}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Start Collecting Data
        </button>
        <Stage width={600} height={600}>
          <Layer>
            {/* X-axis */}
            <Line points={[50, 300, 550, 300]} stroke="black" strokeWidth={1} />
            {/* Y-axis */}
            <Line points={[50, 550, 50, 50]} stroke="black" strokeWidth={1} />

            {/* X-axis labels */}
            <Text x={50} y={560} text="0" fontSize={12} />
            <Text x={275} y={560} text="Time" fontSize={12} />
            <Text x={540} y={560} text="1s" fontSize={12} />

            {/* Y-axis labels */}
            <Text x={10} y={50} text="25" fontSize={12} />
            <Text x={10} y={350} text="0" fontSize={12} />
            <Text x={10} y={550} text="-25" fontSize={12} />

            {/* Angle Line */}
            <Line
                points={anglePoints}
                stroke="blue"
                strokeWidth={2}
                lineCap="round"
                lineJoin="round"
            />
            {/* Correction Line */}
            <Line
                points={correctionPoints}
                stroke="red"
                strokeWidth={2}
                lineCap="round"
                lineJoin="round"
            />

            {/* Legend */}
            <Text x={400} y={20} text="Legend:" fontSize={14} fontStyle="bold" />
            <Line points={[400, 40, 420, 40]} stroke="blue" strokeWidth={2} />
            <Text x={430} y={35} text="Angle" fontSize={12} />
            <Line points={[400, 60, 420, 60]} stroke="red" strokeWidth={2} />
            <Text x={430} y={55} text="Correction" fontSize={12} />
          </Layer>
        </Stage>
      </div>
  );
};