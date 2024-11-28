import React from 'react';
import './GasTable.css';

const GasTable = ({ transactionData, gasData, ethPrice, onSort, sortConfig }) => {
  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  const calculateCost = (gasLimit, gasPrice) => {
    if (!gasData || !ethPrice) return "N/A";
    
    const gasPriceEth = gasPrice * 1e-9;
    const costEth = gasLimit * gasPriceEth;
    const costUsd = costEth * ethPrice;
    
    return `$${costUsd.toFixed(2)}`;
  };

  return (
    <table className="gas-table">
      <thead>
        <tr>
          <th onClick={() => onSort('action')}>
            Action
            <span className={`sort-indicator ${getClassNamesFor('action')}`}></span>
          </th>
          <th onClick={() => onSort('gasLimit')}>
            Gas Limit
            <span className={`sort-indicator ${getClassNamesFor('gasLimit')}`}></span>
          </th>
          <th onClick={() => onSort('low')}>
            Low Cost
            <span className={`sort-indicator ${getClassNamesFor('low')}`}></span>
          </th>
          <th onClick={() => onSort('avg')}>
            Average Cost
            <span className={`sort-indicator ${getClassNamesFor('avg')}`}></span>
          </th>
          <th onClick={() => onSort('high')}>
            High Cost
            <span className={`sort-indicator ${getClassNamesFor('high')}`}></span>
          </th>
        </tr>
      </thead>
      <tbody>
        {transactionData.map((transaction, index) => (
          <tr key={index}>
            <td>{transaction.action}</td>
            <td className="monospace">{transaction.gasLimit.toLocaleString()}</td>
            <td className="cost cost-low">
              {calculateCost(transaction.gasLimit, gasData?.low?.price)}
            </td>
            <td className="cost cost-avg">
              {calculateCost(transaction.gasLimit, gasData?.avg?.price)}
            </td>
            <td className="cost cost-high">
              {calculateCost(transaction.gasLimit, gasData?.high?.price)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default GasTable;
