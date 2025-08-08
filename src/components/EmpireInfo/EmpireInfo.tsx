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
} from "chart.js";
import type { Empire } from "../../types/geo";
import "./EmpireInfo.css";
import {
  calculateIlluminationDataStream,
  generateTimeLabels,
} from "../../utils/illumination";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
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
        setIlluminationData([...newData]); // Triggers re-render with latest value
      }
    };

    runGenerator();

    return () => {
      isMounted = false;
    };
  }, [empire, date.getFullYear(), date.getMonth(), date.getDate()]);

  const paddedData = Array(25)
    .fill(null)
    .map((_, i) => illuminationData[i] ?? null);

  if (!empire) return null;

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function (this, tickValue) {
            return `${tickValue}%`;
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        type: "category",
        ticks: {
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
          const closestIndex = paddedData.length
            ? paddedData.findIndex((_, i) => i === Math.round(currentTimeIndex))
            : -1;
          return index === closestIndex ? 6 : 0;
        },
        backgroundColor: (ctx) => {
          const index = ctx.dataIndex;
          const closestIndex = paddedData.length
            ? paddedData.findIndex((_, i) => i === Math.round(currentTimeIndex))
            : -1;
          return index === closestIndex
            ? "rgba(255, 99, 132, 1)"
            : "rgba(75, 192, 192, 1)";
        },
      },
    },
  };

  const currentHour = date.getHours();
  const currentMinutes = date.getMinutes();
  const currentTimeIndex = currentHour + currentMinutes / 60;

  const chartData = {
    labels: timeLabels.slice(0, paddedData.length),
    datasets: [
      {
        label: "Illumination %",
        data: paddedData,
        fill: true,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="empire-info">
      <div className="header-info">
        <h2>{empire.name}</h2>
        <button className="button close-button" onClick={onClose}>
          <FontAwesomeIcon icon={faX} />
        </button>
      </div>
      <div className="graph-container">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};
