import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

function Analysis({ items, categories }) {
  const [chartData, setChartData] = useState({});
  const [freshnessData, setFreshnessData] = useState({});
  const [statusData, setStatusData] = useState({});
  const [categoryData, setCategoryData] = useState({});
  const [todayFreshness, setTodayFreshness] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Get dates for the last month
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);

    const dates = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Initialize counts and freshness for each date
    const timestampCounts = {};
    const freshnessCounts = {};
    const statusCounts = {
      Fresh: 0,
      Alive: 0,
      Dying: 0,
      Dead: 0,
      Unknown: 0,
    };
    const categoryCounts = {};

    dates.forEach((date) => {
      const dateString = date.toLocaleDateString();
      timestampCounts[dateString] = 0;
      freshnessCounts[dateString] = [];
    });

    // Calculate freshness for each date
    items.forEach((item) => {
      const buyDate = new Date(item.buy_date);
      const expDate = new Date(item.exp_date);
      const category = item.ingredient?.category || "Unknown"; // Use ingredient.category

      if (!categoryCounts[category]) {
        categoryCounts[category] = 0;
      }
      categoryCounts[category]++;

      dates.forEach((date) => {
        const dateString = date.toLocaleDateString();
        if (buyDate <= date && date <= expDate) {
          timestampCounts[dateString]++;
          const status_ratio = (expDate - date) / (expDate - buyDate);

          let status;
          if (status_ratio < 0) {
            status = "Dead";
          } else if (status_ratio < 0.2) {
            status = "Dying";
          } else if (status_ratio < 0.5) {
            status = "Alive";
          } else {
            status = "Fresh";
          }

          freshnessCounts[dateString].push(status);
          statusCounts[status]++;
        }
      });
    });

    const calculateFreshness = (statuses) => {
      const statusValues = {
        Fresh: 1,
        Alive: 0.7,
        Dying: 0.4,
        Dead: 0,
        Unknown: 0,
      };
      const total = statuses.reduce(
        (acc, status) => acc + (statusValues[status] || 0),
        0
      );
      return total / statuses.length;
    };

    const freshnessData = Object.keys(freshnessCounts).reduce((acc, date) => {
      acc[date] = calculateFreshness(freshnessCounts[date]);
      return acc;
    }, {});

    const timestamps = Object.keys(timestampCounts);
    const values = Object.values(timestampCounts);
    const freshnessValues = Object.values(freshnessData);

    setChartData({
      labels: timestamps,
      datasets: [
        {
          label: "Items",
          data: values,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderWidth: 1,
          fill: true,
        },
      ],
    });

    setFreshnessData({
      labels: timestamps,
      datasets: [
        {
          label: "Freshness",
          data: freshnessValues,
          backgroundColor: "rgba(153, 102, 255, 0.4)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1,
          fill: true,
        },
      ],
    });

    setStatusData({
      labels: Object.keys(statusCounts),
      datasets: [
        {
          label: "Status",
          data: Object.values(statusCounts),
          backgroundColor: [
            "rgba(75, 192, 192, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(255, 99, 132, 0.6)",
            "rgba(153, 102, 255, 0.6)",
          ],
          borderColor: [
            "rgba(75, 192, 192, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(153, 102, 255, 1)",
          ],
          borderWidth: 1,
        },
      ],
    });

    setCategoryData({
      labels: Object.keys(categoryCounts),
      datasets: [
        {
          label: "Category",
          data: Object.values(categoryCounts),
          backgroundColor: "rgba(255, 159, 64, 0.6)",
          borderColor: "rgba(255, 159, 64, 1)",
          borderWidth: 1,
        },
      ],
    });

    // Calculate today's freshness
    const todayString = endDate.toLocaleDateString();
    const todayStatuses = freshnessCounts[todayString] || [];
    const todayFreshness = calculateFreshness(todayStatuses);
    setTodayFreshness(todayFreshness);

    setLoading(false); // Set loading to false after data is fetched
  }, [items, categories]);

  if (loading) {
    // Show loading spinner while data is being fetched
    return (
      <div className="loading-spinner">
        <div className="spinner">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="analysis-top">
        <h1>Analysis</h1>
        <div className="top">
          <p>Summary</p>
          <p>
            Today's Freshness:{" "}
            {todayFreshness !== null ? todayFreshness.toFixed(2) : "Loading..."}
          </p>
        </div>
        <div className="top">
          <p>By Buy Date</p>
          <div>
            {chartData.labels ? (
              <Line data={chartData} />
            ) : (
              <p>Loading chart...</p>
            )}
          </div>
        </div>
        <div className="top">
          <p>By Freshness</p>
          <div>
            {freshnessData.labels ? (
              <Line data={freshnessData} />
            ) : (
              <p>Loading chart...</p>
            )}
          </div>
        </div>
        <div className="top">
          <p>By Status</p>
          <div>
            {statusData.labels ? (
              <Bar data={statusData} options={{ indexAxis: "y" }} />
            ) : (
              <p>Loading chart...</p>
            )}
          </div>
        </div>
        <div className="top">
          <p>By Category</p>
          <div>
            {categoryData.labels ? (
              <Bar data={categoryData} options={{ indexAxis: "y" }} />
            ) : (
              <p>Loading chart...</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Analysis;
