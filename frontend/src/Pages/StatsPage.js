// // http://localhost:4000/api/bar-chart

import React, { useEffect, useState } from "react";
import {
  BarChart,
  PieChart,
  Pie,
  Cell,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { monthToNumber, BASE_URL } from "./Home";

const BarChartComp = () => {
  const [barData, setbarData] = useState({});
  const [pieData, setpieData] = useState([]);
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const [month, setmonth] = useState("March");
  const [simpleStats, setsimpleStats] = useState([{}]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/bar-chart?month=${monthToNumber[month]}`
        );
        const response1 = await fetch(
          `${BASE_URL}/pie-chart?month=${monthToNumber[month]}`
        );
        const response2 = await fetch(
          `${BASE_URL}/monthly-sale?month=${monthToNumber[month]}`
        );

        const result = await response.json();
        const result1 = await response1.json();
        const result2 = await response2.json();
        // console.log(result2);
        setsimpleStats(result2);
        let temp = [];
        Object.keys(result).forEach((key) => {
          temp.push({ range: key, value: result[key] });
        });
        setbarData(temp);
        setpieData(result1);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [month]); // Empty dependency array ensures that the effect runs only once

  return (
    <div>
      <h1>Statistics Dashboard</h1>
      <div>
        {Object.keys(simpleStats[0]).map(
          (key) =>
            key !== "_id" && (
              <div>
                {key}: {simpleStats[0][key]}
              </div>
            )
        )}
      </div>
      <div>
        <span>
          <label htmlFor="month">Select Month</label>
          <select
            name="month"
            id="month"
            onChange={(e) => setmonth(e.target.value)}
            value={month}
          >
            <option value="0">Select Month</option>
            {Object.keys(monthToNumber).map((key) => (
              <option value={key} onChange={(e) => setmonth(e.target.value)}>
                {key}
              </option>
            ))}
          </select>
        </span>
      </div>
      <span>
        <h2>Bar Chart</h2>
        <BarChart
          width={600}
          height={400}
          data={barData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </span>
      <span>
        <h2>Pie Chart</h2>
        <PieChart width={400} height={400}>
          <Pie
            data={pieData}
            dataKey="count"
            nameKey="_id"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </span>
    </div>
  );
};

export default BarChartComp;
