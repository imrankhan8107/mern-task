const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const myModel = mongoose.model("Col1", new mongoose.Schema({}), "Col1");

router.get("/transactions", async (req, res) => {
  try {
    const { page = 1, limit = 10, search, month } = req.query;
    const query = {};
    console.log(req.query);
    let regexMonth;

    if (month) {
      if (parseInt(month) < 10) {
        regexMonth = `-0${month}-`;
      } else {
        regexMonth = `-${month}-`;
      }
    } else {
      regexMonth = "";
    }
    if (search != "" && month != "undefined") {
      query.$and = [
        {
          dateOfSale: {
            $regex: regexMonth,
          },
        },
        {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { price: { $regex: search } },
          ],
        },
      ];
    } else if (search != "") {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { price: { $regex: search } },
      ];
    } else if (month != "undefined") {
      query.dateOfSale = {
        $regex: regexMonth,
      };
    }

    // Calculate pagination values
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Get total count of transactions
    const totalCount = await myModel.countDocuments(query);

    // Get transactions with pagination and search
    const transactions = await myModel
      .find(query)
      .skip(startIndex)
      .limit(limit);

    // Prepare response object
    const response = {
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      transactions,
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/bar-chart", async (req, res) => {
  const { month } = req.query;
  let regexMonth, items;

  if (month !== "undefined") {
    if (month < 10) {
      regexMonth = `-0${month}-`;
    } else {
      regexMonth = `-${month}-`;
    }
    items = await myModel.find({
      dateOfSale: {
        $regex: regexMonth,
      },
    });
  } else {
    items = await myModel.find({});
  }
  const segregatedItems = {};
  for (let i = 0; i <= 9; i++) {
    if (i !== 0 && i !== 9) {
      segregatedItems[`${i * 100 + 1}-${(i + 1) * 100}`] = 0;
    } else if (i == 9) {
      segregatedItems[`${i * 100 + 1}+`] = 0;
    } else {
      segregatedItems[`${i * 100}-${(i + 1) * 100}`] = 0;
    }
  }
  items.forEach(async (item) => {
    const classWidth = 100;
    const classIndex = Math.floor(item.get("price") / classWidth);
    let className;
    if (classIndex * classWidth >= 900) {
      className = `901+`;
    } else if (classIndex * classWidth <= 100) {
      className = `0-${classWidth}`;
    } else {
      className = `${classIndex * classWidth + 1}-${
        (classIndex + 1) * classWidth
      }`;
    }

    segregatedItems[className] = segregatedItems[className] + 1;
  });

  res.json(segregatedItems);
});

router.get("/pie-chart", async (req, res) => {
  const { month } = req.query;
  let regexMonth;

  if (month !== "undefined") {
    if (month < 10) {
      regexMonth = `-0${month}-`;
    } else {
      regexMonth = `-${month}-`;
    }
  } else {
    regexMonth = "";
  }
  try {
    const stats = await myModel.aggregate([
      {
        $match: {
          dateOfSale: {
            $regex: regexMonth,
          },
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/monthly-sale", async (req, res) => {
  try {
    let { month } = req.query;
    let regexMonth;
    if (month !== "undefined") {
      if (month < 10) {
        regexMonth = `-0${month}-`;
      } else {
        regexMonth = `-${month}-`;
      }
    } else {
      regexMonth = "";
    }
    const stats = await myModel.aggregate([
      {
        $match: {
          dateOfSale: {
            $regex: regexMonth,
          },
        },
      },
      {
        $group: {
          _id: month,
          "Total sale": { $sum: "$price" },
          "Total Sold items": {
            $sum: {
              $cond: [{ $eq: ["$sold", true] }, 1, 0],
            },
          },
          "Total unsold items": {
            $sum: {
              $cond: [{ $eq: ["$sold", false] }, 1, 0],
            },
          },
        },
      },
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
