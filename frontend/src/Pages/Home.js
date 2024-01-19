import React, { useEffect, useState } from "react";
import "../styles/Home.css";

export const monthToNumber = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

export const BASE_URL = "http://localhost:4000/api";
export default function Home() {
  const [jsonData, setjsonData] = useState({});
  const [data, setData] = useState([]);
  const [page, setpage] = useState(1);
  const [month, setmonth] = useState("March");
  useEffect(() => {
    async function fetchData() {
      let response;
      if (month === "Select Month") {
        response = await fetch(`${BASE_URL}/transactions?page=${page}`);
      } else {
        response = await fetch(
          `${BASE_URL}/transactions?page=${page}&month=${monthToNumber[month]}&search=`
        );
      }
      const jsondata = await response.json();
      setjsonData(jsondata);
      setData(jsondata.transactions);
    }
    fetchData();
  }, [page, month]);

  return (
    <div className="Home">
      <h1>Transaction Dashboard</h1>
      <div>
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => {
            async function fetchData() {
              let response;
              if (month === "Select Month") {
                response = await fetch(
                  `${BASE_URL}/transactions?page=${page}&search=${e.target.value}`
                );
              } else {
                response = await fetch(
                  `${BASE_URL}/transactions?page=${page}&month=${monthToNumber[month]}&search=${e.target.value}`
                );
              }
              const jsondata = await response.json();
              setData(jsondata.transactions);
            }
            fetchData();
          }}
        />
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
      <table border={1} className="data-table">
        <thead>
          <tr>
            {data.length > 0 &&
              Object.keys(data[0]).map((key) => {
                if (key !== "_id") {
                  return <th key={key}>{key}</th>;
                } else {
                  return null;
                }
              })}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 &&
            data.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.id}</td>
                <td>{transaction.title}</td>
                <td>{transaction.price}</td>
                <td>{transaction.description}</td>
                <td>{transaction.category}</td>
                <td>
                  <img
                    src={transaction.image}
                    alt={transaction.title}
                    height={"80px"}
                  />
                </td>
                <td>{transaction.sold ? "True" : "False"}</td>
                <td>{transaction.dateOfSale}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="footer">
        <span>
          Page No.: {page}/{jsonData.totalPages}
        </span>
        <span>
          <button
            disabled={jsonData.currentPage <= 1}
            onClick={() => {
              // if (jsonData.currentPage > 1) {
              setpage(page - 1);
              // }
            }}
          >
            Previous
          </button>

          <span>{page}</span>
          <button
            onClick={() => {
              // if (jsonData.currentPage < jsonData.totalPages) {
              setpage(page + 1);
              // }
            }}
            disabled={jsonData.currentPage >= jsonData.totalPages}
          >
            Next
          </button>
        </span>
        <span>Per Page: 10 </span>
      </div>
    </div>
  );
}
