const express = require("express");
const cors = require("cors");
const { DataRouter } = require("./Routes/Data.routes");
const { connection } = require("./Connection/Connection");

require("dotenv").config();

const port = process.env.PORT || 8080;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Server");
});

app.use("/", DataRouter);

app.listen(port, async () => {
  try {
    await connection;
    console.log("Connected to Database");
  } catch (error) {
    console.log(error);
  }
  console.log(`Running on PORT ${port}`);
});
