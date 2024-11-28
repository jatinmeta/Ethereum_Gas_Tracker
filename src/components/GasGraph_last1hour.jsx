import axios from "axios";
import GasGraph from "./GasGraph";
import React, { useState, useEffect } from "react";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from "chart.js";
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const GasGraph_last1hour = () => {
  const [graphData, setGraphData] = useState({ labels: [], low: [], avg: [], high: [] });
  const [minuteData, setMinuteData] = useState({ high: [], avg: [], low: [] });
  const [fiveMinuteGraphData, setFiveMinuteGraphData] = useState({ labels: [], low: [], avg: [], high: [] });

  const [fiveMinuteSum, setFiveMinuteSum] = useState({ low: 0, avg: 0, high: 0, count: 0 });
  const API_KEY = "W2PH28BIATGMGN3FE7ME2J9A12USC1IY6B";

  const fetchGasData = async () => {
    try {
      const gasResponse = await axios.get(
        `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${API_KEY}`
      );

      const gasDataResult = gasResponse.data.result;
      const lowPrice = parseFloat(gasDataResult.SafeGasPrice);
      const avgPrice = parseFloat(gasDataResult.ProposeGasPrice);
      const highPrice = parseFloat(gasDataResult.FastGasPrice);

      // Format current time as "HH:mm"
      const currentTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      console.log(currentTime)

      // Update real-time graph data
      setGraphData((prevData) => ({
        labels: [...prevData.labels, currentTime].slice(-10),  // Keep last 10 time points
        low: [...prevData.low, lowPrice].slice(-10),
        avg: [...prevData.avg, avgPrice].slice(-10),
        high: [...prevData.high, highPrice].slice(-10),
      }));

      // Accumulate data for minute averages
      setMinuteData((prevData) => ({
        low: [...prevData.low, lowPrice],
        avg: [...prevData.avg, avgPrice],
        high: [...prevData.high, highPrice],
      }));
    } catch (error) {
      console.error("Error fetching gas data:", error);
    }
  };

  // Calculate minute averages every minute
  useEffect(() => {
    const calculateMinuteAverages = setInterval(() => {
      setMinuteData((prevData) => {
        if (prevData.low.length > 0) {
          const avgLow = prevData.low.reduce((sum, val) => sum + val, 0) / prevData.low.length;
          const avgAvg = prevData.avg.reduce((sum, val) => sum + val, 0) / prevData.avg.length;
          const avgHigh = prevData.high.reduce((sum, val) => sum + val, 0) / prevData.high.length;

          // Update 5-minute sum
          setFiveMinuteSum((prevSum) => ({
            low: prevSum.low + avgLow,
            avg: prevSum.avg + avgAvg,
            high: prevSum.high + avgHigh,
            count: prevSum.count + 1,
          }));

          // Clear minute data for next accumulation
          return { low: [], avg: [], high: [] };
        }
        return prevData;
      });
    }, 10000); // Every minute

    return () => clearInterval(calculateMinuteAverages);
  }, []);

  // Calculate 5-minute averages every 5 minutes
  useEffect(() => {
    const calculateFiveMinuteAverages = setInterval(() => {
      setFiveMinuteSum((prevSum) => {
        if (prevSum.count > 0) {
          const avgLow = prevSum.low / prevSum.count;
          const avgAvg = prevSum.avg / prevSum.count;
          const avgHigh = prevSum.high / prevSum.count;
          const currentTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

          // Update 5-minute graph data
          setFiveMinuteGraphData((prevGraphData) => ({
            labels: [...prevGraphData.labels, currentTime].slice(-12), // Last 12 intervals (60 minutes)
            low: [...prevGraphData.low, avgLow].slice(-12),
            avg: [...prevGraphData.avg, avgAvg].slice(-12),
            high: [...prevGraphData.high, avgHigh].slice(-12),
          }));

          // Reset 5-minute sum for next interval
          return { low: 0, avg: 0, high: 0, count: 0 };
        }
        return prevSum;
      });
    }, 10000); // Every 5 minutes

    return () => clearInterval(calculateFiveMinuteAverages);
  }, []);

  // Fetch gas data every 10 seconds
  useEffect(() => {
    fetchGasData();
    const interval = setInterval(fetchGasData, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* <p>Gas prices averaged over 5-minute intervals are displayed below for the past hour.</p> */}
      <GasGraph graphData={fiveMinuteGraphData} />
    </div>
  );
};

export default GasGraph_last1hour;
