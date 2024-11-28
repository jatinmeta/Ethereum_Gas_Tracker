import React from "react";
import './GasTable.css';


const GasTable = ({ transactionData, gasData, ethPrice, onSort, sortConfig }) => {
  const convertGasToUSD = (gasPrice, gasLimit) => ((gasPrice / 1e9) * gasLimit * ethPrice).toFixed(2);

  return (
    <table>
      <thead>
        <tr>
          <th onClick={() => onSort("action")}>Action</th>
          <th onClick={() => onSort("gasLimit")}>
            Gas Limit {sortConfig.key === "gasLimit" && (sortConfig.direction === "asc" ? "↑" : "↓")}
          </th>
          <th onClick={() => onSort("low")}>
            Low {sortConfig.key === "low" && (sortConfig.direction === "asc" ? "↑" : "↓")}
          </th>
          <th onClick={() => onSort("avg")}>
            Average {sortConfig.key === "avg" && (sortConfig.direction === "asc" ? "↑" : "↓")}
          </th>
          <th onClick={() => onSort("high")}>
            High {sortConfig.key === "high" && (sortConfig.direction === "asc" ? "↑" : "↓")}
          </th>
        </tr>
      </thead>
      <tbody>
        {transactionData.map((data, index) => (
          <tr key={index}>
            <td>{data.action}</td>
            <td>${data.gasLimit}</td>
            <td>${convertGasToUSD(gasData.low.price, data.gasLimit)}</td>
            <td>${convertGasToUSD(gasData.avg.price, data.gasLimit)}</td>
            <td>${convertGasToUSD(gasData.high.price, data.gasLimit)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default GasTable;
