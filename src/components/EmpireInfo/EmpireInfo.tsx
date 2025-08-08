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
}

export const EmpireInfo: React.FC<EmpireInfoProps> = ({ empire, date }) => {
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
          return index === Math.floor(currentTimeIndex) ? 4 : 0;
        },
        backgroundColor: (ctx) => {
          const index = ctx.dataIndex;
          return index === Math.floor(currentTimeIndex)
            ? "rgba(255, 255, 255, 1)"
            : "rgba(75, 192, 192, 1)";
        },
      },
    },
  };

  const currentHour = date.getHours();
  const currentMinutes = date.getMinutes();
  const currentTimeIndex = currentHour + currentMinutes / 60;

  const chartData = {
    labels: timeLabels.slice(0, illuminationData.length),
    datasets: [
      {
        label: "Illumination %",
        data: illuminationData,
        fill: true,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  return (
    <div className="empire-info">
      <h2>{empire.name}</h2>
      <div className="graph-container">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};
