const axios = require("axios");
const URL = "https://s3.amazonaws.com/roxiler.com/product_transaction.json";
const fetchData = async (URL) => {
  const { data } = await axios.get(URL);
  return data;
};

const HandleGetTransaction = async (req, res) => {
  const data = await fetchData(URL);
  return res.json(data);
};

const HandleGetTransactionPeMonth = async (req, res) => {
  try {
    const month = parseInt(req.params.month);
    if (isNaN(month) || month < 1 || month > 12) {
      return res.status(400).send("Invalid month parameter");
    }
    const data = await fetchData(URL);
    const filteredData = data.filter((item) => {
      const itemMonth = new Date(item.dateOfSale).getMonth() + 1;
      return itemMonth === month;
    });
    return res.json(filteredData);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching data");
  }
};

const HandleGetMonthStats = async (req, res) => {
  const month = parseInt(req.params.month, 10);
  try {
    const data = await fetchData(URL);
    const filteredSoldData = data.filter((item) => {
      const itemMonth = new Date(item.dateOfSale).getMonth() + 1;
      const monthCheck = itemMonth === month;
      const saleCheck = item.sold;
      return saleCheck && monthCheck;
    });
    const filteredNotSoldData = data.filter((item) => {
      const itemMonth = new Date(item.dateOfSale).getMonth() + 1;
      const monthCheck = itemMonth === month;
      const saleCheck = !item.sold;
      return saleCheck && monthCheck;
    });
    const totalSaleAmount = filteredSoldData.reduce(
      (total, item) => total + item.price,
      0
    );
    const totalSoldItems = filteredSoldData.length;
    const totalNotSoldItems = filteredNotSoldData.length;

    res.json({
      totalSaleAmount,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching data");
  }
};

const PriceCategory = (price) => {
  if (price >= 0 && price <= 100) return "0-100";
  if (price >= 101 && price <= 200) return "101-200";
  if (price >= 201 && price <= 300) return "201-300";
  if (price >= 301 && price <= 400) return "301-400";
  if (price >= 401 && price <= 500) return "401-500";
  if (price >= 501 && price <= 600) return "501-600";
  if (price >= 601 && price <= 700) return "601-700";
  if (price >= 701 && price <= 800) return "701-800";
  if (price >= 801 && price <= 900) return "801-900";
  return "901-above";
};

const HandleGetBarChart = async (req, res) => {
  try {
    const month = parseInt(req.params.month, 10);
    const data = await fetchData(URL);
    const filteredData = data.filter((item) => {
      itemMonth = new Date(item.dateOfSale).getMonth() + 1;
      return itemMonth === month;
    });

    const priceRanges = {
      "0-100": 0,
      "101-200": 0,
      "201-300": 0,
      "301-400": 0,
      "401-500": 0,
      "501-600": 0,
      "601-700": 0,
      "701-800": 0,
      "801-900": 0,
      "901-above": 0,
    };

    filteredData.forEach((item) => {
      const range = PriceCategory(item.price);
      priceRanges[range]++;
    });
    res.json(priceRanges);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching data");
  }
};

const HandleGetPieChart = async (req, res) => {
  try {
    const month = parseInt(req.params.month, 10);
    const data = await fetchData(URL);
    const filteredData = data.filter((item) => {
      const itemMonth = new Date(item.dateOfSale).getMonth() + 1;
      return itemMonth === month;
    });
    const categories = {};

    filteredData.forEach((item) => {
      const category = item.category;
      if (!categories[category]) {
        categories[category] = 0;
      }
      categories[category]++;
    });
    res.json(categories);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching data");
  }
};

const HandleAllCombined = async (req, res) => {
  try {
    const month = req.params.month;
    const statisticsResponse = await axios.get(
      `http://localhost:3000/statistics/${month}`
    );
    const barChartResponse = await axios.get(
      `http://localhost:3000/barchart/${month}`
    );
    const pieChartResponse = await axios.get(
      `http://localhost:3000/piechart/${month}`
    );

    const combinedData = {
      statistics: statisticsResponse.data,
      barChart: barChartResponse.data,
      pieChart: pieChartResponse.data,
    };
    res.json(combinedData);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching data");
  }
};

module.exports = {
  HandleGetTransaction,
  HandleGetMonthStats,
  HandleGetBarChart,
  HandleGetPieChart,
  HandleAllCombined,
  HandleGetTransactionPeMonth,
};
