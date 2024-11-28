import React from "react";
import { Line } from "react-chartjs-2";
import './GasGraph.css'; // Assuming you are using an external CSS file

const GasGraph = ({ graphData, date }) => {
  const chartData = {
    labels: graphData.labels, // Ensure graphData.labels are in the format ["13:00", "13:01", ...]
    datasets: [
      {
        label: "Low Gas",
        data: graphData.low.map(value => value.toFixed(2)),
        borderColor: "green",
        backgroundColor: "rgba(0, 128, 0, 0.6)",
        fill: true,
      },
      {
        label: "Avg Gas",
        data: graphData.avg.map(value => value.toFixed(2)),
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.6)",
        fill: true,
      },
      {
        label: "High Gas",
        data: graphData.high.map(value => value.toFixed(2)),
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.6)",
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw} Gwei`,
        },
      },
      legend: {
        display: true,
        position: "top",
        labels: {
          font: {
            size: 14,
            weight: 'bold',
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
    },
    scales: {
      x: {
        type: 'category', // Use category type when dealing with string labels
        title: {
          display: false,
          text: "Time",
          font: {
            size: 10,
            weight: 'bold',
          },
        },
        grid: {
          display: false, // Optional, to remove horizontal grid lines
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 12,
          font: {
            size: 13, // Adjust the font size of the time labels
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Gas Price (Gwei)",
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        beginAtZero: true,
        
        ticks: {
          stepSize: 3, // Set the step size to 2, so ticks will be 0, 2, 4, 6, 8, etc.
        },
      },
    },
  };

  return (
    <div className="gas-graph-container">
      {/* Display the custom title */}
      <h2 className="gas-graph-title">Insights from the Last 12 Hours</h2>
      <Line data={chartData} options={options} />
      {/* Display the date at the bottom-center below the graph */}
      <div className="graph-date">{date}</div>
    </div>
  );
};

export default GasGraph;
