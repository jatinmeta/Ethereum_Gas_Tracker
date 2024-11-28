import React from "react";
import "./GasCards.css";
const GasCards = ({ gasData }) => (
  <div className="card-container">
    {Object.entries(gasData).map(([key, data]) => (
      <div className="card">
      {key.toUpperCase() == "LOW" ? <p className="low">😁 LOW</p> : null}
      {key.toUpperCase() == "AVG" ? <p className="avg">😃 AVG</p> : null}
      {key.toUpperCase() == "HIGH" ?<p className="high"> 🙂 HIGH</p> : null}

        {/* <p>{key.toUpperCase()}</p> */}
        {key.toUpperCase() == "LOW" ? <h3 className="low_1">{data.price.toFixed(3)} gwei</h3> : null}
        {key.toUpperCase() == "AVG" ? <h3 className="avg_1">{data.price.toFixed(3)} gwei</h3> : null}
        {key.toUpperCase() == "HIGH" ?<h3 className="high_1">{data.price.toFixed(3)} gwei</h3> : null}  
        <p>Base : {data.base.toFixed(3)} Gwei | Priority : {data.priority.toFixed(3)} </p>
        <p> ${data.cost} | {data.time}</p>
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

