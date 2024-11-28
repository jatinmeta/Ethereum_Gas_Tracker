import React from "react";
import "./GasCards.css";

const GasCards = ({ gasData }) => (
  <div className="card-container">
    {Object.entries(gasData).map(([key, data]) => (
      <div key={key} className={`card ${key.toLowerCase()}-card`}>
        <div className="card-header">
          {key.toUpperCase() === "LOW" && <p className="status low">😁 LOW</p>}
          {key.toUpperCase() === "AVG" && <p className="status avg">😃 AVG</p>}
          {key.toUpperCase() === "HIGH" && <p className="status high"> 🙂 HIGH</p>}
        </div>
        
        <div className="card-price">
          {key.toUpperCase() === "LOW" && <h3 className="price low">{data.price.toFixed(3)} gwei</h3>}
          {key.toUpperCase() === "AVG" && <h3 className="price avg">{data.price.toFixed(3)} gwei</h3>}
          {key.toUpperCase() === "HIGH" && <h3 className="price high">{data.price.toFixed(3)} gwei</h3>}
        </div>

        <div className="card-details">
          <p className="fee-line">Base: {data.base.toFixed(3)} Gwei | Priority: {data.priority.toFixed(3)} Gwei</p>
        </div>

        <div className="card-footer">
          <p className="estimate">${data.cost} | {data.time}</p>
        </div>
      </div>
    ))}
  </div>
);

export default GasCards;
/*
Gas Price
Base Fee
Priority Fee
Estimated Cost
Time Estimate

 */
