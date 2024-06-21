const { Router } = require("express");

const DataRouter = Router();

const {
  HandleGetTransaction,
  HandleGetTransactionPeMonth,
  HandleGetMonthStats,
  HandleGetBarChart,
  HandleGetPieChart,
  HandleAllCombined,
} = require("../Controller/Data.controller");

DataRouter.get("/transactions", HandleGetTransaction);
DataRouter.get("/transactions/:month", HandleGetTransactionPeMonth);
DataRouter.get("/statistics/:month", HandleGetMonthStats);
DataRouter.get("/barchart/:month", HandleGetBarChart);
DataRouter.get("/piechart/:month", HandleGetPieChart);
DataRouter.get("/combined/:month", HandleAllCombined);

module.exports = { DataRouter };
