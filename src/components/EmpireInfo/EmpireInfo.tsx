import React, { useMemo, useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  type ChartOptions,
  type ChartData,
} from "chart.js";
import type { Empire } from "../../types/geo";
import "./EmpireInfo.css";
import {
  calculateIlluminationDataStream,
  generateTimeLabels,
} from "../../utils/illumination";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Add this plugin near your imports or inside the component file:
const nightSkyBackgroundPlugin = {
  id: "nightSkyBackground",
  beforeDraw: (chart: any) => {
    const {
      ctx,
      chartArea: { left, top, width, height },
    } = chart;

    ctx.save();

    // Create a vertical gradient similar to your CSS night sky
    const gradient = ctx.createLinearGradient(0, top, 0, top + height);
    gradient.addColorStop(0, "#0a0a2a");
    gradient.addColorStop(1, "#000022");

    ctx.fillStyle = gradient;
    ctx.fillRect(left, top, width, height);

    ctx.restore();
  },
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  nightSkyBackgroundPlugin
);

interface EmpireInfoProps {
  empire: Empire | null;
  date: Date;
  onClose: () => unknown;
}

export const EmpireInfo: React.FC<EmpireInfoProps> = ({
  empire,
  date,
  onClose,
}) => {
  const [illuminationData, setIlluminationData] = useState<number[]>([]);
  const timeLabels = useMemo(() => generateTimeLabels(), []);

  useEffect(() => {
    if (!empire) return;

    let isMounted = true;
    setIlluminationData([]); // Reset

    const runGenerator = async () => {
      const generator = calculateIlluminationDataStream(empire, date);
      const newData: number[] = [];

      for await (const value of generator) {
        if (!isMounted) break;
        newData.push(value);
        setIlluminationData([...newData]);
      }
    };

    runGenerator();

    return () => {
      isMounted = false;
    };
  }, [empire, date.getFullYear(), date.getMonth(), date.getDate()]);

  if (!empire) return null;

  // Pad illuminationData to 24 hours with null for fixed x-axis length
  const paddedData = Array(25)
    .fill(null)
    .map((_, i) => illuminationData[i] ?? null);

  const currentHour = date.getHours();
  const currentMinutes = date.getMinutes();
  const currentTimeIndex = currentHour + currentMinutes / 60;
  const closestIndex = paddedData.length
    ? paddedData.findIndex((_, i) => i === Math.round(currentTimeIndex))
    : -1;

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 100,
        ticks: {
          callback: (tick) => `${tick}%`,
          autoSkip: true,
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      x: {
        type: "category",
        labels: timeLabels,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 25,
        },
      },
    },
    plugins: {
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    elements: {
      point: {
        radius: (ctx) => {
          const index = ctx.dataIndex;
          console.log("radius", closestIndex);
          return index === closestIndex ? 6 : 0;
        },
        backgroundColor: (ctx) => {
          const index = ctx.dataIndex;
          console.log("backgroundColor", closestIndex);
          return index === closestIndex
            ? "rgba(255, 255, 255, 1)"
            : "rgba(255, 223, 0, 1)";
        },
      },
    },
  };
  const redData = paddedData.map((v) => {
    if (v === null) return null;
    if (v >= 0.5) return null;

    return v;
  });

  const yellowData = paddedData.map((v, i, arr) => {
    if (v === null) return null;

    if (v >= 0.5) return v;

    const prev = i > 0 ? arr[i - 1] : null;
    const next = i < arr.length - 1 ? arr[i + 1] : null;
    const isTransition = [prev, next].some(
      (neighbor) => neighbor !== null && neighbor >= 0.5
    );
    return isTransition ? v : null;
  });

  const chartData: ChartData<"line"> = {
    labels: timeLabels,
    datasets: [
      {
        label: "SunSet",
        data: redData,
        fill: true,
        backgroundColor: "rgba(61, 0, 183, 0.3)", // translucent red fill
        borderColor: "rgba(61, 0, 183, 1)", // solid red line
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: "SunRise",
        data: yellowData,
        fill: true,
        backgroundColor: "rgba(255, 223, 0, 0.3)", // translucent yellow fill
        borderColor: "rgba(255, 223, 0, 1)", // solid yellow line
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  return (
    <div className="empire-info">
      <div className="header-info">
        <h2>{empire.name}</h2>
        <button className="button close-button" onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
      <div className="graph-container">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};
