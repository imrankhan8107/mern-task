const express = require("express");
const mongoose = require("mongoose");
const Router = require("./routes/index");
const cors = require("cors");
// const { MONGO_URL } = require("./env");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose
  .connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(async () => {
    const response = await fetch(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const data = await response.json();
    await mongoose.connection.db.collection("Col1").drop();
    await mongoose.connection.db.collection("Col1").insertMany(data);
    console.log("Connected to database and seeded the data");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api", Router);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
});
