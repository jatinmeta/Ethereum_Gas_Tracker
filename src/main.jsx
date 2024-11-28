import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
// add option for 
// By default -> average of highs ,avgs,lows respectively  of 1 minute
// day  -> each interval  = average of highs ,avgs,lows respectively  of 1 hour  
// month  -> each interval  = average of highs ,avgs,lows respectively of 1 day 
// year -> each interval  =  average of highs ,avgs,lows respectively of 1 month 

// on x-axis

// average high = high+high..../n


// make the separate components for graph and for       <div style={styles.cardContainer}>
//         <GasCard
//           label="😊 Low"
//           data={gasData.low[gasData.low.length - 1] || {}}
//         />
//         <GasCard
//           label="😁 Avg"
//           data={gasData.avg[gasData.avg.length - 1] || {}}
//         />
//         <GasCard
//           label="😃 High"
//           data={gasData.high[gasData.high.length - 1] || {}}
//         />


// both will be imported in app.jsx
// also make css file sparate for coponent respectivly
