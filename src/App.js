// src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import StockSearch from "./components/StockSearch";
import StockInfo from "./components/StockInfo";
import Portfolio from "./components/Portfolio";
import "./App.css";

const App = () => {
  const [stock, setStock] = useState(null);
  const [portfolio, setPortfolio] = useState({});

  // Function to fetch stock data
  const fetchData = async (symbol) => {
    const apiKey = "cv2q71pr01qkvjnl9avgcv2q71pr01qkvjnl9b00"; // API key from Finnhub
    const apiUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;

    try {
      const response = await axios.get(apiUrl);
      console.log("API Response:", response.data); // Debugging log

      if (response.data?.c !== undefined) {
        setStock({
          symbol: symbol.toUpperCase() || "N/A", // Ensure a fallback
          price: response.data.c,
          high: response.data.h,
          low: response.data.l,
        });
      } else {
        setStock(null);
        alert("Stock data not found.");
      }
    } catch (error) {
      console.error("Error loading stock data:", error);
      setStock(null);
      alert("Failed to load stock data. Please try again.");
    }
  };

  // Function to buy stock
  const buyStock = () => {
    if (stock?.symbol) {
      setPortfolio((prevPortfolio) => {
        const newPortfolio = { ...prevPortfolio };
        if (newPortfolio[stock.symbol]) {
          newPortfolio[stock.symbol].shares += 1;
          newPortfolio[stock.symbol].totalCost += stock.price; // Update total cost
        } else {
          newPortfolio[stock.symbol] = {
            shares: 1,
            totalCost: stock.price, // Track total cost for average price calculation
            currentPrice: stock.price,
          };
        }
        return newPortfolio;
      });
    }
  };

  // Function to sell stock
  const sellStock = (symbol) => {
    if (!symbol || !portfolio?.[symbol]) return; // Early return if stock is not in the portfolio

    setPortfolio((prevPortfolio) => {
      const newPortfolio = { ...prevPortfolio };

      if (newPortfolio[symbol].shares > 1) {
        newPortfolio[symbol].shares -= 1;
        newPortfolio[symbol].totalCost -= newPortfolio[symbol].currentPrice; // Adjust total cost
      } else {
        delete newPortfolio[symbol]; // Remove stock if no shares left
      }

      return newPortfolio;
    });
  };

  // Simulate stock price changes every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPortfolio((prevPortfolio) => {
        const updatedPortfolio = { ...prevPortfolio };

        Object.keys(updatedPortfolio).forEach((symbol) => {
          const randomChange = (Math.random() - 0.5) * 5;
          updatedPortfolio[symbol].currentPrice += randomChange; // Simulate stock price movement
        });

        return updatedPortfolio;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <header>
        <h1>Simulation App</h1>
      </header>
      <StockSearch onSearch={fetchData} />
      <StockInfo stock={stock} />
      <div className="actions">
        <button onClick={buyStock} disabled={!stock}>
          Buy
        </button>
        <button
          onClick={() => sellStock(stock?.symbol)}
          disabled={!stock || !portfolio[stock?.symbol]}
        >
          Sell
        </button>
      </div>
      <Portfolio portfolio={portfolio} sellStock={sellStock} />
    </div>
  );
};

export default App;
