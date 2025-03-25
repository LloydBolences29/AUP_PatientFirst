const Visit = require("../model/VisitTable");

const getDateRange = (date, type) => {
  let startDate, endDate;

  // Convert the selected date to UTC to avoid shifting
  const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

  if (type === "daily") {
    startDate = new Date(utcDate);
    endDate = new Date(utcDate);
    endDate.setUTCHours(23, 59, 59, 999);
  } else if (type === "monthly") {
    startDate = new Date(Date.UTC(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), 1));
    endDate = new Date(Date.UTC(utcDate.getUTCFullYear(), utcDate.getUTCMonth() + 1, 0, 23, 59, 59, 999));
  } else if (type === "yearly") {
    startDate = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
    endDate = new Date(Date.UTC(utcDate.getUTCFullYear(), 11, 31, 23, 59, 59, 999));
  } else {
    throw new Error("Invalid type specified");
  }

  return { startDate, endDate };
};

const typeOfVisit = async (req, res) => {
  try {
    const { date, type } = req.query;

    if (!date || !type) {
      return res.status(400).json({ error: "Date and type are required" });
    }

    // ✅ Ensure the input date is treated as UTC
    const selectedDate = new Date(date + "T00:00:00.000Z");

    if (isNaN(selectedDate)) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const { startDate, endDate } = getDateRange(selectedDate, type);

    console.log("📅 Querying database with:", { visit_date: { $gte: startDate, $lt: endDate } });
    console.log("🛠️ Debugging Date Range:", { startDate, endDate, selectedDate });

    const aggregationResult = await Visit.aggregate([
      {
        $match: {
          visit_date: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: "$purpose", // Group by purpose
          count: { $sum: 1 }, // Count occurrences
        },
      },
    ]);

    console.log("✅ Aggregation result:", aggregationResult);
    res.json(aggregationResult);
  } catch (error) {
    console.error("❌ Error fetching patient count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { typeOfVisit };
