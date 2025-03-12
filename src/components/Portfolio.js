import React from "react";

const Portfolio = ({ portfolio, sellStock }) => {
  const sumOfTotalValue = () => {
    return Object.values(portfolio)
      .reduce((total, stock) => {
        return total + stock.shares * stock.currentPrice;
      }, 0)
      .toFixed(2);
  };

  return (
    <div className="portfolio">
      <h2>Portfolio</h2>
      {Object.keys(portfolio).length === 0 ? (
        <p>No stock owned.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Stock</th>
              <th>Shares</th>
              <th>Avg Price</th>
              <th>Current Price</th>
              <th>Profit/Loss</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(portfolio).map(([symbol, stock]) => (
              <tr key={symbol}>
                <td>{symbol}</td>
                <td>{stock.shares}</td>
                <td>${(stock.totalCost / stock.shares).toFixed(2)}</td>
                <td>${stock.currentPrice.toFixed(2)}</td>
                <td
                  style={{
                    color:
                      stock.currentPrice > stock.totalCost / stock.shares
                        ? "green"
                        : "red",
                  }}
                >
                  $
                  {(
                    stock.shares *
                    (stock.currentPrice - stock.totalCost / stock.shares)
                  ).toFixed(2)}
                </td>
                <td>
                  <button onClick={() => sellStock(symbol)}>Sell</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <h3>Total Portfolio Value: ${sumOfTotalValue()}</h3>
    </div>
  );
};

export default Portfolio;
