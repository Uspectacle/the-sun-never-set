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
  onDateChange: (newDate: Date) => unknown;
}

export const EmpireInfo: React.FC<EmpireInfoProps> = ({
  empire,
  date,
  onClose,
  onDateChange,
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

  // Current time index (fractional), then rounded & clamped to available indices
  const currentHour = date.getHours();
  const currentMinutes = date.getMinutes();
  const currentTimeIndex = currentHour + currentMinutes / 60;
  let roundedIndex = Math.round(currentTimeIndex);
  roundedIndex = Math.max(0, Math.min(roundedIndex, paddedData.length - 1));

  // Chart options — tooltip shows value to two decimals
  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    onClick: (_event, elements, chart) => {
      if (!elements.length) return;

      const element = elements[0];
      const index = element.index;

      const label = chart.data.labels?.[index] as string;
      if (!label) return;

      const [hourStr, minuteStr] = label.split(":");
      const hours = parseInt(hourStr, 10);
      const minutes = parseInt(minuteStr, 10) || 0;

      const newDate = new Date(date);
      newDate.setHours(hours, minutes, 0, 0);
      console.log(newDate);
      onDateChange(newDate);
    },
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
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            return value !== null && value !== undefined
              ? `${Number(value).toFixed(2)}%`
              : "";
          },
        },
      },
    },
    // no need for scriptable elements.point now — we use a dedicated dataset for the big dot
  };

  // split the data into the two existing datasets
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

  // Build base datasets (hide their points)
  const datasets: ChartData<"line">["datasets"] = [
    {
      label: "SunSet",
      data: redData,
      fill: true,
      backgroundColor: "rgba(61, 0, 183, 0.3)",
      borderColor: "rgba(61, 0, 183, 1)",
      tension: 0.4,
      pointRadius: 0, // keep their points hidden
      pointHitRadius: 15,
    },
    {
      label: "SunRise",
      data: yellowData,
      fill: true,
      backgroundColor: "rgba(255, 223, 0, 0.3)",
      borderColor: "rgba(255, 223, 0, 1)",
      tension: 0.4,
      pointRadius: 0,
      pointHitRadius: 15,
    },
  ];

  // Add a dedicated "Now" dataset with exactly one visible point at roundedIndex,
  // but only if there is actual data at that index.
  const highlightedValue = paddedData[roundedIndex];
  if (highlightedValue !== null && highlightedValue !== undefined) {
    const nowPointData = paddedData.map((_, i) =>
      i === roundedIndex ? highlightedValue : null
    );
    datasets.push({
      label: "Now",
      data: nowPointData,
      showLine: true,
      animations: {
        y: { duration: 0 },
        x: { duration: 0 },
      },
      // big dot styling:
      pointRadius: 8,
      pointHoverRadius: 10,
      pointBackgroundColor: "rgba(255, 255, 255, 1)",
      pointBorderColor: "rgba(0, 0, 0, 0.6)",
      pointBorderWidth: 2,
      fill: false,
      tension: 0,
    });
  }

  const chartData: ChartData<"line"> = {
    labels: timeLabels,
    datasets,
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
