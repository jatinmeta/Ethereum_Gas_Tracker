import React, { useState, useEffect } from 'react';
import axios from "axios";
import GasCards from "./components/GasCards";
import GasGraph_last1hour from "./components/GasGraph_last1hour";
import GasTable from "./components/GasTable";

import "./App.css";
import { Chart as ChartJS,LineElement,CategoryScale,LinearScale,PointElement,Tooltip,Legend} from "chart.js";
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function App() {
  const [gasData, setGasData] = useState(null);
  const [ethPrice, setEthPrice] = useState(0);
  const [lastBlock, setLastBlock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
  const [blockTime, setBlockTime] = useState(13);
  const [sortConfig, setSortConfig] = useState({ key: "gasLimit", direction: "asc" });
  const [showHourlyGraph, setShowHourlyGraph] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // New state variables for refresh time
  const [lastRefreshed, setLastRefreshed] = useState('');
  const [nextUpdateIn, setNextUpdateIn] = useState(10);
  const [basefee_i, set_basefee] = useState('');
  const [transactionData, setTransactionData] = useState([
    { action: "OpenSea: Sale", gasLimit: 71645 },
    { action: "Uniswap V3: Swap", gasLimit: 184523 },
    { action: "USDT: Transfer", gasLimit: 54128 },
    { action: "SushiSwap: Swap", gasLimit: 141225 },
    { action: "Curve: Swap", gasLimit: 183758 },
    { action: "Balancer: Swap", gasLimit: 196625 },
    { action: "Bancor: Swap", gasLimit: 183193 },
    { action: "1inch: Swap", gasLimit: 141905 },
    { action: "KyberSwap: Swap", gasLimit: 144389 },
    { action: "Uniswap V2: Swap", gasLimit: 152809 },
    { action: "ERC20: Transfer", gasLimit: 65000 },
    { action: "ERC721: Transfer", gasLimit: 84904 },
    { action: "CoW Protocol: Swap", gasLimit: 343353 },
    { action: "LooksRare: Sale", gasLimit: 326897 },
    { action: "Gnosis Safe: Create Multisig", gasLimit: 288276 },
    { action: "Curve: Add Liquidity", gasLimit: 271909 },
    { action: "ENS: Register Domain", gasLimit: 266996 },
    { action: "Rarible: Sale", gasLimit: 245730 },
    { action: "Uniswap V3: Add Liquidity", gasLimit: 216912 },
    { action: "SuperRare: Sale", gasLimit: 130704 },
    { action: "SuperRare: Offer", gasLimit: 85191 },
  ]);

  const API_KEY = "W2PH28BIATGMGN3FE7ME2J9A12USC1IY6B";

  const fetchGasData = async () => {
    try {
      const gasResponse = await axios.get(
        `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${API_KEY}`
      );
      const priceResponse = await axios.get(
        `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${API_KEY}`
      );

      const statusResponse = await axios.get(
        `https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=${API_KEY}`
      );

      const gasDataResult = gasResponse.data.result;
      const ethPriceInUsd = parseFloat(priceResponse.data.result.ethusd);
      const basePrice = parseFloat(gasDataResult.suggestBaseFee);
      const lowPrice = parseFloat(gasDataResult.SafeGasPrice);
      const avgPrice = parseFloat(gasDataResult.ProposeGasPrice);
      const highPrice = parseFloat(gasDataResult.FastGasPrice);

      set_basefee(basePrice);

      setGasData({
        low: {
          price: lowPrice,
          base: basePrice,
          priority: lowPrice - basePrice,
          cost: calculateCost(lowPrice, "21000", ethPriceInUsd),  //gasLimit =21000
          time: calculateTime(lowPrice, "low"),
        },
        avg: {
          price: avgPrice,
          base: basePrice,
          priority: avgPrice - basePrice,
          cost: calculateCost(avgPrice, "21000", ethPriceInUsd),
          time: calculateTime(avgPrice, "avg"),
        },
        high: {
          price: highPrice,
          base: basePrice,
          priority: highPrice - basePrice,
          cost: calculateCost(highPrice, "21000", ethPriceInUsd),
          time: calculateTime(highPrice, "high"),
        },
      });

      setEthPrice(ethPriceInUsd);

      const blockNumber = parseInt(statusResponse.data.result, 16); // Convert hex to decimal
      setLastBlock(blockNumber);

      setLoading(false);

      setLastRefreshed(new Date().toLocaleString());
      setNextUpdateIn(10);  // Reset to 10 seconds

    } 
    catch (error) 
    {
      setError("Error fetching gas or ETH price data");
    }
  };

  const calculateCost = (gasPrice, gasLimit, ethPriceInUsd) => 
  {
      const costInETH = (gasPrice * gasLimit) / 1e9;
      return (costInETH * ethPriceInUsd).toFixed(2);
  };

  const calculateTime = (gasPrice, type) => 
  {
      let blocksToConfirm = type === "low" ? Math.ceil(120 / gasPrice) : type === "avg" ? Math.ceil(60 / gasPrice) : Math.ceil(30 / gasPrice);
      return `~ ${Math.ceil(blocksToConfirm * blockTime)} sec`;
  };

  const handleSort = (key) => 
  {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") 
    {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...transactionData].sort((a, b) => 
  {
    if (sortConfig.key === "low" || sortConfig.key === "avg" || sortConfig.key === "high") {
      const aValue = gasData[sortConfig.key].price * a.gasLimit;
      const bValue = gasData[sortConfig.key].price * b.gasLimit;
      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
    } 
    else 
    {
      return sortConfig.direction === "asc" ? a[sortConfig.key] - b[sortConfig.key] : b[sortConfig.key] - a[sortConfig.key];
    }
  });

  // Pagination logic: calculate the data to be displayed for the current page
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + rowsPerPage);

  useEffect(() => 
  {
    fetchGasData();
    const interval = setInterval(fetchGasData, 10000);
    const countdownInterval = setInterval(() => 
    {
      setNextUpdateIn((prev) => (prev > 1 ? prev - 1 : 10));  // Countdown from 10 seconds
    }, 1000);

    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);

    return () => 
    {
        clearInterval(interval);
        clearInterval(countdownInterval);
        clearInterval(timer);
    };
  }, []);

  if (loading) {
    return (
      <div className="loading-container glass-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading Gas Data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container glass-container">
        <div className="error-icon">⚠️</div>
        <p className="error-text">{error}</p>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="app-background">
        <div className="gradient-sphere gradient-1"></div>
        <div className="gradient-sphere gradient-2"></div>
        <div className="gradient-sphere gradient-3"></div>
      </div>
      
      <header className="app-header glass-container">
        <div className="header-content">
          <h1 className="title">Ethereum Gas Tracker</h1>
          <div className="header-stats">
            <div className="stat-item">
              <span className="label">ETH Price:</span>
              <span className="value">${ethPrice.toFixed(2)}</span>
            </div>
            <div className="stat-item">
              <span className="label">Last Block:</span>
              <span className="value">{lastBlock}</span>
            </div>
            <div className="stat-item">
              <span className="label">Base Fee:</span>
              <span className="value">{basefee_i} gwei</span>
            </div>
            <div className="stat-item update-timer">
              <span className="label">Next Update:</span>
              <span className="value">{nextUpdateIn}s</span>
            </div>
          </div>
        </div>
        <div className="update-time">
          <span className="label">Last Updated:</span>
          <span className="value">{currentTime}</span>
          <span className="status-dot"></span>
          <span className="status-text">Mainnet</span>
        </div>
      </header>

      <main className="app-content">
        <section className="gas-cards-section glass-container">
          <GasCards gasData={gasData} />
        </section>

        <section className="gas-table-section glass-container">
          <div className="update-time" style={{ position: 'absolute', top: '10px', right: '10px' }}>
            <span>Next Update: {nextUpdateIn}s</span>
          </div>
          <h2 className="section-title">Transaction Costs</h2>
          <div className="table-wrapper">
            <GasTable 
              transactionData={paginatedData} 
              gasData={gasData} 
              ethPrice={ethPrice} 
              onSort={handleSort} 
              sortConfig={sortConfig} 
            />
            <div className="pagination">
              <select onChange={(e) => setRowsPerPage(Number(e.target.value))} value={rowsPerPage} className="glass-select">
                <option value={10}>10 rows</option>
                <option value={15}>15 rows</option>
                <option value={25}>25 rows</option>
                <option value={100}>100 rows</option>
              </select>
              <button className="pagination-btn" onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}>
                <span className="btn-text">Previous</span>
              </button>
              <span className="page-info">Page {currentPage} of {Math.ceil(sortedData.length / rowsPerPage)}</span>
              <button className="pagination-btn" onClick={() => setCurrentPage(Math.min(currentPage + 1, Math.ceil(sortedData.length / rowsPerPage)))}>
                <span className="btn-text">Next</span>
              </button>
            </div>
          </div>
        </section>

        <section className="gas-graph-section glass-container">
          <div className="update-time" style={{ position: 'absolute', top: '10px', right: '10px' }}>
            <span>Next Update: {nextUpdateIn}s</span>
          </div>
          <h2 className="section-title">Gas Price Trends</h2>
          <div className="graph-wrapper">
            <GasGraph_last1hour />
          </div>
        </section>
      </main>

      <footer className="app-footer glass-container">
        <p>Data updates every 10 seconds</p>
        <p className="powered-by">Powered by Ethereum Network</p>
      </footer>
    </div>
  );
}

export default App;
