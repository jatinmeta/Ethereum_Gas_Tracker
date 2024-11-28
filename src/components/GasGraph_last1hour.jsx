import axios from "axios";
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from "chart.js";
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const GasGraph_last1hour = () => {
  const [gasData, setGasData] = useState(null);
  const [fiveMinuteGraphData, setFiveMinuteGraphData] = useState({ labels: [], low: [], avg: [], high: [] });
  const [fiveMinuteSum, setFiveMinuteSum] = useState({ low: 0, avg: 0, high: 0, count: 0 });
  const API_KEY = "W2PH28BIATGMGN3FE7ME2J9A12USC1IY6B";

  const fetchGasData = async () => {
    try {
      const gasResponse = await axios.get(
        `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${API_KEY}`
      );

      if (gasResponse.data.status === "1" && gasResponse.data.result) {
        const result = gasResponse.data.result;
        const currentTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

        setGasData({
          SafeLow: result.SafeGasPrice,
          Standard: result.ProposeGasPrice,
          Fast: result.FastGasPrice,
        });

        setFiveMinuteSum(prevSum => ({
          low: prevSum.low + parseFloat(result.SafeGasPrice),
          avg: prevSum.avg + parseFloat(result.ProposeGasPrice),
          high: prevSum.high + parseFloat(result.FastGasPrice),
          count: prevSum.count + 1,
        }));

        setFiveMinuteGraphData(prevData => {
          const newLabels = [...prevData.labels, currentTime];
          const newLow = [...prevData.low, parseFloat(result.SafeGasPrice)];
          const newAvg = [...prevData.avg, parseFloat(result.ProposeGasPrice)];
          const newHigh = [...prevData.high, parseFloat(result.FastGasPrice)];

          // Keep only the last 60 data points (5 minutes)
          if (newLabels.length > 60) {
            newLabels.shift();
            newLow.shift();
            newAvg.shift();
            newHigh.shift();
          }

          return {
            labels: newLabels,
            low: newLow,
            avg: newAvg,
            high: newHigh,
          };
        });
      }
    } catch (error) {
      console.error("Error fetching gas data:", error);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchGasData();
  }, []);

  // Set up interval for subsequent updates
  useEffect(() => {
    const interval = setInterval(fetchGasData, 10000);
    return () => clearInterval(interval);
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        padding: 12,
        bodyFont: {
          family: "'JetBrains Mono', monospace",
          size: 12,
        },
        titleFont: {
          family: "'Space Grotesk', sans-serif",
          size: 14,
          weight: 'bold',
        },
      },
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#FFFFFF',
          font: {
            family: "'Space Grotesk', sans-serif",
            size: 12,
            weight: '500',
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
          maxRotation: 45,
          minRotation: 45,
          maxTicksLimit: 24,
        },
        title: {
          display: true,
          text: 'Time (24h)',
          color: '#FFFFFF',
          font: {
            family: "'Space Grotesk', sans-serif",
            size: 14,
            weight: 'bold',
          },
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            family: "'JetBrains Mono', monospace",
            size: 12,
          },
          callback: function(value) {
            return Math.round(value) + ' Gwei';
          },
          stepSize: 1,
        },
        title: {
          display: true,
          text: 'Gas Price (Gwei)',
          color: '#FFFFFF',
          font: {
            family: "'Space Grotesk', sans-serif",
            size: 14,
            weight: 'bold',
          },
        },
        suggestedMin: function(context) {
          const values = context.chart.data.datasets.flatMap(d => d.data);
          const min = Math.min(...values);
          return Math.max(0, min - (min * 0.2)); // 20% padding below min, but not less than 0
        },
        suggestedMax: function(context) {
          const values = context.chart.data.datasets.flatMap(d => d.data);
          const max = Math.max(...values);
          return max + (max * 0.2); // 20% padding above max
        },
        grace: '10%', // Add some extra padding
      },
    },
    elements: {
      line: {
        tension: 0.4, // Smooth curves
      },
      point: {
        radius: 0, // Hide points
        hitRadius: 10, // Area around point that triggers hover
        hoverRadius: 4, // Point size on hover
      },
    },
    animation: {
      duration: 750,
      easing: 'easeInOutQuart',
    },
  };

  const data = {
    labels: fiveMinuteGraphData.labels,
    datasets: [
      {
        label: 'Low',
        data: fiveMinuteGraphData.low,
        borderColor: 'rgba(77, 255, 145, 1)', // Neon Green
        backgroundColor: 'rgba(77, 255, 145, 0.1)',
        pointBackgroundColor: 'rgba(77, 255, 145, 1)',
        borderWidth: 2,
      },
      {
        label: 'Average',
        data: fiveMinuteGraphData.avg,
        borderColor: 'rgba(255, 249, 77, 1)', // Neon Yellow
        backgroundColor: 'rgba(255, 249, 77, 0.1)',
        pointBackgroundColor: 'rgba(255, 249, 77, 1)',
        borderWidth: 2,
      },
      {
        label: 'High',
        data: fiveMinuteGraphData.high,
        borderColor: 'rgba(255, 77, 77, 1)', // Neon Red
        backgroundColor: 'rgba(255, 77, 77, 0.1)',
        pointBackgroundColor: 'rgba(255, 77, 77, 1)',
        borderWidth: 2,
      },
    ],
  };

  return (
    <div style={{ width: '100%', height: '400px', margin: '0 auto' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default GasGraph_last1hour;
