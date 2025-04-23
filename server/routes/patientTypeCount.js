const express = require("express");
const router = express.Router();
const Checkup = require("../model/checkup");

function getDateRange(selectedDate, type) {
  const startDate = new Date(selectedDate);
  let endDate = new Date(selectedDate);

  if (type === "daily") {
    endDate.setDate(startDate.getDate() + 1);
  } else if (type === "monthly") {
    startDate.setDate(1);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0); // Set the last day of the month
  } else if (type === "yearly") {
    startDate.setMonth(0);
    startDate.setDate(1);
    endDate.setFullYear(endDate.getFullYear() + 1);
    endDate.setMonth(0);
    endDate.setDate(0);
  }

  return { startDate, endDate };
}

router.get("/patientTypeData", async (req, res) => {
  try {
    const { groupBy = "daily" } = req.query;

    let format;
    switch (groupBy) {
      case "daily":
        format = "%Y-%m-%d";
        break;
      case "monthly":
        format = "%Y-%m";
        break;
      case "yearly":
        format = "%Y";
        break;
      default:
        return res.status(400).json({ message: "Invalid groupBy value" });
    }

    const result = await Checkup.aggregate([
      {
        $group: {
          _id: {
            date: { $dateToString: { format: format, date: "$createdAt" } },
            type: "$patientType",
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id.date",
          type: "$_id.type",
          count: 1,
        },
      },
      {
        $sort: { date: 1 },
      },
      {
        $facet: {
          perDate: [{ $sort: { date: 1 } }],
          totals: [
            {
              $group: {
                _id: "$type",
                total: { $sum: "$count" },
              },
            },
            {
              $project: {
                _id: 0,
                type: "$_id",
                total: 1,
              },
            },
          ],
        },
      },
    ]);

    res.status(200).json(result[0]);
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while fetching patient type data." });
    console.error(error);
  }
});

module.exports = router;
